// 실제 Astro 빌드 결과를 검사합니다. 원본 콘텐츠 대신 .verification 내부 복사본만 변경합니다.
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
const cli = resolve(root, 'node_modules/astro/bin/astro.mjs');
const build = cwd => {
  const result = spawnSync(process.execPath, [cli, 'build'], { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stdout + result.stderr);
};
const read = (dir, path = 'index.html') => readFileSync(join(dir, 'dist', path), 'utf8');
const section = (html, id) => html.split('id="' + id + '"')[1]?.split('</section>')[0] || '';
const projects = html => [...html.matchAll(/data-project="([^"]+)"/g)].map(match => match[1]);
const passed = [];
const test = (label, run) => { run(); passed.push(label); console.log('PASS ' + label); };
build(root);
const baseline = read(root);
test('baseline selected work and tools', () => {
  assert.deepEqual(projects(section(baseline, 'work')), ['kutodo', 'zzz', 'kuroom']);
  assert.deepEqual(projects(section(baseline, 'tools')), ['ct', 'review-analyzer']);
});
const edit = (slug, before, after) => {
  const path = join(fixture, 'src/content/projects', slug + '.md');
  const original = readFileSync(path, 'utf8');
  assert.ok(original.includes(before), 'Mutation target missing: ' + slug);
  writeFileSync(path, original.replace(before, after));
};
edit('kutodo', 'hidden: false', 'hidden: true');
edit('zzz', 'featured: true', 'featured: false');
edit('kuroom', 'section: "work"', 'section: "tools"');
edit('ct', 'order: 4', 'order: -5');
const probe = (slug, demo, extra = {}) => {
  const data = { title: slug, slug, summary: '[Fixture] content system probe', featured: true, section: 'work', order: 10, hidden: false, demo, ...extra };
  const frontmatter = Object.entries(data).map(([key, value]) => key + ': ' + JSON.stringify(value)).join('\n');
  writeFileSync(join(fixture, 'src/content/projects', slug + '.md'), '---\n' + frontmatter + '\n---\n\n## Fixture body\n\nAUTOMATIC_MARKDOWN_BODY\n');
};
for (const type of ['iframe', 'video', 'terminal', 'apk', 'image', 'none']) probe('null-' + type, { type, url: null });
probe('ready-iframe', { type: 'iframe', url: '/demo-fixture.html' });
probe('ready-video', { type: 'video', url: '/fixture.webm', poster: '/fixture.svg' });
probe('ready-terminal', { type: 'terminal', format: 'video', url: '/fixture.webm' });
probe('ready-terminal-image', { type: 'terminal', format: 'image', url: '/fixture.svg', alt: 'Terminal fixture' });
probe('ready-image', { type: 'image', url: '/fixture.svg', alt: 'Image fixture' });
probe('ready-apk', { type: 'apk', url: '/fixture.apk' }, { links: { release: '/fixture-release.html', video: '/fixture.webm', source: '/fixture-source.html' } });
probe('broken-image', { type: 'image', url: '/missing-image.png', alt: 'Missing image fixture' });
writeFileSync(join(fixture, 'public/demo-fixture.html'), '<!doctype html><html lang="en"><title>Local demo fixture</title><h1>LOCAL_DEMO_FIXTURE</h1></html>');
writeFileSync(join(fixture, 'public/fixture.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="#242720"/><text x="40" y="200" fill="#c7db85">LOCAL MEDIA FIXTURE</text></svg>');
build(fixture);
const html = read(fixture);
test('new md automatically renders and generates a static detail route', () => {
  assert.ok(projects(section(html, 'work')).includes('null-video'));
  assert.ok(read(fixture, 'work/null-video/index.html').includes('AUTOMATIC_MARKDOWN_BODY'));
});
test('hidden excludes home AND generated detail route', () => {
  assert.ok(!projects(html).includes('kutodo'));
  assert.ok(!existsSync(join(fixture, 'dist/work/kutodo/index.html')));
});
test('featured false moves out of selected work', () => {
  assert.ok(!projects(section(html, 'work')).includes('zzz'));
  assert.ok(projects(section(html, 'tools')).includes('zzz'));
});
test('section tools overrides featured true', () => {
  assert.ok(!projects(section(html, 'work')).includes('kuroom'));
  assert.ok(projects(section(html, 'tools')).includes('kuroom'));
});
test('order controls rendered order', () => assert.equal(projects(section(html, 'tools'))[0], 'ct'));
for (const type of ['iframe', 'video', 'terminal', 'apk', 'image', 'none']) test('null fallback: ' + type, () => {
  const detail = read(fixture, 'work/null-' + type + '/index.html');
  assert.ok(detail.includes('data-demo-type="' + type + '"'));
  assert.ok(detail.includes('data-demo-state="fallback"'));
  assert.ok(!/src="(?:null|undefined|)"/.test(detail));
});
test('ready media and APK actions render from metadata', () => {
  assert.ok(read(fixture, 'work/ready-iframe/index.html').includes('<iframe'));
  assert.ok(read(fixture, 'work/ready-iframe/index.html').includes('Open Full Demo'));
  for (const slug of ['ready-video', 'ready-terminal']) assert.ok(read(fixture, 'work/' + slug + '/index.html').includes('<video'));
  for (const slug of ['ready-image', 'ready-terminal-image']) assert.ok(read(fixture, 'work/' + slug + '/index.html').includes('src="/fixture.svg"'));
  assert.ok(read(fixture, 'work/ready-apk/index.html').includes('Download APK'));
  assert.ok(read(fixture, 'work/ready-apk/index.html').includes('Release'));
});
test('all anchor targets and no empty hrefs', () => {
  for (const id of ['work', 'tools', 'about', 'contact']) {
    assert.ok(baseline.includes('href="#' + id + '"'));
    assert.ok(baseline.includes('id="' + id + '"'));
  }
  assert.ok(!/href="(?:null|undefined|)"/.test(baseline));
});
const result = { passed, fixture, fixtureDist: join(fixture, 'dist') };
writeFileSync(join(artifacts, 'content-results.json'), JSON.stringify(result, null, 2));
console.log(passed.length + ' content/build checks passed.');
