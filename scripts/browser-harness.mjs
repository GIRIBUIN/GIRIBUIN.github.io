import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, extname, sep } from 'node:path';

export async function openSite(dist = resolve('dist'), launchOptions = {}) {
  const server = createServer((req, res) => {
    let path;
    try { path = resolve(dist, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
    catch { res.writeHead(400).end(); return; }
    if (path !== dist && !path.startsWith(dist + sep)) { res.writeHead(403).end(); return; }
    if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
    if (!existsSync(path)) { res.writeHead(404).end(); return; }
    const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.mp4': 'video/mp4' };
    res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }).end(readFileSync(path));
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  let browser;
  try {
    for (const options of process.platform === 'win32' ? [{ channel: 'msedge' }, { channel: 'chrome' }, {}] : [{}]) {
      try { browser = await chromium.launch({ headless: true, ...options, ...launchOptions }); break; } catch {}
    }
    if (!browser) throw new Error('No browser available');
  } catch (error) { server.close(); throw error; }
  return { browser, base: 'http://127.0.0.1:' + server.address().port,
    async close() { await browser.close(); await new Promise(done => server.close(done)); } };
}
