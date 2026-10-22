import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

const root = process.cwd();
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  if (pathname === '/vendor/three/three.module.js') pathname = '/node_modules/three/build/three.module.js';
  if (pathname === '/vendor/three/three.core.js') pathname = '/node_modules/three/build/three.core.js';
  if (pathname === '/') pathname = '/index.html';
  const file = resolve(root, `.${pathname}`);
  if (!(file === root || file.startsWith(root + sep)) || !existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'Access-Control-Allow-Origin':'*' });
  createReadStream(file).pipe(res);
});
const port = Number(process.env.PORT || 8080);
server.listen(port, '0.0.0.0', () => console.log(`Chemistry studio at http://0.0.0.0:${port}`));
