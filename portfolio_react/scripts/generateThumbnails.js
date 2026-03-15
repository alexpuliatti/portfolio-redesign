import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photographyDir = path.join(__dirname, '../public/photography');
const THUMB_WIDTH = 200; // Large enough for smooth blur-up LQIP (no blocky artifacts)

async function generateThumbnail(inputPath) {
    const parsed = path.parse(inputPath);
    // Skip files that are already thumbnails, compressed, or mobile variants
    if (parsed.name.endsWith('_thumb') || parsed.name.endsWith('_compressed') || parsed.name.endsWith('_mobile')) return;

    const thumbPath = path.join(parsed.dir, `${parsed.name}_thumb.jpg`);

    try {
        await sharp(inputPath)
            .rotate() // respect EXIF orientation
            .resize({ width: THUMB_WIDTH })
            .jpeg({ quality: 60 })
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
