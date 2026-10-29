import assert from 'node:assert/strict';
import { join } from 'node:path';

// Called by the existing browser suite; uses real touch contexts as well as desktop checks.
export async function checkMobileResponsive(site, out) {
  const errors = [];
  for (const width of [360, 390, 412, 430, 768, 1280]) {
    const context = await site.browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 800, hasTouch: width < 800, reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const inside = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
    const anchored = () => page.locator('#settings-panel').evaluate(el => {
      const r = el.getBoundingClientRect(), anchor = document.querySelector('#settings-toggle').getBoundingClientRect();
      return r.left >= 16 && r.right <= innerWidth - 16 && r.bottom <= innerHeight - 16 && Math.abs(r.top - anchor.bottom - 12) <= 1;
    });
    try {
      for (const prefix of ['', 'ko/']) {
        await page.goto(site.base + '/' + prefix + 'work/zzz/');
        await page.locator('[data-explorer-ready]').waitFor({ state: 'attached' });
        assert.ok(await inside(), `No horizontal overflow at ${prefix}/${width}`);
        await page.locator('#settings-toggle').click();
        await page.waitForFunction(() => document.querySelector('#settings-toggle').getAttribute('aria-expanded') === 'true');
        assert.ok(await anchored(), `Settings anchors to gear at ${prefix}/${width}`);
        await page.setViewportSize({ width, height: 620 });
        await page.waitForFunction(() => document.querySelector('#settings-panel').getBoundingClientRect().bottom < innerHeight);
        assert.ok(await anchored(), 'Changing browser viewport height keeps the popover anchored');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#settings-toggle').evaluate(el => document.activeElement === el), true);
        await page.setViewportSize({ width, height: 844 });
        if (width <= 700) {
          await page.locator('#settings-toggle').click();
          await page.touchscreen.tap(4, 400);
          await page.locator('#settings-panel').waitFor({ state: 'hidden' });
          assert.ok(await page.locator('.detail-toolbar').evaluate(el => el.getBoundingClientRect().height <= 80));
        }
        const embed = page.locator('.demo-youtube iframe');
        assert.equal(await embed.count(), 1);
        assert.ok(await embed.evaluate(el => {
          const r = el.getBoundingClientRect(), parent = el.parentElement.getBoundingClientRect();
          return r.width <= parent.width + 1 && r.left >= 0 && r.right <= innerWidth && Math.abs(r.width / r.height - 16 / 9) < .02;
        }), 'YouTube fills its own container without clipping');
        if (width === 360 && prefix === 'ko/') await page.screenshot({ path: join(out, 'mobile-detail-header-360.png') });
        const expand = page.locator('.detail-prose .diagram-expand').first();
        if (width > 820) { assert.equal(await expand.isVisible(), false); continue; }
        const figure = page.locator('.detail-prose .project-diagram').first();
        const nodes = await figure.locator('svg g.node').count();
        const paths = await figure.locator('svg .edgePaths path').count();
        await expand.click();
        const viewer = page.locator('.diagram-viewer');
        await viewer.waitFor({ state: 'visible' });
        assert.equal(await viewer.locator('svg g.node').count(), nodes);
        assert.equal(await viewer.locator('svg .edgePaths path').count(), paths);
        assert.ok(await viewer.locator('svg').evaluate(el => Math.abs(el.getBoundingClientRect().width - el.viewBox.baseVal.width) <= 1), 'Expanded SVG starts at native text size, not fit-to-screen scale');
        assert.ok(await viewer.locator('svg text').evaluateAll(items => items.every(el => parseFloat(getComputedStyle(el).fontSize) >= 14)), 'Diagram labels stay readable');
        const nativeWidth = await viewer.locator('svg').evaluate(el => el.getBoundingClientRect().width);
        await viewer.locator('[data-diagram-zoom="1"]').click();
        assert.ok(await viewer.locator('svg').evaluate((el, before) => el.getBoundingClientRect().width > before, nativeWidth));
        assert.ok(await inside(), 'Expanded canvas scroll stays inside the viewer');
        if (width === 360 && prefix === 'ko/') await page.screenshot({ path: join(out, 'mobile-diagram-expanded-360.png') });
        await page.keyboard.press('Escape');
        await viewer.waitFor({ state: 'hidden' });
        await figure.locator('svg').waitFor({ state: 'attached' });
        assert.equal(await figure.locator('svg').count(), 1, 'Closing restores the original SVG');
        assert.equal(await expand.evaluate(el => document.activeElement === el), true, 'Focus returns to Expand diagram');
      }
      if (width <= 700) {
        await page.goto(site.base + '/ko/#projects/zzz/details');
        await page.locator('.detail-window-content .detail-page').waitFor();
        await page.locator('.detail-document .diagram-expand').first().click();
        await page.locator('.diagram-viewer[open]').waitFor();
        await page.keyboard.press('Escape');
        await page.locator('.diagram-viewer').waitFor({ state: 'hidden' });
        assert.equal(new URL(page.url()).hash, '#projects/zzz/details', 'ESC closes the expanded diagram before its parent window');
        await page.locator('.window-close').click();
        for (const screen of ['about', 'contact', 'resume']) {
          await page.locator(`[data-menu="${screen}"]`).click();
          await page.locator('.explorer-window[open]').waitFor();
          assert.ok(await inside());
          if (width === 390) await page.screenshot({ path: join(out, `mobile-compact-${screen}-390.png`) });
          if (width === 390 && screen === 'about') {
            await page.locator('.profile-pages').evaluate(el => el.scrollTop = el.scrollHeight);
            await page.screenshot({ path: join(out, 'mobile-compact-skills-390.png') });
          }
          await page.locator('.window-close').click();
        }
        // Other graph shapes and long project names also share the mobile layer.
        for (const slug of ['review-analyzer', 'smart-parking', 'kutodo']) {
          await page.goto(site.base + '/work/' + slug + '/');
          await page.locator('.detail-prose .diagram-expand').first().click();
          await page.locator('.diagram-viewer[open]').waitFor();
          await page.keyboard.press('Escape');
          await page.locator('.diagram-viewer').waitFor({ state: 'hidden' });
          assert.ok(await inside(), `${slug} stays inside ${width}px`);
        }
      }
    } finally { await context.close(); }
  }
  assert.deepEqual(errors, []);
}
