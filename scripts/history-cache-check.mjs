// Playwright disables BFCache by default; explicitly exercise a real persisted document.
import assert from 'node:assert/strict';
import { openSite } from './browser-harness.mjs';

const site = await openSite(undefined, { ignoreDefaultArgs: ['--disable-back-forward-cache'] });
try {
  const context = await site.browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1'
    ? route.continue() : route.fulfill({ contentType: 'text/html', body: '<title>YouTube fixture</title>' }));
  await context.addInitScript(() => addEventListener('pageshow', event => { window.restoredFromCache = event.persisted; }));
  const errors = [];
  for (const [source, prefix, width, embedded] of [
    ['/', '', 1440, false], ['/ko/', '/ko', 360, false],
    ['/work/zzz/', '', 1440, true], ['/ko/work/zzz/', '/ko', 360, true],
  ]) {
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto(site.base + source + '#projects/kuroom/details', { waitUntil: 'domcontentloaded' });
    await page.locator('.detail-window-content .detail-page').waitFor();
    // This test concerns parent-document history, independently of external player frames.
    await page.locator('iframe').evaluateAll(frames => frames.forEach(frame => frame.remove()));
    await page.evaluate(() => addEventListener('pagehide', () => sessionStorage.setItem('history-departure', JSON.stringify({
      hash: location.hash, open: document.querySelector('.explorer-window').open,
      locked: document.documentElement.classList.contains('explorer-open'),
    })), { once: true }));
    await page.locator('.standalone-link').click();
    const destination = prefix + '/work/kuroom/';
    await page.waitForFunction(path => location.pathname === path, destination);
    assert.deepEqual(await page.evaluate(() => JSON.parse(sessionStorage.getItem('history-departure'))), { hash: '', open: false, locked: false });
    // BFCache has no new DOMContentLoaded/load event: wait on the actual restored state.
    await page.evaluate(() => history.back());
    await page.waitForFunction(path => location.pathname === path && document.querySelector('[data-explorer-ready]'), source);
    assert.equal(await page.evaluate(() => window.restoredFromCache), true, 'Must exercise real BFCache, not a document reload');
    assert.equal(await page.evaluate(() => location.hash), '');
    assert.equal(await page.locator('.explorer-window').evaluate(element => element.open), false);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('explorer-open')), false);
    await page.locator(embedded ? '[data-project-explorer-trigger]' : '[data-menu="projects"]').click();
    await page.locator('.explorer-window[open]').waitFor();
    await page.locator('.window-close').click();
    await page.locator('.explorer-window').waitFor({ state: 'hidden' });
    await page.evaluate(() => history.forward());
    await page.waitForFunction(path => location.pathname === path, destination);
    await page.evaluate(() => history.back());
    await page.waitForFunction(path => location.pathname === path, source);
    assert.equal(await page.locator('.explorer-window').evaluate(element => element.open), false);
    console.log('PASS real BFCache Back/Forward, clean source and working X: ' + source + ' (' + width + 'px)');
    await page.close();
  }
  assert.deepEqual(errors, []);
} finally { await site.close(); }
