import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root = path.resolve(import.meta.dirname, 'dist');
const catalog = JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8').replace(/^\uFEFF/,''));
const ids = new Set();
for (const g of catalog) {
  if (!g.id || !g.title || !g.category || !g.embed || ids.has(g.id)) throw new Error(`Invalid or duplicate game: ${g.id}`);
  ids.add(g.id);
  if (g.local) {
    if (!fs.existsSync(path.join(root,g.embed))) throw new Error(`Missing game: ${g.embed}`);
    if (!fs.existsSync(path.join(root,'games',g.id,'attribution.json'))) throw new Error(`Missing attribution: ${g.id}`);
  } else if (!g.embed.startsWith('https://')) throw new Error(`Insecure game URL: ${g.id}`);
  if (g.thumbnail && !g.thumbnail.startsWith('https://') && !fs.existsSync(path.join(root,g.thumbnail))) throw new Error(`Missing thumbnail: ${g.id}`);
}
for (const file of ['index.html','credits.html','styles.css','app.js']) if (!fs.existsSync(path.join(root,file))) throw new Error(`Missing ${file}`);
new vm.Script(fs.readFileSync(path.join(root,'app.js'),'utf8'));
console.log(`Verified ${catalog.length} unique games, ${catalog.filter(g => g.local).length} local games, required files, thumbnails and arcade JavaScript.`);
