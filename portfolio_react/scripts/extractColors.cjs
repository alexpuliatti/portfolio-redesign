const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = path.join(__dirname, '../public/asia-stillz');
const outputPath = path.join(__dirname, '../src/imageData.json');

/**
 * Extract a palette by sampling the center vertical strip of the image.
 * This gives us the colors that would visually appear along the connecting line.
 * We filter out near-black pixels to get the interesting colors.
 */
async function extractPalette(filePath, numColors = 5) {
    const metadata = await sharp(filePath).metadata();
    const { width, height } = metadata;

    // Sample a narrow center strip (10% of width, centered)
    const stripWidth = Math.max(Math.floor(width * 0.1), 10);
    const left = Math.floor((width - stripWidth) / 2);

    // Resize the center strip to a small image to get pixel data
    const centerStrip = await sharp(filePath)
        .extract({ left, top: 0, width: stripWidth, height })
        .resize(1, numColors * 2, { fit: 'fill' }) // Sample into a 1-pixel wide column
        .raw()
        .toBuffer();

    const colors = [];
    const channels = 3; // RGB

    for (let i = 0; i < centerStrip.length; i += channels) {
        const r = centerStrip[i];
        const g = centerStrip[i + 1];
        const b = centerStrip[i + 2];

        // Calculate brightness
        const brightness = (r + g + b) / 3;

        // Only include colors that aren't too dark (brightness > 20)
        // This filters out the black backgrounds
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        
        if (brightness > 20) {
            colors.push(hex);
        }
    }

    // Deduplicate consecutive identical colors
    const filtered = colors.filter((c, i) => i === 0 || c !== colors[i - 1]);

    // If we found no interesting colors, try getting the dominant via resize to 1x1 
    if (filtered.length === 0) {
        const { dominant } = await sharp(filePath).stats();
        if (dominant) {
            const hex = `#${dominant.r.toString(16).padStart(2, '0')}${dominant.g.toString(16).padStart(2, '0')}${dominant.b.toString(16).padStart(2, '0')}`;
            const brightness = (dominant.r + dominant.g + dominant.b) / 3;
            if (brightness > 20) {
                return [hex];
            }
        }
        // Truly dark image — use subtle dark accent colors
        return ['#1a1a2e', '#16213e', '#0f3460'];
    }

    // Pick up to numColors evenly spaced
    if (filtered.length > numColors) {
        const step = filtered.length / numColors;
        const result = [];
        for (let i = 0; i < numColors; i++) {
            result.push(filtered[Math.floor(i * step)]);
        }
        return result;
    }

    return filtered;
}

async function extractColors() {
    try {
        const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.png') || file.endsWith('.jpg'));
        const imagesData = [];

        console.log(`Processing ${files.length} images...`);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            
            // Extract a palette of colors from center column
            const palette = await extractPalette(filePath);
            
            // Also get the overall dominant for image shadow
            const { dominant } = await sharp(filePath).stats();
            const mainColor = dominant 
                ? `#${dominant.r.toString(16).padStart(2, '0')}${dominant.g.toString(16).padStart(2, '0')}${dominant.b.toString(16).padStart(2, '0')}`
                : '#ffffff';

            imagesData.push({
                src: file,
                color: mainColor,
                palette: palette,
            });

            console.log(`  ${file}: ${mainColor} | palette: [${palette.join(', ')}]`);
        }

        fs.writeFileSync(outputPath, JSON.stringify(imagesData, null, 2));
        console.log(`\nSuccessfully generated ${outputPath}`);

    } catch (error) {
        console.error('Error processing images:', error);
    }
}

extractColors();
