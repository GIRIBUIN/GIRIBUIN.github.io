import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = join(root, '.verification');
mkdirSync(out, { recursive: true });
const fixtureDist = JSON.parse(readFileSync(join(out, 'content-results.json'))).fixtureDist;
const staticServer = createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let path = resolve(fixtureDist, '.' + pathname);
  if (!path.startsWith(fixtureDist + sep) && path !== fixtureDist) { res.writeHead(403).end(); return; }
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) { res.writeHead(404).end('Not found'); return; }
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
  res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }); res.end(readFileSync(path));
});
await new Promise(done => staticServer.listen(0, '127.0.0.1', done));
const fixtureUrl = 'http://127.0.0.1:' + staticServer.address().port;
const dev = spawn(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'dev', '--host', '127.0.0.1', '--port', '4322'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let output = ''; dev.stdout.on('data', data => output += data); dev.stderr.on('data', data => output += data);
let base;
let browser;
const passed = [];
const pass = name => { passed.push(name); console.log('PASS ' + name); };
try {
  for (let i = 0; i < 100; i++) {
    const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    try { if (address && (await fetch(address)).ok) { base = address; break; } } catch {}
    if (dev.exitCode !== null) throw new Error(output);
    if (i === 99) throw new Error('Dev server timeout: ' + output);
    await new Promise(done => setTimeout(done, 200));
  }
  for (const options of [{ channel: 'msedge' }, { channel: 'chrome' }, {}]) {
    try { browser = await chromium.launch({ headless: true, ...options }); break; } catch {}
  }
  if (!browser) throw new Error('No local browser found. Install Playwright Chromium with npx playwright install chromium.');
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  // 검증 페이지에서 외부 API·서비스 요청이 발생하면 차단합니다.
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  for (const [name, width, height] of [['desktop', 1440, 1000], ['tablet', 820, 1100], ['mobile', 390, 844], ['small-mobile', 360, 780]]) {
    await page.setViewportSize({ width, height });
    assert.equal((await page.goto(base)).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow: ' + name);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('#work > article').count(), 3);
    assert.equal(await page.locator('a[href=""], a[href="null"]').count(), 0);
    await page.screenshot({ path: join(out, name + '.png'), fullPage: false });
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(out, name + '-work.png'), fullPage: false });
    if (name === 'desktop') {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: join(out, 'desktop-full.png'), fullPage: true });
    }
    pass(name + ' layout / no overflow / content');
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  for (const id of ['work', 'tools', 'about', 'contact']) {
    await page.locator('nav a[href="#' + id + '"]').click();
    // Smooth scrolling must settle before the next anchor click.
    await page.waitForTimeout(1200);
    await page.waitForFunction(id => {
      const top = document.getElementById(id).getBoundingClientRect().top;
      const headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
      const target = Math.min(Math.max(0, top + scrollY - 100), document.documentElement.scrollHeight - innerHeight);
      return Math.abs(scrollY - target) < 3 && top >= headerBottom - 1 && top < innerHeight;
    }, id);
    assert.equal(new URL(page.url()).hash, '#' + id);
  }
  pass('anchor navigation scrolls below sticky header');
  await page.goto(base);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').textContent(), '본문으로 건너뛰기');
  assert.equal(await page.locator(':focus').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
  await page.keyboard.press('Enter'); assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
  const summary = page.locator('.project-expand summary').first();
  await summary.focus(); await page.keyboard.press('Enter');
  assert.ok(await page.locator('.project-expand').first().getAttribute('open') !== null);
  pass('keyboard skip link, visible focus and native expand');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  pass('prefers-reduced-motion respected');
  await page.goto(base + '/work/kuroom/');
  assert.equal(await page.locator('h1').textContent(), 'KUROOM');
  await page.locator('nav a[href="/#tools"]').click();
  await page.waitForURL(base + '/#tools');
  pass('static deep dive and return navigation');
  for (const type of ['iframe', 'video', 'terminal', 'apk', 'image', 'none']) {
    await page.goto(fixtureUrl + '/work/null-' + type + '/');
    assert.equal(await page.locator('[data-demo-state="fallback"]').count(), 1);
    assert.equal(await page.locator('.demo-stage iframe,.demo-stage img,.demo-stage video').count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  }
  pass('all six null Demo fallbacks in browser');
  await page.goto(fixtureUrl + '/work/ready-iframe/');
  assert.equal(await page.frameLocator('iframe').locator('h1').textContent(), 'LOCAL_DEMO_FIXTURE');
  const popupPromise = page.waitForEvent('popup');
  await page.getByText('Open Full Demo').click();
  const popup = await popupPromise; await popup.waitForLoadState();
  assert.ok(popup.url().endsWith('/demo-fixture.html')); await popup.close();
  pass('iframe preview and Open Full Demo');
  for (const slug of ['ready-image', 'ready-terminal-image']) {
    await page.goto(fixtureUrl + '/work/' + slug + '/');
    await page.waitForFunction(() => document.querySelector('.demo-stage img')?.naturalWidth > 0);
  }
  for (const slug of ['ready-video', 'ready-terminal']) {
    await page.goto(fixtureUrl + '/work/' + slug + '/');
    assert.equal(await page.locator('video').getAttribute('controls'), '');
    assert.equal(await page.locator('video').getAttribute('preload'), 'none');
  }
  await page.goto(fixtureUrl + '/work/ready-apk/');
  assert.equal(await page.getByText('Download APK').getAttribute('href'), '/fixture.apk');
  pass('image, terminal image/video, video controls, APK actions');
  await page.goto(fixtureUrl + '/work/broken-image/');
  await page.locator('.media-error').waitFor();
  pass('broken media provides readable fallback');
  assert.deepEqual(errors, []); pass('no browser runtime errors');
  writeFileSync(join(out, 'browser-results.json'), JSON.stringify({ passed, viewports: [1440, 820, 390, 360], externalRequests: 'blocked' }, null, 2));
} finally {
  await browser?.close();
  if (process.platform === 'win32') {
    try { execFileSync('taskkill', ['/PID', String(dev.pid), '/T', '/F'], { stdio: 'ignore' }); } catch {}
  } else dev.kill();
  await new Promise(done => staticServer.close(done));
}
