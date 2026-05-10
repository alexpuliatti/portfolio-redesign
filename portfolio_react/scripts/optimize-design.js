import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToOptimize = [
    path.join(__dirname, '..', 'public', 'speaker'),
    path.join(__dirname, '..', 'public', 'vanity')
];

const MAX_WIDTH = 1600;
const QUALITY = 80;

async function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (
            entry.isFile() &&
            /\.(jpg|jpeg|png)$/i.test(entry.name)
        ) {
            const ext = path.extname(entry.name);
            const baseName = path.basename(entry.name, ext);
            const outputFileName = `${baseName}.webp`;
            const outputPath = path.join(dir, outputFileName);

            try {
                const info = await sharp(fullPath)
                    .rotate() // preserve EXIF orientation
                    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                    .webp({ quality: QUALITY, effort: 6 }) // effort 6 for best compression/quality ratio
                    .toFile(outputPath);

                const inputStats = fs.statSync(fullPath);
                const inputMB = (inputStats.size / (1024 * 1024)).toFixed(2);
                const outputKB = (info.size / 1024).toFixed(0);
                const savings = ((inputStats.size - info.size) / inputStats.size * 100).toFixed(1);

                console.log(`✅ ${entry.name} -> ${outputFileName}: ${inputMB}MB -> ${outputKB}KB (${savings}% smaller)`);
                
                // Optionally delete the original large file to save repo space
                // fs.unlinkSync(fullPath);
            } catch (err) {
                console.error(`❌ Error processing ${entry.name}:`, err.message);
            }
        }
    }
}

async function run() {
    console.log('Optimizing design images...\n');
    for (const dir of dirsToOptimize) {
        await processDirectory(dir);
    }
    console.log('\n🎉 Done! All images optimized to high-quality WebP.');
}

run();
