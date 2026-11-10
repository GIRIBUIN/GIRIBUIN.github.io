import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { removeGenerated } from './clean.mjs';
const root = resolve('.');
const out = resolve('.verification'); mkdirSync(out, { recursive: true });
const expected = ['zzz','smart-parking','review-analyzer','ct','kuroom','kutodo','baljucall','convoary','spool','kvcompact'];
const build = cwd => {
  const result = spawnSync(process.execPath, [join(root,'node_modules/astro/bin/astro.mjs'),'build'], { cwd, encoding:'utf8' });
  if(result.status !== 0) throw new Error(result.stdout + result.stderr);
};
const read = (base, path) => readFileSync(join(base,'dist',path,'index.html'),'utf8');
const passed = [];
const test = (name, run) => { run(); passed.push(name); console.log('PASS '+name); };
build(root);
test('EN/KO home exposes identity, role and exactly three selected projects without a React island', () => {
  for(const prefix of ['', 'ko/']) {
    const home=read(root,prefix);
    assert.equal((home.match(/class="project-row selected-row"/g)||[]).length,3);
    for(const slug of ['zzz','kutodo','convoary'])assert.ok(home.includes('data-project="'+slug+'"'));
    assert.ok(home.includes('Backend / Systems / Platform') && home.includes('mailto:giribuin@gmail.com'));
    assert.ok(!home.includes('<astro-island') && !home.includes('<canvas') && !home.includes('<dialog'));
    assert.ok(!home.includes('>Posts</a>'));
    assert.ok(!existsSync(join(root,'dist',prefix+'posts/index.html')));
  }
});
test('all projects remain static HTML with lightweight filters and no React hydration', () => {
  for(const prefix of ['', 'ko/']) {
    const archive=read(root,prefix+'projects');
    assert.deepEqual([...archive.matchAll(/data-project="([^"]+)"/g)].map(x=>x[1]),expected);
    assert.equal((archive.match(/<astro-island /g)||[]).length,0);
    assert.ok(archive.includes('data-filter="featured"') && archive.includes('data-count-label='));
    for(const slug of expected)assert.ok(archive.includes('href="/'+prefix+'projects/'+slug+'/"'));
    assert.ok(!archive.includes('<video') && !archive.includes('<iframe'));
  }
});
test('localized detail, source links, media, canonical URLs and old /work URLs remain available', () => {
  for(const slug of expected) {
    const md=readFileSync(join(root,'src/content/projects',slug+'.md'),'utf8');
    const links=slug === 'spool' ? { source: 'https://github.com/GIRIBUIN/spool' } : JSON.parse(md.match(/^links: (.+)$/m)?.[1] || '{}');
    for(const prefix of ['', 'ko/']) {
      const html=read(root,prefix+'projects/'+slug);
      const legacy=read(root,prefix+'work/'+slug);
      assert.ok(html.includes('data-project-body') && !html.includes('<astro-island') && !html.includes('<template'));
      assert.ok(html.includes('rel="canonical" href="https://giribuin.github.io/'+prefix+'projects/'+slug+'/"'));
      assert.ok(legacy.includes('data-project-body') && legacy.includes('/'+prefix+'projects/'+slug+'/'));
      for(const url of Object.values(links).filter(Boolean))assert.ok(html.includes(url.replaceAll('&','&amp;')), slug+' lost '+url);
      if(links.video)assert.ok(html.includes('youtube-nocookie.com/embed/') && html.includes('loading="lazy"'));
      assert.ok(!html.includes('.mp4') && !html.includes('<video') && !html.includes('class="detail-links"'));
      assert.ok(!html.includes('id="links-heading"'));
      assert.ok(!html.includes('project-explorer-window') && !html.includes('Project notes'));
    }
  }
});
test('architecture diagrams remain accessible static SVG, including both locale versions', () => {
  for(const slug of expected) {
    const count=(readFileSync(join(root,'src/content/projects',slug+'.md'),'utf8').match(/^(?:~~~|```)mermaid$/gm)||[]).length;
    for(const prefix of ['', 'ko/']) {
      const html=read(root,prefix+'projects/'+slug);
      assert.equal((html.match(/class="project-diagram"/g)||[]).length,count);
      if(count)assert.ok(html.includes('aria-roledescription="flowchart') && html.includes('chart-desc-'));
    }
  }
});
test('About exposes only existing documents/contact/education and no game UI', () => {
  for(const prefix of ['', 'ko/']) {
    const html=read(root,prefix+'about');
    assert.equal(html.split('href="/files/resume-public.pdf"').length-1,1);
    assert.equal(html.split('href="/files/portfolio.pdf"').length-1,1);
    assert.ok(!html.includes('Experience in projects'));
    assert.ok(html.includes('2027.02') && html.includes('Linux · Docker · Git'));
    assert.ok(!html.includes('How I Build') && !html.includes('<astro-island') && !html.includes('<dialog'));
  }
});
test('generated local navigation/assets resolve and pages have basic SEO/lang metadata', () => {
  const pages=['','about','contact','projects',...expected.flatMap(slug=>['projects/'+slug,'work/'+slug])];
  for(const prefix of ['', 'ko/'])for(const page of pages) {
    const html=read(root,prefix+page);
    assert.ok(html.includes('<html lang="'+(prefix?'ko':'en')+'"') && html.includes('name="description"') && html.includes('hreflang="ko"'));
    assert.ok(html.includes('<title>GIRIBUIN</title>') && html.includes('name="theme-color" content="#ffffff"'));
    for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      if(match[1].startsWith('//'))continue;
      const file=join(root,'dist',decodeURIComponent(match[1]));
      assert.ok(existsSync(file),prefix+page+' references missing '+match[1]);
    }
    assert.ok(!/href="(?:null|undefined|)"/.test(html));
  }
});
test('3D runtime dependencies and generated WebGL bundles are removed', () => {
  const pkg=JSON.parse(readFileSync(join(root,'package.json'),'utf8'));
  for(const name of ['three','@react-three/fiber','@types/three'])assert.ok(!pkg.dependencies?.[name] && !pkg.devDependencies?.[name]);
  assert.ok(!existsSync(join(root,'dist/models/pet.glb')));
  const scripts=readdirSync(join(root,'dist/_astro')).filter(x=>x.endsWith('.js')).map(x=>readFileSync(join(root,'dist/_astro',x),'utf8')).join('');
  assert.ok(!scripts.includes('WebGLRenderer') && !scripts.includes('portfolio.project-split'));
  assert.ok(!read(root,'projects').includes('renderer-url='),'Static filters must not hydrate a framework renderer');
});
test('unicode-ranged fonts retain disjoint coverage and avoid the original large runtime font', () => {
  const manifest=JSON.parse(readFileSync(join(root,'public/fonts/portfolio/manifest.json'),'utf8'));
  const seen=new Set();
  for(const font of manifest.files) {
    const bytes=readFileSync(join(root,'public/fonts/portfolio',font.file));
    assert.equal(bytes.subarray(0,4).toString(),'wOF2');
    assert.equal(bytes.length,font.bytes);
    let count=0;
    for(const range of font.unicodeRange.split(',')) {
      const [start,end=start]=range.slice(2).split('-').map(value=>parseInt(value,16));
      for(let point=start;point<=end;point++) {assert.ok(!seen.has(point),'Font subsets must not overlap');seen.add(point);count++;}
    }
    assert.equal(count,font.characters);
  }
  assert.ok(seen.has('최'.codePointAt(0)) && seen.has('A'.codePointAt(0)));
  assert.ok(manifest.files.filter(font=>/^(latin|common)-/.test(font.file)).reduce((sum,font)=>sum+font.bytes,0)<200_000);
  assert.ok(!readFileSync(join(root,'src/styles/font-face.css'),'utf8').includes('PretendardVariable.woff2'));
});
removeGenerated('.verification/content-current');
const fixture=join(out,'content-current'); mkdirSync(fixture);
for(const file of ['src','public','package.json','astro.config.mjs','tsconfig.json'])cpSync(join(root,file),join(fixture,file),{recursive:true});
const edit=(slug,fn)=>{const path=join(fixture,'src/content/projects',slug+'.md');writeFileSync(path,fn(readFileSync(path,'utf8')));};
edit('zzz',s=>s.replace('origin: null','origin: guided'));
edit('smart-parking',s=>s.replace('origin: null','origin: foundation'));
edit('kuroom',s=>s.replace('hidden: false','hidden: true'));
edit('baljucall',s=>s.replace(/^thumbnail:.*$/m,'thumbnail: null').replace(/^logo:.*$/m,'logo: null'));
edit('baljucall',s=>s.replace('validation: null','validation: prototype'));
build(fixture);
test('fixture enables real Guided/Foundation data and excludes hidden projects without dummy metadata', () => {
  const archive=read(fixture,'projects');
  assert.ok(archive.includes('data-origin="guided"') && archive.includes('data-origin="foundation"'));
  assert.ok(!archive.includes('data-project="kuroom"'));
  assert.ok(!existsSync(join(fixture,'dist/projects/kuroom/index.html')));
  assert.ok(read(fixture,'projects/baljucall').includes('data-project-body'));
});
test('lifecycle, origin and validation are independent; unknown states stay unset', () => {
  const archive=read(root,'projects');
  assert.ok(archive.includes('data-status="completed" data-validation="prototype"'));
  assert.ok(archive.includes('data-status="completed" data-validation="in-use"'));
  assert.ok(archive.includes('>Planned</button>'));
  const fixtureArchive=read(fixture,'projects');
  assert.ok(fixtureArchive.includes('data-status="planning" data-validation="prototype"'));
  assert.ok(fixtureArchive.includes('>Planned</button>'));
  assert.ok(/data-project="convoary"[^>]*data-status="completed"/.test(archive));
  assert.ok(!/data-project="spool"[^>]*data-validation=/.test(archive));
  assert.ok(!/data-project="kvcompact"[^>]*data-validation=/.test(archive));
  assert.ok(read(root,'ko/projects/baljucall').includes('<h1>콕착</h1>'));
  assert.ok(read(root,'projects/baljucall').includes('<h1>Kokchack</h1>'));
});
writeFileSync(join(out,'content-results.json'),JSON.stringify({passed,fixtureDist:join(fixture,'dist')},null,2));
console.log(passed.length+' content/build groups passed.');
