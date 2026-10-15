// Build real Astro output; mutations stay inside .verification.
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
const artifacts = join(root, '.verification');
mkdirSync(artifacts, { recursive: true });
const fixture = mkdtempSync(join(artifacts, 'content-'));
for (const entry of ['src', 'public', 'package.json', 'astro.config.mjs', 'tsconfig.json']) cpSync(join(root, entry), join(fixture, entry), { recursive: true });
const build = cwd => {
  const result = spawnSync(process.execPath, [resolve(root, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stdout + result.stderr);
};
const read = (dir, path = 'index.html') => readFileSync(join(dir, 'dist', path), 'utf8');
const section = html => html.split('<section id="projects"')[1]?.split('<section id="process"')[0] || '';
const cards = html => [...html.matchAll(/<article[^>]*data-project="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
const slugs = html => cards(html).map(match => match[1]);
const passed = [];
const test = (label, run) => { run(); passed.push(label); console.log('PASS ' + label); };
const expected = ['zzz', 'smart-parking', 'review-analyzer', 'ct', 'kuroom', 'kutodo', 'baljucall'];
build(root);
const baseline = read(root);
const gallery = read(root, 'projects/index.html');
test('home shows four projects in requested order and links to the complete Projects page', () => {
  assert.deepEqual(slugs(section(baseline)), expected.slice(0, 4));
  assert.deepEqual(slugs(gallery), expected);
  assert.equal((baseline.match(/<section id="projects"/g) || []).length, 1);
  assert.ok(!baseline.includes('<section id="work"') && !baseline.includes('<section id="tools"'));
  assert.ok(!baseline.includes('Featured Projects') && !baseline.includes('Tools &amp; Side Projects'));
  assert.ok(/<a[^>]*href="\/projects\/"[^>]*data-projects-more/.test(baseline));
  assert.ok(!/<button[^>]*data-projects-more/.test(baseline) && !baseline.includes('class="rail-track'));
  for (const [i, slug] of expected.entries()) assert.match(readFileSync(join(root, 'src/content/projects', slug + '.md'), 'utf8'), new RegExp('^order: ' + (i + 1) * 10 + '$', 'm'));
});
test('video cards use their own first frame with lazy sources and no Inspector', () => {
  for (const slug of ['zzz', 'kuroom', 'ct', 'review-analyzer', 'smart-parking']) {
    const card = cards(gallery).find(match => match[1] === slug)[2];
    const thumbnail = card.match(/<video [^>]*>/)[0];
    assert.ok(thumbnail.includes('data-thumbnail-src="/videos/projects/' + slug + '/demo.mp4"'));
    assert.ok(!/\ssrc=/.test(thumbnail) && !thumbnail.includes('autoplay') && !thumbnail.includes('poster=') && !card.includes('<img'));
    assert.ok(thumbnail.includes('preload="none"') && thumbnail.includes('playsinline') && thumbnail.includes('loop'));
    const detail = read(root, 'work/' + slug + '/index.html');
    const videoId = readFileSync(join(root, 'src/content/projects', slug + '.md'), 'utf8').match(/"video":"https:\/\/youtu\.be\/([\w-]+)/)[1];
    assert.ok(detail.includes('src="https://www.youtube-nocookie.com/embed/' + videoId + '?playsinline=1"'));
    assert.ok(detail.includes('allowfullscreen') && !detail.includes('<video'));
    assert.ok(!detail.includes('class="demo-toolbar"') && !detail.includes('class="demo-caption"'));
  }
  assert.equal((baseline.match(/<video /g) || []).length, 4);
  assert.equal((gallery.match(/<video /g) || []).length, 5);
  assert.ok(!baseline.includes('id="project-inspector"') && !baseline.includes('data-inspector-project'));
});
test('optional Mermaid diagrams render to accessible static SVG in both locale bodies', () => {
  for (const slug of expected) {
    const source = readFileSync(join(root, 'src/content/projects', slug + '.md'), 'utf8');
    const count = (source.match(/^(?:```|~~~)mermaid$/gm) || []).length;
    for (const prefix of ['', 'ko/']) {
      const detail = read(root, prefix + 'work/' + slug + '/index.html');
      assert.equal((detail.match(/class="project-diagram"/g) || []).length, count * 3);
      if (count) {
        assert.match(detail, /aria-roledescription="flowchart(?:-v2)?"/);
        assert.ok(detail.includes('<title id="chart-title-mermaid-0">'));
        assert.ok(detail.includes('<desc id="chart-desc-mermaid-0">'));
      }
      assert.ok(!detail.includes('language-mermaid') && !detail.includes('flowchart TB'));
    }
  }
});
const edit = (slug, before, after) => {
  const path = join(fixture, 'src/content/projects', slug + '.md');
  const content = readFileSync(path, 'utf8'); assert.ok(content.includes(before)); writeFileSync(path, content.replace(before, after));
};
edit('zzz', 'featured: true', 'featured: false');
edit('kuroom', 'section: "work"', 'section: "tools"');
edit('ct', 'order: 40', 'order: -5');
edit('zzz', '"teamSize":4', '"teamSize":null');
edit('ct', 'cardTech: ["Go","VS Code"]', 'cardTech: ["Go","VS Code","JSON"]');
let sequence = 1000;
const probe = (slug, demo, extra = {}) => {
  const data = { title: slug, slug, summary: '[Fixture] content system probe', order: sequence++, demo, ...extra };
  const frontmatter = Object.entries(data).filter(([, value]) => value !== undefined).map(([key, value]) => key + ': ' + JSON.stringify(value)).join('\n');
  writeFileSync(join(fixture, 'src/content/projects', slug + '.md'), '---\n' + frontmatter + '\n---\n\n## Fixture body\n\nAUTOMATIC_MARKDOWN_BODY\n');
};
probe('inserted', { type: 'none', url: null }, { order: 15 });
const insertedPath = join(fixture, 'src/content/projects/inserted.md');
writeFileSync(insertedPath, readFileSync(insertedPath, 'utf8') + '\n> MARKDOWN_QUOTE\n\n1. FIRST_STEP\n2. SECOND_STEP\n\n| Item | Value |\n| --- | --- |\n| code | `inline` |\n\n```js\nconst longLine = "' + 'markdown-width-probe-'.repeat(20) + '";\n```\n');
probe('no-order', { type: 'none', url: null }, { order: undefined });
writeFileSync(insertedPath, readFileSync(insertedPath, 'utf8') + '\n~~~mermaid\nflowchart TB\n  accTitle: Markdown diagram fixture\n  accDescr: Input connects to the system.\n  A["FIXTURE_INPUT"] --> B["FIXTURE_SYSTEM"]\n~~~\n');
for (const type of ['iframe', 'video', 'terminal', 'apk', 'image', 'none']) probe('null-' + type, { type, url: null });
probe('ready-iframe', { type: 'iframe', url: '/demo-fixture.html' }, { links: { liveDemo: '/demo-fixture.html' } });
probe('ready-video', { type: 'video', url: '/fixture.mp4', poster: '/fixture.svg' }, { links: { video: 'https://www.youtube.com/watch?v=eqvWtHHWINI' } });
probe('ready-terminal', { type: 'terminal', format: 'video', url: '/fixture.mp4' });
probe('ready-terminal-image', { type: 'terminal', format: 'image', url: '/fixture.svg', alt: 'Terminal fixture' });
probe('ready-image', { type: 'image', url: '/fixture.svg', alt: 'Image fixture' }, { logo: '/fixture.svg', thumbnail: '/thumbnail.svg', links: { caseStudy: '/fixture-case-study.html', demo: '/demo-fixture.html' }, translations: { en: { summary: 'ENGLISH_METADATA_FIXTURE' }, ko: { summary: 'KOREAN_METADATA_FIXTURE' } } });
probe('small-media', { type: 'none', url: null }, { featured: false, section: 'tools', logo: '/fixture.svg', thumbnail: '/thumbnail.svg' });
probe('hidden-probe', { type: 'none', url: null }, { hidden: true });
probe('ready-apk', { type: 'apk', url: '/fixture.apk' }, { links: { release: '/fixture-release.html', video: '/fixture.mp4', source: '/fixture-source.html' } });
probe('broken-image', { type: 'image', url: '/missing-image.png', alt: 'Missing image fixture' });
for (let i = 0; i < 4; i++) probe('extra-' + i, { type: 'none', url: null }, { order: 10000 + i });
writeFileSync(join(fixture, 'public/demo-fixture.html'), '<!doctype html><title>Local demo fixture</title><h1>LOCAL_DEMO_FIXTURE</h1>');
writeFileSync(join(fixture, 'public/fixture.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#242720"/><text x="40" y="180" fill="#c7db85">LOCAL MEDIA FIXTURE</text></svg>');
cpSync(join(fixture, 'public/fixture.svg'), join(fixture, 'public/thumbnail.svg'));
cpSync(join(root, 'public/videos/projects/zzz/demo.mp4'), join(fixture, 'public/fixture.mp4'));
writeFileSync(join(fixture, 'public/fixture-case-study.html'), '<!doctype html><title>Fixture Case Study</title>CASE_STUDY_FIXTURE');
const sitePath = join(fixture, 'src/data/site.ts');
writeFileSync(sitePath, readFileSync(sitePath, 'utf8')
  .replace("resumeUrl: '/files/resume-public.pdf', portfolioPdfUrl: '/files/portfolio.pdf'", 'resumeUrl: null, portfolioPdfUrl: null')
  .replace("profileImage: '/images/profile/jeonggil.jpg'", 'profileImage: null')
  .replace("url: 'https://github.com/GIRIBUIN', contact: true", 'url: null, contact: true'));
build(fixture);
const html = read(fixture, 'projects/index.html');
test('Markdown-only additions render, insert by order, and leave missing order last', () => {
  const list = slugs(section(html));
  assert.deepEqual(list.slice(0, 4), ['ct', 'zzz', 'inserted', 'smart-parking']);
  assert.equal(list.at(-1), 'no-order');
  assert.equal(list.length, 27);
  assert.ok(read(fixture, 'work/inserted/index.html').includes('AUTOMATIC_MARKDOWN_BODY'));
  const document = read(fixture, 'work/inserted/index.html');
  for (const element of ['<blockquote>', '<ol>', '<table>', 'class="astro-code']) assert.ok(document.includes(element));
  assert.ok(document.includes('FIXTURE_INPUT') && document.includes('class="project-diagram"'));
  assert.ok(!document.includes('language-mermaid'));
});
test('legacy featured/section do not split or exclude Projects', () => {
  for (const slug of expected) assert.equal(slugs(section(html)).filter(value => value === slug).length, 1);
});
test('hidden excludes home and both localized detail routes', () => {
  assert.ok(!slugs(html).includes('hidden-probe'));
  for (const prefix of ['', 'ko/']) assert.ok(!existsSync(join(fixture, 'dist', prefix + 'work/hidden-probe/index.html')));
});
test('27-project fixture has four home cards and all projects on the separate page', () => {
  assert.equal(cards(read(fixture)).length, 4);
  assert.equal(cards(html).length, 27);
  assert.ok(!html.includes('data-projects-more') && !html.includes('data-visible-count'));
  assert.ok(html.includes('data-thumbnail-src="/fixture.mp4"'));
  assert.ok(read(fixture).includes('href="/projects/"') && read(fixture, 'ko/index.html').includes('href="/ko/projects/"'));
});
for (const type of ['iframe', 'video', 'terminal', 'apk', 'image', 'none']) test('null fallback: ' + type, () => {
  const detail = read(fixture, 'work/null-' + type + '/index.html');
  assert.ok(detail.includes('data-demo-state="fallback"'));
  assert.ok(!/src="(?:null|undefined|)"/.test(detail));
});
test('optional thumbnail and detail logo/media reuse the content schema', () => {
  for (const slug of ['ready-image', 'small-media']) {
    const card = cards(html).find(match => match[1] === slug)[2];
    assert.ok(card.includes('src="/thumbnail.svg"'));
    assert.ok(read(fixture, 'work/' + slug + '/index.html').includes('class="project-logo"'));
  }
  assert.ok(read(fixture, 'work/ready-iframe/index.html').includes('<iframe'));
  assert.ok(read(fixture, 'work/ready-video/index.html').includes('src="https://www.youtube-nocookie.com/embed/eqvWtHHWINI?playsinline=1"'));
  const noYouTube = read(fixture, 'work/ready-terminal/index.html');
  assert.ok(!noYouTube.includes('<video') && noYouTube.includes('data-demo-state="fallback"'));
  const videoCard = cards(html).find(match => match[1] === 'ready-video')[2];
  assert.ok(videoCard.includes('data-thumbnail-src="/fixture.mp4"') && !videoCard.includes('<img') && !videoCard.includes('poster='));
  assert.ok(read(fixture, 'work/ready-apk/index.html').includes('Download APK'));
});
test('basic cards omit metadata/tech/actions and detail pages keep real actions', () => {
  for (const card of cards(baseline)) {
    const markup = card[2];
    assert.ok(!markup.includes('project-type') && !markup.includes('project-tech') && !markup.includes('project-actions') && !markup.includes('data-media-enlarge'));
    assert.ok(markup.includes('data-action-copy="project.deepDive"'));
  }
  for (const slug of expected) {
    const markup = read(root, 'work/' + slug + '/index.html');
    assert.ok(!/href="(?:#|javascript:[^"]*|null|undefined|)"/.test(markup));
    assert.ok(!markup.includes('data-media-enlarge') && !markup.includes('media-lightbox'));
  }
  assert.ok(read(fixture, 'work/ready-iframe/index.html').includes('data-action-copy="project.liveDemo"'));
  assert.ok(!html.includes('data-action-copy="project.demo"'));
});
test('Projects browse UI never renders Input/Decision/Output trace', () => {
  for (const locale of ['', 'ko/']) {
    const home = read(root, locale + 'index.html');
    assert.ok(!home.includes('class="project-trace"'));
    for (const key of ['input', 'decision', 'output']) assert.ok(!home.includes('data-i18n="projects.zzz.trace.' + key + '"'));
  }
  assert.ok(!cards(html).find(match => match[1] === 'inserted')[2].includes('class="project-trace"'));
});
test('EN/KO content and existing localized detail routes remain available', () => {
  for (const [locale, language] of [['', 'en'], ['ko/', 'ko']]) {
    const home = read(root, locale + 'index.html');
    assert.ok(home.includes('<html lang="' + language + '"'));
    for (const slug of expected.slice(0, 4)) assert.ok(home.includes('href="/' + locale + 'work/' + slug + '/"'));
    const page = read(root, locale + 'projects/index.html');
    assert.ok(page.includes('<h1 id="projects-heading"'));
    for (const slug of expected) assert.ok(page.includes('href="/' + locale + 'work/' + slug + '/"'));
  }
  assert.ok(read(fixture).includes('ENGLISH_METADATA_FIXTURE'));
  assert.ok(read(fixture, 'ko/projects/index.html').includes('KOREAN_METADATA_FIXTURE'));
  assert.ok(cards(html).find(match => match[1] === 'ready-image')[2].includes('href="/work/ready-image/"'));
});
test('canonical Projects navigation and legacy hash anchors exist', () => {
  for (const id of ['projects', 'work', 'tools']) assert.ok(baseline.includes('id="' + id + '"'));
  assert.ok(baseline.includes('href="#projects"'));
  for (const slug of expected) assert.ok(read(root, 'work/' + slug + '/index.html').includes('href="/#projects"'));
});
test('profile flow and footer PDF, Projects, Hero links remain intact', () => {
  const order = ['id="hero-title"', 'id="about"', 'id="education"', 'id="skills"', 'id="projects"', 'id="process"', 'id="contact"'];
  assert.ok(order.every((key, i) => i === 0 || baseline.indexOf(key) > baseline.indexOf(order[i - 1])));
  for (const file of ['resume-public.pdf', 'portfolio.pdf']) assert.equal(readFileSync(join(root, 'dist/files', file)).subarray(0, 4).toString(), '%PDF');
  assert.match(baseline, /<footer[^>]*><span>@giribuin<\/span>/);
  for (const href of ['/files/resume-public.pdf', '/files/portfolio.pdf', '/projects/', '/#hero']) assert.ok(baseline.includes('href="' + href + '"'));
  const korean = read(root, 'ko/index.html');
  assert.ok(korean.includes('href="/ko/projects/"') && korean.includes('href="/ko/#hero"'));
});
test('null profile/PDF/social URLs omit controls without empty URLs', () => {
  const home = read(fixture);
  assert.ok(!home.includes('data-action="resume"') && !home.includes('data-action="portfolio-pdf"'));
  assert.ok(!home.includes('class="profile-photo"') && !/href="(?:null|undefined|)"/.test(home));
});
writeFileSync(join(artifacts, 'content-results.json'), JSON.stringify({ passed, fixture, fixtureDist: join(fixture, 'dist') }, null, 2));
console.log(passed.length + ' content/build checks passed.');
