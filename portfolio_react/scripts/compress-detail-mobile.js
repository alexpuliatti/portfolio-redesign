import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photographyDir = path.join(__dirname, '..', 'public', 'photography');
const MAX_WIDTH = 1200;
const QUALITY = 70;

async function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (
            entry.isFile() &&
            /\.(jpg|jpeg|png)$/i.test(entry.name) &&
            !entry.name.includes('_thumb') &&
            !entry.name.includes('_compressed') &&
            !entry.name.includes('_mobile') &&
            !entry.name.startsWith('SHOWCASE_')
        ) {
            const ext = path.extname(entry.name);
            const baseName = path.basename(entry.name, ext);
            const outputFileName = `${baseName}_mobile.jpg`;
            const outputPath = path.join(dir, outputFileName);

            // Skip if mobile variant already exists
            if (fs.existsSync(outputPath)) {
                console.log(`⏭️  Skipping ${entry.name} — ${outputFileName} already exists`);
                continue;
            }

            try {
                const info = await sharp(fullPath)
                    .rotate()
                    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                    .jpeg({ quality: QUALITY, progressive: true })
                    .toFile(outputPath);

                const inputStats = fs.statSync(fullPath);
                const inputMB = (inputStats.size / (1024 * 1024)).toFixed(2);
                const outputKB = (info.size / 1024).toFixed(0);
                const savings = ((inputStats.size - info.size) / inputStats.size * 100).toFixed(1);

                console.log(`✅ ${entry.name}: ${inputMB}MB → ${outputKB}KB (${savings}% smaller)`);
            } catch (err) {
                console.error(`❌ Error processing ${entry.name}:`, err.message);
            }
        }
    }
}

async function run() {
    console.log('Generating mobile-optimized variants for detail images...\n');
    await processDirectory(photographyDir);
    console.log('\n🎉 Done! All mobile variants generated.');
}

run();
