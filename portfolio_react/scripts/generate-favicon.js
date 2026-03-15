import opentype from 'opentype.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontPath = path.join(__dirname, '../src/assets/fonts/Arrow Font Regular.otf');
const outputPath = path.join(__dirname, '../public/favicon.svg');

const font = opentype.loadSync(fontPath);
const text = 'AP';

// Get the path for the text centered in a 64x64 viewBox
const fontSize = 28;
const fontPath2 = font.getPath(text, 0, 0, fontSize);
const bbox = fontPath2.getBoundingBox();

const textWidth = bbox.x2 - bbox.x1;
const textHeight = bbox.y2 - bbox.y1;

// Center in 64x64
const offsetX = (64 - textWidth) / 2 - bbox.x1;
const offsetY = (64 - textHeight) / 2 - bbox.y1;

const centeredPath = font.getPath(text, offsetX, offsetY, fontSize);
const pathData = centeredPath.toPathData(2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#030303"/>
  <path d="${pathData}" fill="#FAFAFA"/>
</svg>
`;

fs.writeFileSync(outputPath, svg);
console.log('✅ Favicon generated with Arrow font paths');
console.log(`   Path data: ${pathData.substring(0, 80)}...`);
