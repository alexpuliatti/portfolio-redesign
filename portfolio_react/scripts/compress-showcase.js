import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photographyDir = path.join(__dirname, '..', 'public', 'photography');
const MAX_WIDTH = 1200; // reasonable max width for gallery list (85vw)
const QUALITY = 80;

async function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (entry.isFile() && entry.name.match(/^SHOWCASE_.*\.(jpg|jpeg|png)$/i) && !entry.name.includes('_compressed')) {
            const ext = path.extname(entry.name);
            const baseName = path.basename(entry.name, ext);
            
            // output file format
            const outputFileName = `${baseName}_compressed.jpg`;
            const outputPath = path.join(dir, outputFileName);
            
            console.log(`Compressing ${entry.name}...`);
            try {
                await sharp(fullPath)
                    .rotate() // Auto-rotate based on EXIF before resizing
                    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                    .jpeg({ quality: QUALITY, progressive: true })
                    .toFile(outputPath);
                console.log(` -> Saved ${outputFileName}`);
            } catch (err) {
                console.error(`Error processing ${entry.name}:`, err);
            }
        }
    }
}

async function run() {
    console.log('Starting compression of SHOWCASE images...');
    await processDirectory(photographyDir);
    console.log('Done!');
}

run();
