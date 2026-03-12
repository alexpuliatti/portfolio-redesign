const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Execute from project root, so __dirname resolves to scripts/
const srcDir = path.join(__dirname, '..', 'public', 'asia-stillz');
const destDir = path.join(__dirname, '..', 'public', 'asia-stillz-cropped');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'));

async function processImages() {
    console.log('Creating vertical crops...');
    for (const f of files.slice(0, 5)) {
        const outName = f.replace('.png', '_vertical.png');
        await sharp(path.join(srcDir, f))
            .resize({ width: 1080, height: 1920, fit: 'cover' })
            .toFile(path.join(destDir, outName));
        console.log(`Saved ${outName}`);
    }

    console.log('Creating square crops...');
    for (const f of files.slice(5, 10)) {
        const outName = f.replace('.png', '_square.png');
        await sharp(path.join(srcDir, f))
            .resize({ width: 1080, height: 1080, fit: 'cover' })
            .toFile(path.join(destDir, outName));
        console.log(`Saved ${outName}`);
    }
}
processImages().then(() => console.log('Done.')).catch(console.error);
