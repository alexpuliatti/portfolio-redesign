import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photographyDir = path.join(__dirname, '../public/photography');
const THUMB_WIDTH = 60; // Slightly larger to prevent JPEG macroblock artifacts through blur

async function generateThumbnail(inputPath) {
    const parsed = path.parse(inputPath);
    // Skip files that are already thumbnails or compressed showcase copies
    if (parsed.name.endsWith('_thumb') || parsed.name.endsWith('_compressed')) return;

    const thumbPath = path.join(parsed.dir, `${parsed.name}_thumb.jpg`);

    // Skip if thumbnail already exists
    try {
        await fs.access(thumbPath);
        return; // already generated
    } catch (_) {}

    try {
        await sharp(inputPath)
            .rotate() // respect EXIF orientation
            .resize({ width: 60 })
            .jpeg({ quality: 70 })
            .toFile(thumbPath);

        const inputStats = await fs.stat(inputPath);
        const thumbStats = await fs.stat(thumbPath);
        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(thumbPath)} (${(thumbStats.size / 1024).toFixed(1)}KB)`);
    } catch (err) {
        console.error(`❌ Failed: ${path.basename(inputPath)}: ${err.message}`);
    }
}

async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(fullPath);
        } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
            await generateThumbnail(fullPath);
        }
    }
}

async function main() {
    console.log('Generating LQIP thumbnails for all photography images...\n');
    await walk(photographyDir);
    console.log('\n🎉 Done! All thumbnails generated.');
}

main();
