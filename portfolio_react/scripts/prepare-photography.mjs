import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import projects, { getImagePath } from '../src/photographyData.js';
import { photoRuntimeManifest } from './photo-runtime-manifest.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const archive = path.resolve(projectRoot, '../asset-archive/photography-before-avif');
const publicPhotos = path.join(projectRoot, 'public/photography');
const staging = path.join(projectRoot, '.photo-staging');
const settings = {
  version: 1,
  avif: { quality: 80, effort: 4, chromaSubsampling: '4:4:4', bitdepth: 8 },
  webp: { quality: 90, effort: 6, smartSubsample: true },
  portraitMaxEdge: 3840,
  landscapeMaxEdge: 3840,
  fallbackMaxEdge: 1920,
  smallerEdges: [960, 1920],
  colourProfile: 'srgb',
};

const exists = async (file) => fs.access(file).then(() => true, () => false);
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const fingerprint = digest(JSON.stringify(settings));
const atomicJson = async (file, data) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(`${file}.tmp`, `${JSON.stringify(data, null, 2)}\n`);
  await fs.rename(`${file}.tmp`, file);
};

async function inventory(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await inventory(path.join(directory, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unexpected non-file in photography archive: ${relative}`);
  }
  return files;
}

async function preserveSource() {
  const manifestPath = path.join(archive, 'manifest.json');
  if (await exists(manifestPath)) {
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    for (const file of manifest.files) {
      if (digest(await fs.readFile(path.join(archive, 'files', file.path))) !== file.sha256) {
        throw new Error(`Backup checksum mismatch: ${file.path}`);
      }
    }
    console.log(`Verified existing local backup: ${manifest.files.length} files.`);
    return manifest;
  }

  const files = [];
  for (const relative of await inventory(publicPhotos)) {
    const source = path.join(publicPhotos, relative);
    const destination = path.join(archive, 'files', relative);
    const bytes = await fs.readFile(source);
    const sha256 = digest(bytes);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    if (!await exists(destination)) await fs.copyFile(source, destination, fs.constants.COPYFILE_EXCL);
    if (digest(await fs.readFile(destination)) !== sha256) throw new Error(`Backup verification failed: ${relative}`);
    files.push({ path: relative, bytes: bytes.length, sha256 });
  }
  const manifest = { createdAt: new Date().toISOString(), originalDirectory: 'portfolio_react/public/photography', files };
  await atomicJson(manifestPath, manifest);
  console.log(`Created and checksum-verified local backup: ${files.length} files, ${files.reduce((n, f) => n + f.bytes, 0)} bytes.`);
  return manifest;
}

async function prepareImage(sourceKey, sourceManifest) {
  const relative = decodeURIComponent(sourceKey.slice('photography/'.length));
  const source = path.join(archive, 'files', relative);
  const original = sourceManifest.files.find((file) => file.path === relative);
  if (!original) throw new Error(`Original is not in verified backup: ${relative}`);
  const id = digest(`${sourceKey}:${original.sha256}:${fingerprint}`).slice(0, 16);
  const cacheFile = path.join(staging, 'metadata', `${id}.json`);

  if (await exists(cacheFile)) {
    const cached = JSON.parse(await fs.readFile(cacheFile, 'utf8'));
    const outputs = [...cached.avif, ...cached.webp, { src: cached.thumb }];
    let valid = true;
    for (const output of outputs) {
      const file = path.join(staging, 'public', output.src);
      if (!await exists(file) || (output.bytes && (await fs.stat(file)).size !== output.bytes)) valid = false;
    }
    if (valid) return cached;
  }

  const metadata = await sharp(source).metadata();
  const rotated = [5, 6, 7, 8].includes(metadata.orientation);
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;
  const maximum = Math.min(Math.max(width, height), width > height ? settings.landscapeMaxEdge : settings.portraitMaxEdge);
  const edges = [...settings.smallerEdges.filter((edge) => edge < maximum * 0.8), maximum];
  const slug = path.dirname(relative);
  const destinationDirectory = path.join(staging, 'public/photography', slug);
  await fs.mkdir(destinationDirectory, { recursive: true });
  const result = { width, height, sourceSha256: original.sha256, thumb: `photography/${slug}/${id}-thumb.jpg`, avif: [], webp: [] };
  const oldThumb = path.join(archive, 'files', relative.replace(/\.[^.]+$/, '_thumb.jpg'));
  await fs.copyFile(oldThumb, path.join(staging, 'public', result.thumb));

  for (const format of ['avif', 'webp']) {
    const formatEdges = format === 'avif' ? edges : [Math.min(maximum, settings.fallbackMaxEdge)];
    for (const edge of formatEdges) {
      const relativeOutput = `photography/${slug}/${id}-${edge}.${format}`;
      const output = path.join(staging, 'public', relativeOutput);
      const temporary = `${output}.tmp`;
      const info = await sharp(source)
        .rotate()
        .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
        .withIccProfile(settings.colourProfile)
        [format](settings[format])
        .toFile(temporary);
      await fs.rename(temporary, output);
      result[format].push({ src: relativeOutput, width: info.width, height: info.height, bytes: info.size });
    }
  }
  await atomicJson(cacheFile, result);
  return result;
}

async function main() {
  sharp.concurrency(2);
  sharp.cache({ memory: 64 });
  const sourceManifest = await preserveSource();
  if (process.argv.includes('--verify-backup')) return;
  const installedManifest = path.join(projectRoot, 'src/photographyImages.json');
  if (await exists(installedManifest)) {
    const installed = JSON.parse(await fs.readFile(installedManifest, 'utf8'));
    if (digest(JSON.stringify(installed.settings)) === fingerprint) {
      const outputs = Object.values(installed.images).flatMap((image) => [...image.avif, ...image.webp, { src: image.thumb }]);
      const present = await Promise.all(outputs.map((output) => exists(path.join(projectRoot, 'public', output.src))));
      if (present.every(Boolean)) {
        await atomicJson(path.join(projectRoot, 'src/photographySources.json'), photoRuntimeManifest(installed));
        console.log('Prepared photography is already installed. Verified local backup and refreshed browser sources; no images re-encoded.');
        return;
      }
    }
  }
  const sourceKeys = [...new Set(projects.flatMap((project) => [...project.showcaseImages, ...project.detailImages].map((file) => getImagePath(project.slug, file))))];
  const images = {};
  let next = 0;
  let completed = 0;
  const started = Date.now();
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < sourceKeys.length) {
      const key = sourceKeys[next++];
      images[key] = await prepareImage(key, sourceManifest);
      completed++;
      console.log(`[${completed}/${sourceKeys.length}] ${decodeURIComponent(key)} (${Math.round((Date.now() - started) / 1000)}s)`);
    }
  }));

  const sortedImages = Object.fromEntries(Object.entries(images).sort(([a], [b]) => a.localeCompare(b)));
  const manifest = { settings, images: sortedImages };
  const outputs = Object.values(images).flatMap((image) => [...image.avif, ...image.webp, { src: image.thumb }]);
  let bytes = 0;
  for (const output of outputs) {
    const file = path.join(staging, 'public', output.src);
    const stat = await fs.stat(file);
    const metadata = await sharp(file).metadata();
    if (!metadata.width || !metadata.height) throw new Error(`Invalid output: ${output.src}`);
    bytes += stat.size;
  }
  if (bytes > 850_000_000) throw new Error(`Generated photography is ${(bytes / 1e6).toFixed(1)} MB; review sizes before installation. Original public folder is unchanged.`);

  // Re-check the source copy before replacing any files in the deployment directory.
  await preserveSource();
  const previousPublic = path.join(staging, `previous-public-${Date.now()}`);
  await fs.rename(publicPhotos, previousPublic);
  try {
    await fs.rename(path.join(staging, 'public/photography'), publicPhotos);
    await atomicJson(path.join(projectRoot, 'src/photographyImages.json'), manifest);
    await atomicJson(path.join(projectRoot, 'src/photographySources.json'), photoRuntimeManifest(manifest));
  } catch (error) {
    if (await exists(publicPhotos)) await fs.rename(publicPhotos, path.join(staging, `failed-install-${Date.now()}`));
    await fs.rename(previousPublic, publicPhotos);
    throw error;
  }
  // The complete verified backup remains in asset-archive; keep this second local copy too.
  console.log(`Prepared ${sourceKeys.length} photographs, ${outputs.length} output files, ${(bytes / 1e6).toFixed(1)} MB. No Git operations or deployment performed.`);
  console.log(`Originals: ${archive}`);
}

await main();
