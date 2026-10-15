import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = join(root, '.verification');
mkdirSync(out, { recursive: true });
const fixtureDist = JSON.parse(readFileSync(join(out, 'content-results.json'))).fixtureDist;
const createStaticServer = dist => createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let path = resolve(dist, '.' + pathname);
  if (!path.startsWith(dist + sep) && path !== dist) { res.writeHead(403).end(); return; }
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) { res.writeHead(404).end('Not found'); return; }
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.mp4': 'video/mp4' };
  res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }); res.end(readFileSync(path));
});
const fixtureServer = createStaticServer(fixtureDist);
const mainServer = createStaticServer(join(root, 'dist'));
await new Promise(done => fixtureServer.listen(0, '127.0.0.1', done));
await new Promise(done => mainServer.listen(0, '127.0.0.1', done));
const fixtureUrl = 'http://127.0.0.1:' + fixtureServer.address().port;
const base = 'http://127.0.0.1:' + mainServer.address().port;
const expected = ['zzz', 'smart-parking', 'review-analyzer', 'ct', 'kuroom', 'kutodo', 'baljucall'];
const passed = [];
const pass = name => { passed.push(name); console.log('PASS ' + name); };
let browser;
try {
  const systemBrowsers = process.platform === 'win32' ? [
    join(process.env['ProgramFiles(x86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe'),
    join(process.env.ProgramFiles || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
  ].filter(existsSync).map(executablePath => ({ executablePath })) : [];
  for (const options of [{ channel: 'msedge' }, { channel: 'chrome' }, ...systemBrowsers, {}]) {
    try { browser = await chromium.launch({ headless: true, ...options }); break; } catch {}
  }
  if (!browser) throw new Error('No local browser found.');
  const context = await browser.newContext();
  const mediaRequests = [], externalRequests = [], errors = [];
  context.on('request', request => {
    const url = new URL(request.url());
    if (url.pathname.endsWith('.mp4')) mediaRequests.push(request.url());
    if (url.hostname !== '127.0.0.1') externalRequests.push(request.url());
  });
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const goto = async url => {
    await page.mouse.move(0, 0);
    const response = await page.goto(url);
    if (response) assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(80);
  };
  const locale = async language => {
    await page.locator('.header [data-locale="' + language + '"]').evaluate(el => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    await page.waitForTimeout(60);
  };
  const visibleCount = () => page.locator('#projects-grid > article:visible').count();
  const thumbnail = slug => page.locator('[data-project="' + slug + '"] .project-thumbnail');
  const video = slug => page.locator('[data-project="' + slug + '"] video');
  const contrastResults = [];
  const checkContrast = async (selector, label, property = 'color', minimum = 4.5) => {
    const samples = await page.locator(selector).evaluateAll((elements, property) => {
      const parse = color => {
        if (color.startsWith('#')) return [...color.slice(1).match(/../g).map(hex => parseInt(hex, 16)), 1];
        const values = color.match(/[0-9.]+/g).map(Number);
        if (color.startsWith('color(srgb')) for (let i = 0; i < 3; i++) values[i] *= 255;
        return [values[0], values[1], values[2], values[3] ?? 1];
      };
      const luminance = color => color.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((total, value, i) => total + value * [.2126, .7152, .0722][i], 0);
      // Use the darkest paper surface as a conservative background for page gradients.
      const paper = parse(getComputedStyle(document.documentElement).getPropertyValue('--surface-strong').trim());
      return elements.filter(el => el.getClientRects().length && el.textContent.trim()).map(el => {
        let background = paper;
        if (property === 'color') {
          const ancestors = [];
          for (let node = el; node && node !== document.body && node !== document.documentElement; node = node.parentElement) ancestors.push(node);
          ancestors.reverse().forEach(node => {
            const color = parse(getComputedStyle(node).backgroundColor);
            background = color.slice(0, 3).map((channel, i) => channel * color[3] + background[i] * (1 - color[3]));
          });
        }
        const color = parse(getComputedStyle(el)[property]);
        const foreground = color.slice(0, 3).map((channel, i) => channel * color[3] + background[i] * (1 - color[3]));
        const a = luminance(foreground), b = luminance(background);
        return { element: el.tagName + '.' + el.className, text: el.textContent.trim().slice(0, 45), ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
      });
    }, property);
    assert.ok(samples.length > 0, label + ' must include rendered content');
    for (const sample of samples) assert.ok(sample.ratio >= minimum, label + ': ' + sample.element + ' "' + sample.text + '" contrast ' + sample.ratio.toFixed(2));
    contrastResults.push({ label, minimum: Math.min(...samples.map(sample => sample.ratio)), samples: samples.length });
  };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const renderedLines = selector => page.locator(selector).evaluate(el => {
    const range = document.createRange(); range.selectNodeContents(el);
    return new Set([...range.getClientRects()].filter(rect => rect.width > 1).map(rect => Math.round(rect.top))).size;
  });
  await page.setViewportSize({ width: 1440, height: 1000 }); await goto(base);
  const navigationIconBackground = await page.locator('[data-projects-more]').evaluate(el => getComputedStyle(el).backgroundColor);
  const secondaryButton = page.locator('[data-action="resume"]');
  assert.equal(navigationIconBackground, await secondaryButton.evaluate(el => getComputedStyle(el).backgroundColor));
  assert.equal(navigationIconBackground, await page.locator('[data-action="portfolio-pdf"]').evaluate(el => getComputedStyle(el).backgroundColor));
  const activeControlBackground = 'rgb(48, 52, 58)';
  await secondaryButton.hover();
  assert.equal(await secondaryButton.evaluate(el => getComputedStyle(el).backgroundColor), activeControlBackground);
  await checkContrast('[data-action="resume"]:hover', 'secondary control hover text');
  await page.locator('[data-projects-more]').hover();
  assert.equal(await page.locator('[data-projects-more]').evaluate(el => getComputedStyle(el).backgroundColor), activeControlBackground);
  await checkContrast('.main-nav a,.header .language-switch button,.hero h1,.hero-positioning,.hero-intro,.hero-trace-copy,.hero-trace-label,.hero .button,.about-bio,.profile-facts dt,.profile-facts dd,.education-status,.education-program,.skill-tags li,.project-card-title,.project-card-summary,[data-projects-more],.principle-title,.principle-hook,.principle-number,.contact h2,.contact-intro,.contact-socials a,.footer,.trace-rail a', 'warm home text');
  await page.locator('.button.primary').hover();
  await checkContrast('.button.primary', 'primary hover text');
  await page.keyboard.press('Tab');
  await page.locator('.button.primary').focus();
  await checkContrast('.hero .button:focus-visible', 'visible keyboard focus', 'outlineColor', 3);
  await page.locator('[data-principle="understand"]').click();
  assert.equal(await page.locator('.dialog-close').evaluate(el => getComputedStyle(el).backgroundColor), navigationIconBackground);
  await page.locator('.dialog-close').hover();
  assert.equal(await page.locator('.dialog-close').evaluate(el => getComputedStyle(el).backgroundColor), activeControlBackground);
  await checkContrast('#build-dialog [data-principle-panel]:not([hidden]) h3,#build-dialog [data-principle-panel]:not([hidden]) dt,#build-dialog [data-principle-panel]:not([hidden]) dd,#build-dialog [data-principle-panel]:not([hidden]) .principle-dialog-intro,#build-dialog .language-switch button', 'warm modal text');
  await page.keyboard.press('Escape');
  await goto(base + '/work/ct/');
  assert.equal(await page.locator('.detail-page .project-nav-icon').evaluate(el => getComputedStyle(el).backgroundColor), navigationIconBackground);
  await page.locator('.detail-page .project-nav-icon').hover();
  assert.equal(await page.locator('.detail-page .project-nav-icon').evaluate(el => getComputedStyle(el).backgroundColor), activeControlBackground);
  await checkContrast('.detail-page h1,.detail-summary,.tech,.prose p,.prose li,.prose pre span', 'warm detail text');
  pass('warm theme text/hover contrast >=4.5:1 and visible focus >=3:1');

  await goto(base);
  await thumbnail('zzz').evaluate(el => {
    const top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top - innerHeight - 320, behavior: 'instant' });
  });
  assert.ok(await thumbnail('zzz').evaluate(el => el.getBoundingClientRect().top > innerHeight), 'Projects media stays below the viewport during preload');
  await page.waitForFunction(() => ['zzz', 'smart-parking'].every(slug => {
    const card = document.querySelector('[data-project="' + slug + '"]');
    return card.querySelector('canvas').width > 0 && card.querySelector('video').paused;
  }));
  pass('home video first frames load before Projects enters the viewport');

  for (const [width, columns] of [[1600, 2], [1440, 2], [1280, 2], [1100, 2], [820, 2], [390, 1], [360, 1]]) {
    await page.setViewportSize({ width, height: width === 1280 ? 720 : 1000 }); await goto(base);
    assert.equal(await page.locator('section#projects').count(), 1);
    const heroBounds = await page.locator('#hero').evaluate(el => {
      const rect = el.getBoundingClientRect();
      return { left: rect.left, width: rect.width, body: document.body.getBoundingClientRect().width };
    });
    assert.ok(Math.abs(heroBounds.left) < 1 && Math.abs(heroBounds.width - heroBounds.body) < 1, 'Hero background spans the page at ' + width + ': ' + JSON.stringify(heroBounds));
    if (width >= 820) assert.ok(await page.locator('#hero .hero-art span').evaluateAll(items => {
      const hero = document.querySelector('#hero').getBoundingClientRect();
      return items.every(item => {
        const rect = item.getBoundingClientRect();
        return rect.left >= hero.left && rect.right <= hero.right && rect.top >= hero.top && rect.bottom <= hero.bottom;
      });
    }), 'Pastel circles are not clipped at ' + width);
    assert.equal(await page.locator('section#work,section#tools,.rail-track').count(), 0);
    assert.deepEqual(await page.locator('#projects-grid>article').evaluateAll(items => items.map(el => el.dataset.project)), expected.slice(0, 4));
    assert.equal(await visibleCount(), 4);
    assert.equal(await page.locator('[data-projects-more]').getAttribute('href'), '/projects/');
    assert.equal((await page.locator('[data-projects-more]').textContent()).trim(), '');
    assert.equal(await page.locator('[data-projects-more]').getAttribute('aria-label'), 'View More Projects');
    const headingBox = await page.locator('#projects-heading').boundingBox();
    const moreBox = await page.locator('[data-projects-more]').boundingBox();
    assert.ok(moreBox.x > headingBox.x + headingBox.width);
    assert.ok(Math.abs(moreBox.y + moreBox.height / 2 - headingBox.y - headingBox.height / 2) < 2, 'More icon aligns with Projects heading');
    assert.ok(await page.locator('.project-card-title').evaluateAll(titles => titles.every(el => {
      const style = getComputedStyle(el);
      return style.backgroundColor === 'rgba(0, 0, 0, 0)' && style.paddingLeft === '0px' && style.paddingRight === '0px';
    })));
    assert.equal(await page.locator('#projects-grid iframe,#projects-grid .project-actions,#projects-grid .project-tech,#projects-grid .project-type,#projects-grid .media-enlarge,#projects .project-trace').count(), 0);
    assert.ok(await page.locator('#projects-grid video').evaluateAll(videos => videos.every(video => video.paused && !video.poster && !video.autoplay)));
    const layout = await page.locator('#projects-grid').evaluate(el => ({
      columns: getComputedStyle(el).gridTemplateColumns.split(' ').length,
      cards: [...el.children].map(child => { const r = child.getBoundingClientRect(); return { x: r.x, y: r.y, height: r.height, border: getComputedStyle(child).borderTopStyle }; }),
      ratios: [...el.querySelectorAll('.project-thumbnail')].map(stage => stage.clientWidth / stage.clientHeight),
    }));
    assert.equal(layout.columns, columns, 'Grid columns at ' + width);
    assert.ok(layout.ratios.every(ratio => Math.abs(ratio - 16 / 9) < .02));
    assert.ok(layout.cards.every(card => card.border === 'none'), 'Cards have no bordered outer panel');
    assert.ok(Math.max(...layout.cards.map(card => card.height)) - Math.min(...layout.cards.map(card => card.height)) <= 1);
    for (let i = 1; i < layout.cards.length; i++) assert.ok(i % columns === 0 ? layout.cards[i].y > layout.cards[i - 1].y : Math.abs(layout.cards[i].y - layout.cards[i - 1].y) < 1 && layout.cards[i].x > layout.cards[i - 1].x);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    if (width === 1440 || width === 390) {
      await page.locator('#projects').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
      await page.waitForFunction(() => {
        const video = document.querySelector('[data-project="zzz"] video');
        return video.readyState >= 2 && video.paused;
      });
      await page.screenshot({ path: join(out, width === 1440 ? 'desktop-projects.png' : 'mobile-projects.png') });
      if (width === 1440) {
        await page.waitForFunction(() => [...document.querySelectorAll('#projects-grid canvas')].every(canvas => canvas.width > 0 && canvas.height > 0));
        await page.locator('#projects').screenshot({ path: join(out, 'desktop-projects-section.png') });
      }
    }
    for (const section of ['about', 'education', 'skills', 'projects', 'process', 'contact']) {
      await page.locator('#' + section).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
      await page.waitForFunction(section => document.querySelector('.trace-rail [aria-current]')?.dataset.traceLayer === section, section);
      assert.ok(await page.locator('#' + section + ' h2').evaluate((el, section) => {
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
        const top = el.getBoundingClientRect().top;
        return section === 'contact' ? top >= offset - 5 && top < innerHeight : Math.abs(top - offset) < 5;
      }, section), section + ' heading clears the header at ' + width);
      if (section === 'contact') assert.ok(await page.locator('#contact').evaluate(el => {
        const last = el.querySelector('.contact-socials').getBoundingClientRect();
        return el.getBoundingClientRect().bottom - last.bottom <= 33;
      }), 'Contact has no extra space below the links at ' + width);
      for (const language of ['ko', 'en']) {
        const before = await page.evaluate(() => ({ y: scrollY, count: document.querySelectorAll('#projects-grid > article').length, url: location.href }));
        await locale(language);
        assert.deepEqual(await page.evaluate(() => ({ y: scrollY, count: document.querySelectorAll('#projects-grid > article').length, url: location.href })), before);
        assert.equal(await page.locator('.trace-rail [aria-current]').getAttribute('data-trace-layer'), section);
        if (width === 1440 && section === 'process') assert.equal(await renderedLines('#process > .section-intro'), 1, 'How I Build introduction is one desktop line');
        if (width === 1440 && section === 'contact') assert.equal(await renderedLines('.contact-intro'), 2, 'Contact introduction is two desktop lines in ' + language);
      }
    }
    for (const section of ['about', 'projects', 'contact']) {
      const link = page.locator('.main-nav a[href="#' + section + '"]');
      await link.focus(); await page.keyboard.press('Enter');
      await page.waitForFunction(section => {
        const top = document.getElementById(section).getBoundingClientRect().top;
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
        return section === 'contact' ? top >= offset - 2 && top < innerHeight : Math.abs(top - offset) < 2;
      }, section);
      await page.waitForFunction(section => document.querySelector('.trace-rail [aria-current]')?.dataset.traceLayer === section, section);
    }
    if (width >= 1100) {
      for (const section of ['process', 'projects', 'skills', 'education', 'about', 'contact']) {
        await page.locator('[data-trace-layer="' + section + '"]').click();
        await page.waitForFunction(section => {
          const top = document.getElementById(section).getBoundingClientRect().top;
          const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
          return section === 'contact' ? top >= offset - 2 && top < innerHeight : Math.abs(top - offset) < 2;
        }, section);
        await page.waitForFunction(section => document.querySelector('.trace-rail [aria-current]')?.dataset.traceLayer === section, section);
      }
    }
    pass('2/1 grid, simple cards, row order and EN/KO position: ' + width);
  }

  await page.setViewportSize({ width: 1440, height: 1000 }); await goto(base);
  await locale('ko');
  assert.equal(await page.locator('.trace-rail p').count(), 0);
  assert.equal(await page.locator('.trace-rail').getAttribute('aria-label'), 'Reading context');
  assert.deepEqual(await page.locator('.trace-label').allTextContents(), ['About Me', 'Education', 'Skills', 'Projects', 'How I Build', 'Contact']);
  assert.deepEqual(await page.locator('main > section:not(#hero) h2[id$="heading"]').allTextContents(), ['About Me', 'Education', 'Skills', 'Projects', 'How I Build', 'Contact']);
  assert.deepEqual(await page.locator('.main-nav a').allTextContents(), ['About', 'Projects', 'Contact']);
  assert.match(await page.locator('#skills .section-intro').textContent(), /프로젝트/);
  await locale('en');
  assert.deepEqual(await page.locator('main>section').evaluateAll(items => items.map(el => el.id)), ['hero', 'about', 'education', 'skills', 'projects', 'process', 'contact']);
  assert.equal(await page.locator('.hero h1').textContent(), 'GIRIBUIN');
  assert.equal(await page.locator('.hero-role').count(), 0);
  assert.equal(await page.locator('.skill-tags img').count(), 22);
  assert.equal(await page.locator('.skill-mark').count(), 0);
  assert.ok(await page.locator('.skill-tags li').evaluateAll(items => items.every(item => {
    const image = item.querySelector('img')?.getBoundingClientRect();
    const name = item.querySelector('span')?.getBoundingClientRect();
    return image && name && image.bottom < name.top && Math.abs((image.left + image.right) / 2 - (name.left + name.right) / 2) < 2;
  })));
  assert.ok(await page.locator('.skill-tags li').evaluateAll(items => items.every(item => item.getBoundingClientRect().width === 88 && item.getBoundingClientRect().height === 96)));
  assert.ok(await page.locator('.skill-tags').first().evaluate(el => {
    const overflow = el.scrollWidth > el.clientWidth;
    el.scrollLeft = el.scrollWidth;
    return overflow && el.scrollLeft > 0 && document.documentElement.scrollWidth <= innerWidth + 1;
  }));
  assert.equal(await page.locator('#contact a svg').count(), 4);
  assert.equal((await page.locator('footer').textContent()).trim(), '@giribuin');
  for (const path of ['/files/resume-public.pdf', '/files/portfolio.pdf']) {
    const response = await page.request.get(base + path);
    assert.equal((await response.body()).subarray(0, 4).toString(), '%PDF');
  }
  for (const [section, layer] of [['hero', 'about'], ['about', 'about'], ['education', 'education'], ['skills', 'skills'], ['projects', 'projects'], ['process', 'process'], ['contact', 'contact']]) {
    await page.locator('#' + section).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(layer => document.querySelector('.trace-rail [aria-current]')?.dataset.traceLayer === layer, layer);
  }
  for (const target of ['projects', 'about', 'contact']) {
    await page.locator('.main-nav a[href="#' + target + '"]').focus(); await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#' + target);
  }
  for (const hash of ['work', 'tools']) {
    await goto(base + '/#' + hash);
    await page.waitForFunction(() => document.querySelector('.trace-rail [aria-current]')?.dataset.traceLayer === 'projects');
    assert.ok(await page.evaluate(() => Math.abs(document.querySelector('#projects').getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)) < 3));
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const section of ['about', 'contact', 'education']) {
    const link = section === 'education' ? page.locator('[data-trace-layer="education"]') : page.locator('.main-nav a[href="#' + section + '"]');
    await link.click();
    await page.waitForFunction(section => {
      const top = document.getElementById(section).getBoundingClientRect().top;
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
      return section === 'contact' ? top >= offset - 2 && top < innerHeight : Math.abs(top - offset) < 2;
    }, section);
    await page.waitForFunction(section => document.querySelector('.trace-rail [aria-current]')?.dataset.traceLayer === section, section);
  }
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('.trace-rail [aria-current]')?.dataset.traceLayer === 'contact');
  pass('unchanged sections, Header/Trace Rail Projects navigation and legacy hashes');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await goto(base + '/projects/');
  await page.locator('#projects').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await page.waitForFunction(() => ['zzz', 'smart-parking'].every(slug => {
    const video = document.querySelector('[data-project="' + slug + '"] video');
    return video.readyState >= 2 && video.paused && video.currentTime < .01;
  }));
  assert.equal(await page.locator('#project-inspector,[data-inspector-project],.media-lightbox').count(), 0);
  assert.equal(await page.locator('#projects-grid video[poster],#projects-grid video + img').count(), 0);
  await page.locator('[data-project="smart-parking"] .project-card-title').hover();
  await page.waitForTimeout(250);
  assert.equal(await video('smart-parking').evaluate(el => el.paused), true, 'Title hover does not start video');
  await thumbnail('smart-parking').hover({ position: { x: 30, y: 30 } });
  await page.waitForTimeout(70);
  assert.equal(await video('smart-parking').evaluate(el => el.paused), true, 'Brief hover does not start video');
  await page.mouse.move(0, 0); await page.waitForTimeout(230);
  await thumbnail('smart-parking').hover({ position: { x: 30, y: 30 } });
  await page.waitForFunction(() => {
    const video = document.querySelector('[data-project="smart-parking"] video');
    return !video.paused && video.currentTime > .01;
  });
  await thumbnail('zzz').hover({ position: { x: 30, y: 30 } });
  await page.waitForFunction(() => {
    const video = document.querySelector('[data-project="zzz"] video');
    return !video.paused && video.currentTime > .01;
  });
  assert.ok(await video('smart-parking').evaluate(el => el.paused && el.currentTime < .01));
  assert.equal(await page.locator('#projects-grid video').evaluateAll(videos => videos.filter(el => !el.paused).length), 1);
  await page.screenshot({ path: join(out, 'desktop-project-hover.png') });
  await page.mouse.move(0, 0);
  await page.waitForFunction(() => [...document.querySelectorAll('#projects-grid video')].every(video => video.paused && video.currentTime < .01));
  pass('no Inspector; first-frame thumbnails, media-only intent autoplay, single playback and leave reset');

  // Regression for a playing video obscuring a different, paused video thumbnail.
  for (const [hovered, neighbor] of [['zzz', 'smart-parking'], ['smart-parking', 'zzz'], ['ct', 'review-analyzer'], ['review-analyzer', 'ct']]) {
    await page.mouse.move(0, 0);
    await thumbnail(hovered).evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.waitForFunction(slugs => slugs.every(slug => {
      const card = document.querySelector('[data-project="' + slug + '"]');
      const video = card.querySelector('video'), canvas = card.querySelector('canvas');
      return video.paused && !video.seeking && canvas?.width > 0 && canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3] > 0;
    }), [hovered, neighbor]);
    const still = await thumbnail(neighbor).screenshot();
    await thumbnail(hovered).hover();
    await page.waitForFunction(slug => !document.querySelector('[data-project="' + slug + '"] video').paused, hovered);
    await page.waitForTimeout(350);
    assert.ok(still.equals(await thumbnail(neighbor).screenshot()), hovered + ' must not obscure ' + neighbor);
    await page.screenshot({ path: join(out, 'overlap-' + hovered + '-page.png') });
  }
  await page.mouse.move(0, 0);
  pass('hovering either video leaves the neighboring thumbnail pixels unchanged in both rows');

  await thumbnail('zzz').hover({ position: { x: 30, y: 30 } });
  await page.waitForFunction(() => !document.querySelector('[data-project="zzz"] video').paused);
  const beforeLocale = await page.evaluate(() => ({ y: scrollY, count: document.querySelectorAll('#projects-grid > article').length }));
  await locale('ko');
  assert.deepEqual(await page.evaluate(() => ({ y: scrollY, count: document.querySelectorAll('#projects-grid > article').length })), beforeLocale);
  assert.ok(await video('zzz').evaluate(el => el.paused && el.currentTime < .01));
  await locale('en'); await page.mouse.move(0, 0);
  await thumbnail('zzz').hover({ position: { x: 30, y: 30 } });
  await page.waitForFunction(() => !document.querySelector('[data-project="zzz"] video').paused);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => {
    const video = document.querySelector('[data-project="zzz"] video');
    return video.paused && video.currentTime < .01;
  });
  assert.ok(await video('zzz').evaluate(el => el.paused && el.currentTime < .01));
  await page.mouse.move(0, 0); await thumbnail('zzz').hover();
  await page.waitForTimeout(250);
  assert.equal(await video('zzz').evaluate(el => el.paused), true);
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.mouse.move(0, 0);
  await thumbnail('zzz').hover();
  await page.waitForFunction(() => !document.querySelector('[data-project="zzz"] video').paused);
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('[data-project="zzz"] video').paused);
  pass('locale change, reduced-motion and offscreen scroll stop/reset playback');

  await page.emulateMedia({ reducedMotion: 'reduce' }); await goto(base + '/projects/');
  await page.locator('[data-project="zzz"] .project-card-link').focus();
  assert.equal(await page.locator(':focus').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('data-project-title'), 'Smart Parking');
  for (const slug of expected) {
    await page.locator('[data-project="' + slug + '"] .project-card-link').focus(); await page.keyboard.press('Enter');
    await page.waitForURL(base + '/work/' + slug + '/');
    assert.equal(await page.locator('.back-link').getAttribute('href'), '/#projects');
    assert.equal((await page.locator('.back-link').textContent()).trim(), '');
    assert.ok(await page.locator('.back-link').getAttribute('aria-label'));
    assert.equal(await page.locator('.back-link').evaluate(el => getComputedStyle(el).backgroundColor), navigationIconBackground);
    await goto(base + '/projects/');
  }
  await locale('ko');
  await page.locator('[data-project="zzz"] .project-card-link').click({ position: { x: 20, y: 20 } });
  await page.waitForURL(base + '/ko/work/zzz/');
  pass('normal keyboard tab order, visible focus and card EN/KO Deep Dive routes');

  await goto(base + '/work/zzz/');
  assert.equal(await page.locator('.media-enlarge,.media-lightbox,[data-media-enlarge]').count(), 0);
  const detailVideo = page.locator('.demo-stage iframe');
  assert.equal(await detailVideo.getAttribute('src'), 'https://www.youtube-nocookie.com/embed/eqvWtHHWINI?playsinline=1');
  assert.equal(await detailVideo.getAttribute('allowfullscreen'), '');
  assert.equal(await page.locator('.demo-stage video,.demo-toolbar,.demo-caption').count(), 0);
  for (const [slug, key] of [['zzz', 'project.source'], ['zzz', 'media.video'], ['kutodo', 'media.release']]) {
    await goto(base + '/work/' + slug + '/');
    const link = page.locator('[data-action-copy="' + key + '"]');
    const href = await link.getAttribute('href'), before = page.url();
    const popupPromise = page.waitForEvent('popup'); await link.click(); const popup = await popupPromise;
    await popup.waitForLoadState().catch(() => {});
    assert.equal(page.url(), before);
    assert.ok(externalRequests.includes(href));
    await popup.close(); await page.bringToFront();
  }
  await goto(base + '/work/baljucall/');
  assert.equal(await page.locator('.project-actions a,.media-enlarge').count(), 0);
  pass('detail YouTube iframe/fullscreen permission without custom media bars; external actions and null omission');

  await goto(fixtureUrl);
  assert.equal(await visibleCount(), 4);
  assert.equal(await page.locator('#projects-grid > article[hidden]').count(), 0);
  assert.equal(await page.locator('#project-inspector,[data-inspector-project]').count(), 0);
  assert.equal(await page.locator('.hero [data-action]').count(), 0);
  assert.equal(await page.locator('.profile-photo').count(), 0);
  assert.equal(await page.locator('.header .social-links a').count(), 2);
  const more = page.locator('[data-projects-more]');
  assert.equal(await more.getAttribute('href'), '/projects/');
  const beforeMoreLocale = await page.evaluate(() => scrollY);
  await locale('ko');
  assert.equal(await more.getAttribute('href'), '/ko/projects/');
  assert.equal(await more.getAttribute('aria-label'), '프로젝트 더 보기');
  assert.equal(await page.evaluate(() => scrollY), beforeMoreLocale);
  await more.click(); await page.waitForURL(fixtureUrl + '/ko/projects/');
  assert.equal(await page.locator('h1').textContent(), 'Projects');
  assert.equal(await page.locator('.back-link').getAttribute('href'), '/ko/#projects');
  assert.equal((await page.locator('.projects-home').textContent()).trim(), '');
  assert.equal(await page.locator('.projects-home').getAttribute('aria-label'), '홈으로 돌아가기');
  assert.equal(await page.locator('.projects-home').evaluate(el => getComputedStyle(el).backgroundColor), navigationIconBackground);
  assert.equal(await page.locator('[data-projects-more]').count(), 0);
  assert.equal(await visibleCount(), 27);
  assert.deepEqual(await page.locator('#projects-grid > article').evaluateAll(items => items.slice(0, 4).map(el => el.dataset.project)), ['ct', 'zzz', 'inserted', 'smart-parking']);
  for (const [width, columns] of [[1440, 2], [820, 2], [390, 1]]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await page.locator('#projects-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), columns);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.locator('[data-project="ready-image"]').scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await locale('en'); assert.equal(await visibleCount(), 27);
    assert.equal(await page.evaluate(() => scrollY), before);
    await locale('ko'); assert.equal(await page.evaluate(() => scrollY), before);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await locale('en'); await page.emulateMedia({ reducedMotion: 'no-preference' });
  await thumbnail('ready-video').hover();
  await page.waitForFunction(() => !document.querySelector('[data-project="ready-video"] video').paused);
  await page.mouse.move(0, 0);
  await page.waitForFunction(() => {
    const video = document.querySelector('[data-project="ready-video"] video');
    return video.paused && video.currentTime < .01;
  });
  pass('More link navigates to localized all-projects page; 27 content-only additions, responsive grid and locale position');
  await goto(fixtureUrl + '/work/ready-image/');
  assert.equal(await page.locator('.demo-stage img').getAttribute('src'), '/fixture.svg');
  assert.equal(await page.locator('.media-enlarge,.media-lightbox').count(), 0);
  await goto(fixtureUrl + '/work/ready-iframe/');
  const live = page.locator('[data-action-copy="project.liveDemo"]');
  const livePopup = page.waitForEvent('popup'); await live.click(); const demo = await livePopup;
  await demo.waitForLoadState(); assert.equal(await demo.locator('h1').textContent(), 'LOCAL_DEMO_FIXTURE');
  await demo.close(); await page.bringToFront();
  pass('detail image remains inline without popup; Live Demo unchanged');

  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await touchContext.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  const touchPage = await touchContext.newPage();
  await touchPage.goto(base); await touchPage.locator('[data-project="zzz"]').scrollIntoViewIfNeeded();
  await touchPage.waitForFunction(() => {
    const video = document.querySelector('[data-project="zzz"] video');
    return video.readyState >= 2 && video.paused && video.currentTime < .01;
  });
  assert.equal(await touchPage.locator('#project-inspector').count(), 0);
  assert.equal(await touchPage.locator('#projects-grid .media-enlarge,#projects-grid .project-actions').count(), 0);
  await touchPage.locator('[data-project="zzz"] .project-card-link').tap({ position: { x: 25, y: 25 } });
  await touchPage.waitForURL(base + '/work/zzz/');
  await touchContext.close(); await page.bringToFront();
  await page.setViewportSize({ width: 390, height: 844 }); await goto(base);
  await page.locator('[data-project="zzz"] .project-card-link').hover();
  await page.waitForTimeout(250); assert.equal(await video('zzz').evaluate(el => el.paused), true);
  pass('touch/mobile has no Inspector or autoplay; tap opens Deep Dive');

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 }); await goto(base);
    for (const [id, count] of Object.entries({ understand: 2, boundaries: 1, connect: 2, run: 2, failure: 2, ai: 1 })) {
      const trigger = page.locator('button[data-principle="' + id + '"]');
      await trigger.focus(); await page.keyboard.press(id === 'run' ? 'Space' : 'Enter');
      const dialog = page.locator('#build-dialog'), panel = dialog.locator('[data-principle-panel="' + id + '"]');
      assert.equal(await dialog.evaluate(el => el.open), true);
      assert.equal(await dialog.locator('[data-locale]').count(), 0);
      assert.equal(await dialog.locator('button').count(), 1);
      assert.deepEqual(await panel.locator('dt').allTextContents(), ['WHY', 'HOW', 'EVIDENCE']);
      assert.equal(new Set(await panel.locator('dt').evaluateAll(labels => labels.map(el => getComputedStyle(el).backgroundColor))).size, 3);
      assert.equal(await panel.locator('[data-evidence]').count(), count);
      assert.equal(await panel.locator('a').count(), 0);
      for (let i = 0; i < 5; i++) { await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').evaluate(el => el.closest('dialog')?.id), 'build-dialog'); }
      const before = await page.evaluate(() => ({ y: scrollY, count: document.querySelectorAll('#projects-grid > article').length }));
      await locale('ko');
      assert.equal(await dialog.getAttribute('data-principle'), id);
      assert.deepEqual(await page.evaluate(() => ({ y: scrollY, count: document.querySelectorAll('#projects-grid > article').length })), before);
      await page.keyboard.press('Escape');
      assert.equal(await dialog.evaluate(el => el.open), false);
      assert.equal(await page.locator(':focus').getAttribute('data-principle'), id);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(80);
    await page.waitForFunction(() => document.querySelector('.header').dataset.hidden === 'false');
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('.header').dataset.hidden === 'true');
    await page.evaluate(() => window.scrollBy({ top: -28, behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('.header').dataset.hidden === 'false');
  }
  pass('existing WHY/HOW/EVIDENCE dialogs, focus trap, locale context, Escape and Header scroll behavior');

  for (const type of ['iframe', 'video', 'terminal', 'apk', 'image', 'none']) {
    await goto(fixtureUrl + '/work/null-' + type + '/');
    assert.equal(await page.locator('[data-demo-state="fallback"]').count(), 1);
  }
  await goto(fixtureUrl + '/work/ready-iframe/');
  assert.equal(await page.frameLocator('iframe').locator('h1').textContent(), 'LOCAL_DEMO_FIXTURE');
  await goto(fixtureUrl + '/work/ready-video/');
  assert.equal(await page.locator('.demo-stage iframe').getAttribute('src'), 'https://www.youtube-nocookie.com/embed/eqvWtHHWINI?playsinline=1');
  assert.equal(await page.locator('video').count(), 0);
  await goto(fixtureUrl + '/work/ready-terminal/');
  assert.equal(await page.locator('[data-demo-state="fallback"]').count(), 1);
  assert.equal(await page.locator('video').count(), 0);
  await goto(fixtureUrl + '/work/broken-image/'); await page.locator('.media-error').waitFor();
  await goto(base); await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
  await page.keyboard.press('Enter'); assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
  assert.deepEqual(errors, []);
  pass('detail media/fallbacks, skip link and no browser runtime errors');
  writeFileSync(join(out, 'theme-contrast.json'), JSON.stringify(contrastResults, null, 2));
  writeFileSync(join(out, 'browser-results.json'), JSON.stringify({ passed, viewports: [1600, 1440, 1280, 1100, 820, 390, 360], externalRequests: 'blocked' }, null, 2));
} finally {
  await browser?.close();
  await new Promise(done => fixtureServer.close(done));
  await new Promise(done => mainServer.close(done));
}
