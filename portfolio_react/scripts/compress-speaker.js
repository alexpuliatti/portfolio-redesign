import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const speakerDir = path.join(__dirname, '../public/speaker');
const THUMB_WIDTH = 200;
const FULL_WIDTH = 2000;

async function processImage(inputPath) {
    const parsed = path.parse(inputPath);
    if (!['.jpg', '.jpeg', '.png'].includes(parsed.ext.toLowerCase())) return;
    if (parsed.name.endsWith('_compressed') || parsed.name.endsWith('_thumb_compressed') || parsed.name.endsWith('_vertical')) return;

    // We will generate .webp for the Design Subpages
    const fullWebpPath = path.join(parsed.dir, `${parsed.name}.webp`);
    
    // Check if it's supposed to be vertical based on aspect ratio or filename
    let isVertical = parsed.name.includes('_vertical');
    
    try {
        const metadata = await sharp(inputPath).metadata();
        if (metadata.height > metadata.width) {
            isVertical = true;
        }

        const finalName = isVertical ? `${parsed.name}_vertical.webp` : `${parsed.name}.webp`;
        const finalPath = path.join(parsed.dir, finalName);

        // Generate full optimized webp
        await sharp(inputPath)
            .rotate()
            .resize({ width: FULL_WIDTH, withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toFile(finalPath);

        console.log(`✅ Generated: ${finalName}`);
    } catch (err) {
        console.error(`❌ Failed processing ${parsed.base}: ${err.message}`);
    }
}

async function main() {
    console.log('Processing speaker images...\n');
    try {
        const files = await fs.readdir(speakerDir);
        for (const file of files) {
            const fullPath = path.join(speakerDir, file);
            await processImage(fullPath);
        }
        console.log('\n🎉 Done processing speaker images.');
    } catch(e) {
        console.error("Error reading dir", e);
    }
}

main();
