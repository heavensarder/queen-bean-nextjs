const fs = require('fs');
const path = require('path');
const https = require('https');

const publicImagesDir = path.join(__dirname, '..', '..', 'public', 'images');
const srcDir = path.join(__dirname, '..', '..', 'src');
const dataDir = path.join(__dirname, '..', '..', 'data');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Function to download an image
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      resolve(); // already exists
      return;
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
        if (response.statusCode === 301 || response.statusCode === 302) {
          return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => reject(new Error(`Failed to download ${url}: ${response.statusCode}`)));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Regex to find postimg.cc URLs
const postImgRegex = /https:\/\/i\.postimg\.cc\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)/g;

async function processDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.json'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let matches = content.match(postImgRegex);
      
      if (matches) {
        for (const url of matches) {
          const filename = path.basename(url);
          const localPath = `/images/${filename}`;
          const absoluteDest = path.join(publicImagesDir, filename);
          
          console.log(`Downloading ${url} -> ${absoluteDest}`);
          try {
            await downloadImage(url, absoluteDest);
            // Replace globally in content
            content = content.split(url).join(localPath);
          } catch (e) {
            console.error(`Error downloading ${url}`, e);
          }
        }
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

async function main() {
  console.log('Processing src directory...');
  await processDirectory(srcDir);
  console.log('Processing data directory...');
  if (fs.existsSync(dataDir)) {
    await processDirectory(dataDir);
  }
  console.log('Done!');
}

main();
