import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { openSite } from './browser-harness.mjs';

const out = resolve('.verification'); mkdirSync(out, { recursive: true });
const manifest = JSON.parse(readFileSync('public/fonts/portfolio/manifest.json', 'utf8'));
const sizes = new Map(manifest.files.map(font => [font.file, font.bytes]));
const site = await openSite(), results = [], errors = [];
try {
  for (const width of [360, 1280]) for (const locale of ['en', 'ko']) {
    const prefix = locale === 'ko' ? '/ko' : '';
    const context = await site.browser.newContext({ locale: 'en-US', viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await context.addInitScript(() => {
      if (window !== window.top) return;
      window.__renderToken = Math.random().toString(36);
      window.__pageLoads = 0;
      document.addEventListener('astro:page-load', () => window.__pageLoads++);
      document.addEventListener('DOMContentLoaded', () => {
        window.__firstProjectRows = [...document.querySelectorAll('#project-list article')].filter(row => getComputedStyle(row).display !== 'none').length;
      }, { once: true });
    });
    const page = await context.newPage(), requests = [];
    const move = async (link, path) => {
      const before = await page.evaluate(() => window.__pageLoads);
      await link.click(); await page.waitForURL('**' + path);
      await page.waitForFunction(({ before, path }) => window.__pageLoads > before && new URL(document.querySelector('link[rel="canonical"]').href).pathname === path, { before, path });
    };
    let documents = 0;
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      requests.push(request.url());
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++;
    });
    await page.goto(site.base + prefix + '/'); await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.evaluate(text => document.fonts.check('500 16px "Portfolio Sans"', text), locale === 'ko' ? '최정길' : 'Choi'), 'Subset fonts must decode and render instead of falling back');
    const token = await page.evaluate(() => window.__renderToken);
    const fontFiles = [...new Set(requests.filter(url => url.endsWith('.woff2')).map(url => new URL(url).pathname.split('/').pop()))];
    const fontBytes = fontFiles.reduce((sum, file) => sum + (sizes.get(file) || 0), 0);
    assert.ok(fontFiles.length > 0 && fontFiles.every(file => sizes.has(file)));
    assert.ok(fontBytes < (locale === 'ko' ? 200_000 : 100_000), 'Cold home font budget');
    if (width === 360 && locale === 'ko') {
      const extra = manifest.files.find(font => font.file.startsWith('extra-'));
      const character = String.fromCodePoint(parseInt(extra.unicodeRange.split(',')[0].slice(2).split('-')[0], 16));
      assert.ok(await page.evaluate(async text => {
        await document.fonts.load('500 16px "Portfolio Sans"', text);
        return document.fonts.check('500 16px "Portfolio Sans"', text);
      }, character), 'Characters outside current copy have a lazy font fallback subset');
    }

    await page.locator('.archive-link').click(); await page.locator('[data-filters-ready]').waitFor();
    const target = prefix + '/projects/zzz/';
    const prefetch = page.waitForRequest(request => new URL(request.url()).pathname === target && !request.isNavigationRequest());
    await page.locator('.project-heading a').first().hover(); await prefetch;
    assert.equal(page.frames().length, 1, 'Prefetch must not instantiate demo iframes');
    await page.getByRole('button', { name: 'Featured', exact: true }).click();
    const row = page.locator('#project-list article:visible').first(), bounds = await row.boundingBox();
    await row.click({ position: { x: bounds.width - 12, y: bounds.height - 12 } }); await page.waitForURL('**' + target);
    if (width === 360) {
      await page.locator('.diagram-expand').first().click(); await page.locator('.diagram-viewer[open]').waitFor();
    }
    await page.goBack(); await page.locator('[data-filters-ready]').waitFor();
    assert.equal(await page.locator('#project-list article:visible').count(), 3);
    assert.equal(await page.locator('html').evaluate(el => el.classList.contains('diagram-open')), false);
    await page.goForward(); await page.waitForURL('**' + target);
    await move(page.locator('.primary-nav a[href="' + prefix + '/about/"]'), prefix + '/about/');
    await page.locator('#language-toggle').click(); await page.locator('#language-panel').waitFor({ state: 'visible' });
    const other = locale === 'ko' ? 'en' : 'ko', nextPrefix = other === 'ko' ? '/ko' : '';
    await move(page.locator('#language-panel a[lang="' + other + '"]'), nextPrefix + '/about/');
    assert.equal(await page.locator('html').getAttribute('lang'), other);
    for (let index = 0; index < 3; index++) for (const path of ['/', '/projects/', '/about/']) {
      await move(page.locator('.primary-nav a[href="' + nextPrefix + path + '"]'), nextPrefix + path);
    }
    assert.equal(await page.evaluate(() => window.__renderToken), token, 'Repeated navigation preserves the document');
    assert.equal(documents, 1, 'Only initial entry creates a main document');
    const cdp = await context.newCDPSession(page);
    const listeners = await cdp.send('Runtime.evaluate', { expression: '(getEventListeners(window).scroll || []).length', includeCommandLineAPI: true, returnByValue: true });
    assert.equal(listeners.result.value, 1, 'Repeated navigation must not accumulate header scroll listeners');
    const softNavigations = await page.evaluate(() => window.__pageLoads - 1);
    assert.ok(softNavigations >= 14);
    await page.goto(site.base + prefix + '/projects/?filter=featured'); await page.locator('[data-filters-ready]').waitFor();
    assert.equal(await page.evaluate(() => window.__firstProjectRows), 3, 'Filtered direct entry has no all-project flash');
    assert.ok(!requests.some(url => /\/(?:client|react)\.[\w-]+\.js|PretendardVariable\.woff2|\.mp4(?:$|\?)/.test(url)));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    results.push({ width, locale, coldFontBytes: fontBytes, fontFiles, repeatedSoftNavigations: softNavigations, mainDocumentsBeforeDirectReload: 1 });
    await context.close();
    console.log('PASS rendering ' + locale + ' ' + width + 'px; cold fonts ' + fontBytes + ' bytes');
  }
  assert.deepEqual(errors, []);
  writeFileSync(join(out, 'rendering-results.json'), JSON.stringify({ results, errors }, null, 2));
} finally { await site.close(); }
