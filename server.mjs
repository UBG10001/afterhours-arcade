import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, 'dist');
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.wasm':'application/wasm'};
http.createServer((req,res) => { let file; try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch { res.writeHead(400).end(); return; } if (file !== root && !file.startsWith(root + path.sep)) return res.writeHead(403).end(); if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html'); fs.readFile(file,(err,data) => { if(err) return res.writeHead(404).end('Not found'); res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'}).end(data); }); }).listen(4173,'127.0.0.1',() => console.log('Arcade preview: http://127.0.0.1:4173'));
