const fs = require('fs');

const content = fs.readFileSync('./src/lib/menuData.ts', 'utf8');
const urls = [...content.matchAll(/img\('([^']+)'\)/g)].map(m => m[1]);
console.log('Total URLs to check:', urls.length);

async function checkUrls() {
  let broken = [];
  for (const id of urls) {
    const url = `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) {
        console.log('Broken:', id, res.status);
        broken.push(id);
      }
    } catch (e) {
      console.log('Error:', id, e.message);
    }
  }
  console.log('Done checking. Broken count:', broken.length);
  fs.writeFileSync('./broken_images.json', JSON.stringify(broken, null, 2));
}
checkUrls();
