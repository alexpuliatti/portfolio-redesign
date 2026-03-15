import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '../public/scraped');

async function downloadFile(url, dest) {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const filePath = path.join(dest, filename);

  try {
    await fs.access(filePath);
    console.log(`⏭️  Skipping (already exists): ${filename}`);
    return filePath;
  } catch (e) {
    // does not exist, proceed
  }

  console.log(`⬇️  Downloading: ${filename}...`);
  try {
    await execAsync(`curl -sL "${url}" -o "${filePath}"`);
    return filePath;
  } catch (error) {
    console.error(`❌ Error downloading ${filename}:`, error);
    return null;
  }
}

async function scrape() {
  await fs.mkdir(outputDir, { recursive: true });
  
  console.log('Reading local JSON file...');
  const text = await fs.readFile(path.join(__dirname, 'alexpuliatti_tumblr.json'), 'utf8');
  
  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');
  const jsonText = text.substring(startIndex, endIndex + 1);
  const data = JSON.parse(jsonText);
  
  console.log(`Found ${data.posts.length} posts. Processing photos...`);
  
  let count = 0;
  for (const post of data.posts) {
    if (post.type === 'photo') {
      if (post.photos && post.photos.length > 0) {
        for (const p of post.photos) {
          const url = p['photo-url-1280'];
          if (url) {
            await downloadFile(url, outputDir);
            count++;
          }
        }
      } else {
        const url = post['photo-url-1280'];
        if (url) {
          await downloadFile(url, outputDir);
          count++;
        }
      }
    } else if (post['regular-body']) {
      const urlRegex = /https:\/\/\d+\.media\.tumblr\.com\/[a-zA-Z0-9\/-]+\.(jpg|png|webp)/g;
      const urls = post['regular-body'].match(urlRegex) || [];
      const bestUrls = new Set();
      
      for (const u of urls) {
        if (u.includes('s1280x1920') || u.includes('s2048x3072')) {
          bestUrls.add(u);
        }
      }
      
      for (const u of bestUrls) {
        await downloadFile(u, outputDir);
        count++;
      }
    }
  }
  
  console.log(`\n✅ Finished downloading ${count} images to public/scraped!`);
}

scrape().catch(console.error);
