// Run after build: cold folder, delayed media/document, cached Details and intent navigation.
import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { openSite } from './browser-harness.mjs';

const local = await openSite();
// Optional URL exercises Astro dev too, where public PNGs bypass runtime image transforms.
const dev = Boolean(process.env.PROJECT_LOADING_URL);
const site = { ...local, base: process.env.PROJECT_LOADING_URL || local.base };
const hostname = new URL(site.base).hostname;
const errors = [];
try {
  const context = await site.browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('**/*', route => new URL(route.request().url()).hostname === hostname
    ? route.continue() : route.fulfill({ contentType: 'text/html', body: '<title>YouTube fixture</title>' }));
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const requests = [];
  page.on('request', request => requests.push(new URL(request.url()).pathname));
  let releaseVideo, releaseDetail;
  const videoGate = new Promise(resolve => releaseVideo = resolve);
  const detailGate = new Promise(resolve => releaseDetail = resolve);
  await page.route('**/videos/projects/zzz/demo.mp4', async route => { await videoGate; await route.continue().catch(() => {}); });
  await page.route(site.base + '/work/zzz/', async route => { await detailGate; await route.continue().catch(() => {}); });
  try {
    await page.goto(site.base + '/');
    await page.waitForSelector('[data-explorer-ready]');
    await page.locator('[data-menu="projects"]').click();
    await page.waitForFunction(width => {
      const images = [...document.querySelectorAll('.collection-entry img')];
      return images.length === 8 && images.every(image => image.complete && image.naturalWidth === width);
    }, dev ? 1280 : 800);
    assert.equal(await page.locator('.collection-entry video,.collection-entry .media-empty').count(), 0, 'Folder shows photos, with no video elements or fallback text');
    assert.equal(requests.filter(path => path.endsWith('.mp4')).length, 0, 'Folder never fetches local videos');
    assert.equal(requests.filter(path => path.startsWith('/work/')).length, 0, 'Folder never prefetches every detail');
    const covers = await page.locator('.collection-entry img').evaluateAll(images => images.map(image => image.getAttribute('src')));
    assert.equal(covers.length, 8);
    assert.ok(covers.every(path => dev ? /^\/images\/projects\/.+\/thumbnail\.png$/.test(path) : /^\/_astro\/.+\.webp$/.test(path)));
    const bytes = covers.reduce((sum, path) => sum + statSync(resolve('dist', '.' + path)).size, 0);
    if (!dev) assert.ok(bytes < 200_000, 'Eight menu thumbnails stay under 200KB');
    console.log('PASS cold folder: eight ' + (dev ? 'original dev PNG' : 'WebP') + ' covers, ' + bytes + ' bytes, no MP4/detail requests');

    await page.locator('[data-collection-project="zzz"]').click();
    await page.waitForFunction(() => document.querySelector('.explorer-left video')?.getAttribute('src'));
    assert.equal(await page.locator('.project-description').isVisible(), true, 'Selecting a project opens the summary');
    assert.equal(await page.locator('.explorer-left img').isVisible(), true, 'Poster remains during delayed video');
    await page.waitForRequest(site.base + '/work/zzz/');
    assert.equal(requests.filter(path => path.startsWith('/embed/')).length, 0, 'Summary prefetch does not load the YouTube player');
    await page.locator('[data-project-action="details"]').click();
    assert.equal(requests.filter(path => path === '/work/zzz/').length, 1, 'Details joins its pending prefetch');
    assert.equal(await page.locator('.collection-panel video[src]').count(), 0, 'Hidden preview releases the video source');
    releaseVideo(); releaseDetail();
    await page.locator('.detail-window-content .detail-page').waitFor();
    assert.equal(await page.locator('.detail-window-content iframe').count(), 1, 'Details shows the YouTube player immediately');
    assert.equal(await page.locator('.detail-window-content .youtube-load,.detail-window-content youtube-player').count(), 0);
    assert.match(await page.locator('.detail-window-content iframe').getAttribute('src'), /youtube-nocookie\.com\/embed\/.+\?playsinline=1$/);
    const videoPaths = new Set(requests.filter(path => path.endsWith('.mp4')));
    assert.deepEqual([...videoPaths], ['/videos/projects/zzz/demo.mp4']);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => {
      const video = document.querySelector('.explorer-left video');
      return video && !video.paused && video.currentTime > 0 && video.closest('.explorer-media').dataset.playing;
    });
    await page.locator('[data-project-action="details"]').click();
    await page.locator('.detail-window-content .detail-page').waitFor();
    assert.equal(requests.filter(path => path === '/work/zzz/').length, 1, 'Repeated Details reuses parsed content');
    console.log('PASS selected preview only, delayed-video poster, shared in-flight request and cached Details');

    const standalone = page.locator('[data-project-action="standalone"]');
    await standalone.focus();
    assert.equal(await page.locator('link[rel="prefetch"][href="/work/zzz/"]').count(), 1);
    await standalone.click();
    await page.waitForURL(site.base + '/work/zzz/');
    assert.equal(await page.locator('.detail-page youtube-player,.detail-page .youtube-load').count(), 0);
    assert.equal(await page.locator('.detail-page iframe').count(), 1);
    assert.match(await page.locator('.detail-page iframe').getAttribute('src'), /youtube-nocookie\.com\/embed\/.+\?playsinline=1$/);
    console.log('PASS visible YouTube players without overlays, standalone intent prefetch and no forced autoplay');
  } finally { releaseVideo(); releaseDetail(); await context.close(); }

  for (const saveData of [false, true]) {
    const context = await site.browser.newContext({ viewport: { width: 360, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).hostname === hostname ? route.continue() : route.abort());
    if (saveData) await context.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, effectiveType: '4g' } }));
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    const requests = []; page.on('request', request => requests.push(new URL(request.url()).pathname));
    await page.goto(site.base + '/ko/#projects/zzz');
    await page.locator('.project-description').waitFor();
    await page.waitForTimeout(1000);
    assert.equal(requests.filter(path => path.endsWith('.mp4')).length, 0, 'Touch/reduced motion keeps the static cover');
    assert.equal(requests.filter(path => path === '/ko/work/zzz/').length, saveData ? 0 : 1);
    await page.locator('[data-project-action="details"]').tap();
    await page.locator('.detail-window-content .detail-page').waitFor();
    assert.equal(requests.filter(path => path === '/ko/work/zzz/').length, 1);
    assert.equal(await page.locator('.detail-window-content iframe').count(), 1);
    assert.equal(await page.locator('.window-body').evaluate(el => el.scrollWidth > el.clientWidth), false);
    console.log('PASS mobile/KO/reduced-motion: no video, saveData=' + saveData + ', manual Details still works');
    await context.close();
  }
  assert.deepEqual(errors, []);
} finally { await site.close(); }
