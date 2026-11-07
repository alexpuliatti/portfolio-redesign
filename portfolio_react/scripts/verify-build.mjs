import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import projects, { getImagePath } from '../src/photographyData.js';
import { photoRuntimeManifest } from './photo-runtime-manifest.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const directoryArgument = process.argv.indexOf('--directory');
const root = directoryArgument === -1 ? path.join(projectRoot, 'dist') : path.resolve(process.argv[directoryArgument + 1]);
const MAX_BYTES = 900_000_000;

async function filesIn(directory, prefix = '') {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(path.join(directory, entry.name), relative));
    else if (entry.isFile()) result.push({ path: relative, bytes: (await fs.stat(path.join(directory, entry.name))).size });
    else throw new Error(`Unexpected non-file in build: ${relative}`);
  }
  return result;
}

const allFiles = await filesIn(root);
const bytes = allFiles.reduce((total, file) => total + file.bytes, 0);
if (bytes > MAX_BYTES) throw new Error(`Deployment blocked: ${(bytes / 1e6).toFixed(1)} MB exceeds the 900 MB build budget. Nothing has been pushed.`);
for (const required of ['index.html', '404.html', 'CNAME', '.nojekyll']) {
  if (!allFiles.some((file) => file.path === required)) throw new Error(`Required deployment file missing: ${required}`);
}

const manifest = JSON.parse(await fs.readFile(path.join(projectRoot, 'src/photographyImages.json'), 'utf8'));
const runtime = JSON.parse(await fs.readFile(path.join(projectRoot, 'src/photographySources.json'), 'utf8'));
if (JSON.stringify(runtime) !== JSON.stringify(photoRuntimeManifest(manifest))) throw new Error('Browser photography sources are out of date; run npm run photos:prepare.');
const expectedSources = new Set(projects.flatMap((project) => [...project.showcaseImages, ...project.detailImages].map((file) => getImagePath(project.slug, file))));
if (Object.keys(manifest.images).length !== expectedSources.size) throw new Error('Photography manifest does not match the project data.');
const expectedFiles = new Set();
for (const source of expectedSources) {
  const image = manifest.images[source];
  if (!image) throw new Error(`Missing photograph in manifest: ${source}`);
  expectedFiles.add(image.thumb);
  for (const format of ['avif', 'webp']) {
    if (!image[format]?.length) throw new Error(`No ${format} versions for ${source}`);
    let previousWidth = 0;
    for (const variant of image[format]) {
      const file = path.join(root, variant.src);
      const stat = await fs.stat(file);
      const metadata = await sharp(file).metadata();
      const expectedFormat = format === 'avif' ? 'heif' : 'webp';
      if (metadata.format !== expectedFormat || metadata.width !== variant.width || metadata.height !== variant.height || stat.size !== variant.bytes) throw new Error(`Incorrect encoded photograph: ${variant.src}`);
      if (variant.width <= previousWidth) throw new Error(`Invalid responsive widths: ${source}`);
      if (variant.width > image.width || variant.height > image.height) throw new Error(`Upscaled photograph: ${variant.src}`);
      previousWidth = variant.width;
      expectedFiles.add(variant.src);
    }
  }
  const thumb = await sharp(path.join(root, image.thumb)).metadata();
  if (thumb.format !== 'jpeg') throw new Error(`Invalid thumbnail: ${image.thumb}`);
}

const publishedPhotography = allFiles.filter((file) => file.path.startsWith(`photography${path.sep}`));
for (const file of publishedPhotography) {
  if (!expectedFiles.has(file.path)) throw new Error(`Unexpected photograph in deployment: ${file.path}`);
}
if (publishedPhotography.length !== expectedFiles.size) throw new Error('The build is missing photography files.');
for (const file of allFiles) {
  if (file.path.includes('asset-archive') || file.path.includes('.photo-staging')) throw new Error(`Local backup leaked into deployment: ${file.path}`);
}
console.log(`Build verified: ${expectedSources.size} photographs, ${expectedFiles.size} photo files, ${allFiles.length} total files, ${(bytes / 1e6).toFixed(1)} MB of 900 MB budget. Local originals are excluded.`);
