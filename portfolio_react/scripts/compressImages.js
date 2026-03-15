import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputBaseDir = path.join(__dirname, '../public');
const directories = ['scraped'];

async function compressImage(inputPath, outputPath) {
  try {
    const info = await sharp(inputPath)
      .webp({ quality: 80, effort: 6 }) // Convert to webp, 80% quality, max effort for best compression
      .toFile(outputPath);
    
    // Log savings
    const inputStats = await fs.stat(inputPath);
    const savings = ((inputStats.size - info.size) / inputStats.size * 100).toFixed(2);
    const inputMB = (inputStats.size / (1024 * 1024)).toFixed(2);
    const outputMB = (info.size / (1024 * 1024)).toFixed(2);
    
    console.log(`✅ Compressed ${path.basename(inputPath)}: ${inputMB}MB -> ${outputMB}MB (${savings}% smaller)`);
    return true;
  } catch (error) {
    console.error(`❌ Error compressing ${inputPath}:`, error.message);
    return false;
  }
}

async function processDirectory(dirName) {
  const dirPath = path.join(inputBaseDir, dirName);
  console.log(`\nScanning directory: ${dirPath}...`);
  
  try {
    const files = await fs.readdir(dirPath);
    let successCount = 0;
    
    for (const file of files) {
      if (!file.toLowerCase().endsWith('.png') && !file.toLowerCase().endsWith('.jpg')) {
        continue;
      }
      
      const inputPath = path.join(dirPath, file);
      const parsed = path.parse(file);
      const outputFilename = `${parsed.name}.webp`;
      const outputPath = path.join(dirPath, outputFilename);
      
      // Skip if webp already exists
      try {
        await fs.access(outputPath);
        console.log(`⏭️  Skipping ${file} - ${outputFilename} already exists`);
        continue;
      } catch (e) {
        // File doesn't exist, proceed with compression
      }
      
      const success = await compressImage(inputPath, outputPath);
      if (success) successCount++;
    }
    
    console.log(`\n🎉 Finished ${dirName}: Compressed ${successCount} images.`);
    
  } catch (error) {
    console.error(`Error processing directory ${dirName}:`, error);
  }
}

async function main() {
  console.log('Starting image compression... (This may take a minute for large files)');
  for (const dir of directories) {
    await processDirectory(dir);
  }
  console.log('\nAll compression tasks complete!');
}

main();
