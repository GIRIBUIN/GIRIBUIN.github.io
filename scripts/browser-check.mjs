import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { openSite } from './browser-harness.mjs';
const out=resolve('.verification');mkdirSync(out,{recursive:true});
const site=await openSite();const passed=[],errors=[];
const pass=name=>{passed.push(name);console.log('PASS '+name);};
const expected=['zzz','smart-parking','review-analyzer','ct','kuroom','kutodo','baljucall','convoary','spool','kvcompact'];
const connect=async options=>{
  const context=await site.browser.newContext({locale:'en-US',reducedMotion:'reduce',...options});
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  return context;
};
try{
  const context=await connect({viewport:{width:1440,height:1000}});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const requests=[];page.on('request',request=>requests.push(request.url()));
  const goto=async path=>{await page.goto(site.base+path);await page.evaluate(()=>document.fonts.ready);};
  const visibleProjects=()=>page.locator('#project-list [data-project]:visible').evaluateAll(items=>items.map(el=>el.dataset.project));
  await goto('/');
  assert.equal(await page.locator('h1').textContent(),'Jeong-gil Choi');
  assert.equal(await page.locator('.home-intro .eyebrow').textContent(),'Backend / Systems / Platform');
  assert.equal(await page.locator('astro-island,main canvas,dialog').count(),0);
  assert.equal(await page.locator('canvas,[data-header-pet]').count(),0);
  assert.equal(await page.locator('.brand img').getAttribute('src'),'/favicon.svg');
  assert.deepEqual(await page.locator('.primary-nav a').allTextContents(),['Home','Projects','About']);
  assert.equal(await page.locator('.home-links a').count(),2);
  assert.equal(await page.locator('.selected-projects article').count(),3);
  assert.equal(await page.locator('.archive-link').textContent(),'');
  assert.equal(await page.locator('.archive-link').getAttribute('aria-label'),'All projects');
  assert.equal(await page.locator('.archive-link svg').count(),1);
  assert.ok(await page.locator('.home-intro').evaluate(el=>el.getBoundingClientRect().bottom<innerHeight));
  assert.ok(!requests.some(url=>/\.mp4/.test(url)));
  assert.equal(requests.filter(url=>url.endsWith('/models/pet.glb')).length,0);
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('href'),'#main');
  await page.screenshot({path:join(out,'v3-home-1440.png'),fullPage:true});
  pass('Favicon brand and text navigation; Home has only GitHub/email actions and no 3D/video requests');

  await page.locator('.site-header nav a[href="/projects/"]').click();await page.waitForURL('**/projects/');
  await page.locator('[data-filters-ready]').waitFor();
  assert.deepEqual(await visibleProjects(),expected);
  assert.deepEqual(await page.locator('.project-filters button[data-filter]').allTextContents(),['All','Featured','In Progress','Planned','Completed']);
  await page.getByRole('button',{name:'Featured',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('#project-list article:not([hidden])').length===3);
  assert.deepEqual(await visibleProjects(),['zzz','kutodo','convoary']);
  assert.equal(new URL(page.url()).searchParams.get('filter'),'featured');
  await page.reload();await page.locator('[data-filters-ready]').waitFor();
  await page.waitForFunction(()=>document.querySelector('.project-filters button[aria-pressed="true"]').textContent==='Featured');
  assert.deepEqual(await visibleProjects(),['zzz','kutodo','convoary']);
  await page.getByRole('button',{name:'Completed',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.project-filters button[aria-pressed="true"]').textContent==='Completed');
  assert.deepEqual(await visibleProjects(),['zzz','smart-parking','review-analyzer','ct','kuroom','convoary']);
  await page.getByRole('button',{name:'Planned',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.project-filters button[aria-pressed="true"]').textContent==='Planned');
  assert.deepEqual(await visibleProjects(),['baljucall','kvcompact']);
  await page.getByRole('button',{name:'In Progress',exact:true}).focus();await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.project-filters button[aria-pressed="true"]').textContent==='In Progress');
  assert.deepEqual(await visibleProjects(),['kutodo','spool']);
  await page.locator('#language-toggle').click();
  await page.locator('.language-nav a[lang="ko"]').click();await page.waitForURL('**/ko/projects/?filter=active');
  await page.waitForFunction(()=>document.querySelector('.project-filters button[aria-pressed="true"]').textContent==='In Progress');
  assert.deepEqual(await visibleProjects(),['kutodo','spool']);
  assert.equal(await page.locator('html').getAttribute('lang'),'ko');
  pass('All/Featured/In Progress/Planned/Completed filters, keyboard activation, query persistence, refresh and EN/KO');

  const selectedRow=page.locator('#project-list article[data-project="kutodo"]');
  const selectedBounds=await selectedRow.boundingBox();
  await selectedRow.click({position:{x:selectedBounds.width-16,y:selectedBounds.height-16}});await page.waitForURL('**/ko/projects/kutodo/');
  assert.equal(await page.locator('h1').textContent(),'KUTODO');
  await page.goBack();await page.waitForURL('**/ko/projects/?filter=active');
  await page.waitForFunction(()=>document.querySelectorAll('#project-list article:not([hidden])').length===2);
  await page.goForward();await page.waitForURL('**/ko/projects/kutodo/');
  await page.reload();assert.equal(await page.locator('[data-project-body]').count(),1);
  pass('Native document Back/Forward, deep-link entry and refresh preserve the project/locale context');

  for(const prefix of ['', 'ko/'])for(const slug of expected){
    await goto('/'+prefix+'projects/'+slug+'/');
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('[data-project-body]').count(),1);
    assert.equal(await page.locator('astro-island,template,.explorer-window,main canvas').count(),0);
    assert.equal(await page.title(),'GIRIBUIN');
    assert.equal(await page.locator('.detail-links,main video,main a[href$=".mp4"]').count(),0);
    assert.ok(await page.locator('.project-links a').evaluateAll(items=>items.every(el=>!!el.getAttribute('aria-label') && !!el.getAttribute('title') && !!el.querySelector('svg') && !el.textContent.trim())));
    const content=await page.locator('[data-project-body]').innerText();
    await goto('/'+prefix+'work/'+slug+'/');
    assert.equal(await page.locator('[data-project-body]').innerText(),content,'Legacy URL preserves the exact document');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://giribuin.github.io/'+prefix+'projects/'+slug+'/');
  }
  pass('All localized detail documents and legacy /work URLs share content and canonical project URLs');

  for(const width of [390,1280]){
    await page.setViewportSize({width,height:844});await goto('/projects/zzz/');
    assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
    assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).colorScheme),'light');
    await page.evaluate(()=>scrollTo(0,600));
    await page.waitForFunction(()=>document.querySelector('.site-header').hasAttribute('data-scroll-hidden'));
    assert.ok(await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().bottom<=1));
    await page.evaluate(()=>scrollTo(0,440));
    await page.waitForFunction(()=>!document.querySelector('.site-header').hasAttribute('data-scroll-hidden'));
    assert.ok(await page.locator('.site-header').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<1));
    await page.evaluate(()=>scrollTo(0,680));
    await page.waitForFunction(()=>document.querySelector('.site-header').hasAttribute('data-scroll-hidden'));
    await page.locator('#language-toggle').focus();
    await page.waitForFunction(()=>!document.querySelector('.site-header').hasAttribute('data-scroll-hidden'));
    await page.keyboard.press('Enter');await page.locator('#language-panel').waitFor({state:'visible'});
    assert.ok(await page.locator('#language-panel').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=16 && r.right<=innerWidth-16 && r.top>=0 && r.bottom<=innerHeight;}));
    await page.keyboard.press('Escape');
  }
  pass('Light document theme, GIRIBUIN tab title, accessible icon actions and scroll-direction header with keyboard recovery');

  for(const width of [360,390,412,430,768,1280,1440]){
    await page.setViewportSize({width,height:844});
    for(const path of ['/ko/','/ko/projects/','/ko/about/','/ko/projects/zzz/','/ko/projects/convoary/','/ko/projects/kutodo/']){
      await goto(path);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow at '+width+path);
      assert.ok(await page.locator('.video-wrapper > iframe,.video-wrapper > video').evaluateAll(items=>items.every(el=>{
        const r=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.width<=p.width+1 && Math.abs(r.width/r.height-16/9)<.02;
      })),'Responsive 16:9 media at '+width+path);
      assert.ok(await page.locator('.site-header a').evaluateAll(items=>items.every(el=>el.getBoundingClientRect().right<=innerWidth)));
      if(path==='/ko/projects/'){
        await page.locator('[data-filters-ready]').waitFor();
        const filter=page.getByRole('button',{name:'Featured',exact:true});
        await filter.click();await page.waitForFunction(()=>document.querySelectorAll('#project-list article:not([hidden])').length===3);
        assert.ok(await filter.evaluate(el=>el.getBoundingClientRect().height>=44));
      }
      if((width===390||width===1440)&&['/ko/','/ko/projects/','/ko/about/','/ko/projects/zzz/'].includes(path))await page.screenshot({path:join(out,'v3-'+(path==='/ko/'?'home':path.split('/').filter(Boolean).slice(1).join('-'))+'-'+width+'.png'),fullPage:true});
    }
  }
  pass('360/390/412/430/768/1280/1440px typography/navigation/filters and media bounds; no page overflow');

  await page.setViewportSize({width:390,height:844});await goto('/ko/projects/zzz/');
  const expand=page.locator('.diagram-expand').first();await expand.click();await page.locator('.diagram-viewer[open]').waitFor();
  assert.ok(await page.locator('.diagram-viewer svg').evaluate(el=>Math.abs(el.getBoundingClientRect().width-el.viewBox.baseVal.width)<1));
  assert.ok(await page.locator('.diagram-viewer svg text').evaluateAll(items=>items.every(el=>parseFloat(getComputedStyle(el).fontSize)>=14)));
  await page.keyboard.press('Escape');await page.locator('.diagram-viewer').waitFor({state:'hidden'});
  await page.locator('.project-diagram svg').first().waitFor({state:'attached'});
  assert.equal(await expand.evaluate(el=>document.activeElement===el),true);
  assert.equal(new URL(page.url()).pathname,'/ko/projects/zzz/');
  await goto('/ko/about/');
  assert.equal(await page.locator('a[href="/files/resume-public.pdf"]').count(),1);
  assert.equal(await page.locator('a[href="/files/portfolio.pdf"]').count(),1);
  for(const path of ['/files/resume-public.pdf','/files/portfolio.pdf']){
    const response=await page.request.get(site.base+path);assert.equal((await response.body()).subarray(0,4).toString(),'%PDF');
  }
  assert.equal(await page.locator('#contact a[href^="mailto:"]').getAttribute('href'),'mailto:giribuin@gmail.com');
  pass('Readable diagram expansion/ESC/focus return and valid existing PDF/contact assets');

  await page.route('**/*.webp',route=>route.abort());
  await goto('/ko/projects/kutodo/');await page.locator('.media-error').waitFor();
  assert.equal(await page.locator('[data-project-body]').isVisible(),true);
  assert.ok(await page.locator('.project-links a').count()>0);
  await page.unroute('**/*.webp');
  pass('Failed project image keeps the document readable and the original links available');

  for(const prefix of ['', 'ko/']){
    await goto('/'+prefix+'#projects/convoary/details');await page.waitForURL('**/'+prefix+'projects/convoary/');
    await goto('/'+prefix+'#about');await page.waitForURL('**/'+prefix+'about/');
    await page.goto(site.base+'/'+prefix+'contact/');await page.waitForURL('**/'+prefix+'about/#contact');
  }
  const noJs=await site.browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:844}});
  const plain=await noJs.newPage();await plain.goto(site.base+'/projects/');
  assert.equal(await plain.locator('#project-list article:visible').count(),10);
  const plainRow=plain.locator('#project-list article').first(),plainBounds=await plainRow.boundingBox();
  await plainRow.click({position:{x:plainBounds.width-16,y:plainBounds.height-16}});await plain.waitForURL('**/projects/zzz/');
  assert.ok(await plain.locator('[data-project-body]').innerText());await noJs.close();
  pass('Legacy hash bookmarks resolve to real pages; archive and detail remain readable without JavaScript');

  const fixture=await openSite(JSON.parse(readFileSync(join(out,'content-results.json'),'utf8')).fixtureDist);
  try{
    await page.goto(fixture.base+'/projects/');await page.locator('[data-filters-ready]').waitFor();
    assert.equal(await page.getByRole('button',{name:'Guided',exact:true}).count(),0);
    assert.equal(await page.getByRole('button',{name:'Planned',exact:true}).count(),1);
    await page.getByRole('button',{name:'Planned',exact:true}).click();
    await page.waitForFunction(()=>document.querySelectorAll('#project-list article:not([hidden])').length===2);
    assert.deepEqual(await visibleProjects(),['baljucall','kvcompact']);
  }finally{await fixture.close();}
  pass('Planning filter appears only with a matching lifecycle status; origin does not create status filters');
  const regional=await connect({viewport:{width:360,height:844},locale:'ko-KR'});
  const local=await regional.newPage();local.on('pageerror',e=>errors.push(e.message));
  await local.goto(site.base+'/');await local.waitForURL('**/ko/');
  assert.equal(await local.locator('html').getAttribute('lang'),'ko');
  assert.equal(await local.locator('#language-panel').isVisible(),false);
  await local.locator('#language-toggle').focus();await local.keyboard.press('Enter');
  await local.locator('#language-panel').waitFor({state:'visible'});
  assert.ok(await local.locator('#language-panel').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=16 && r.right<=innerWidth-16 && r.top>=0 && r.bottom<=innerHeight;}));
  assert.equal(await local.locator('#language-toggle').getAttribute('aria-expanded'),'true');
  await local.keyboard.press('Escape');await local.locator('#language-panel').waitFor({state:'hidden'});
  assert.equal(await local.locator('#language-toggle').evaluate(el=>el===document.activeElement),true);
  for(const width of [360,1280]){
    await local.setViewportSize({width,height:844});
    const placement=await local.evaluate(async()=>{
      const panel=document.querySelector('#language-panel'),trigger=document.querySelector('#language-toggle');
      trigger.click();
      const positionedBeforePaint=panel.dataset.positioned==='true' && Number.isFinite(parseFloat(panel.style.left));
      const positions=[];
      for(let i=0;i<4;i++){await new Promise(resolve=>requestAnimationFrame(resolve));const r=panel.getBoundingClientRect();positions.push({left:r.left,right:r.right,visibility:getComputedStyle(panel).visibility});}
      return {positionedBeforePaint,positions,anchorRight:trigger.getBoundingClientRect().right};
    });
    assert.ok(placement.positionedBeforePaint,'Popover coordinates are ready synchronously before its first visible frame');
    assert.ok(placement.positions.every(p=>p.visibility==='visible' && Math.abs(p.left-placement.positions[0].left)<1 && Math.abs(p.right-placement.anchorRight)<1),'Popover does not jump horizontally after opening at '+width);
    await local.keyboard.press('Escape');
  }
  await local.setViewportSize({width:360,height:844});
  await local.locator('#language-toggle').click();
  // Click the viewport gutter, guaranteed outside the popover's 16px inset.
  await local.mouse.click(8,Math.round(local.viewportSize().height/2));
  await local.locator('#language-panel').waitFor({state:'hidden'});
  await local.locator('#language-toggle').click();await local.locator('#language-panel a[lang="en"]').click();
  await local.waitForURL(site.base+'/');assert.equal(await local.locator('html').getAttribute('lang'),'en');
  await local.reload();assert.equal(await local.locator('html').getAttribute('lang'),'en','Manual selection overrides Korean browser locale');
  await local.goto(site.base+'/ko/projects/zzz/');assert.equal(await local.locator('html').getAttribute('lang'),'ko','Explicit localized deep links override saved preference');
  for(const path of ['/','/projects/','/about/']){
    await local.goto(site.base+path);
    assert.equal(await local.locator('.site-header .brand img').count(),1);
    assert.equal(await local.locator('.site-header .brand').innerText(),'');
    assert.deepEqual(await local.locator('.primary-nav a').allTextContents(),['Home','Projects','About']);
    assert.ok(await local.locator('.home-links a,.site-footer a,#contact a').evaluateAll(items=>items.every(el=>!!el.getAttribute('aria-label') && !!el.querySelector('svg'))));
    assert.ok(await local.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    assert.equal(await local.locator('.site-footer .icon-link').count(),4);
    if(path==='/projects/'){
      assert.equal(await local.locator('.project-row img').count(),0);
    }
    if(path==='/about/'){
      assert.match(await local.locator('.school-name img').getAttribute('src'),/^\/_astro\/konkuk\..*\.webp$/);
      assert.ok(await local.locator('.about-photo').evaluate(el=>el.getBoundingClientRect().width>=230));
      for(const title of ['Contact','Documents','Education'])assert.equal(await local.getByRole('heading',{name:title,exact:true}).count(),1);
    }
  }
  await regional.close();
  pass('Text-only project rows, favicon/text navigation, larger portrait/school logo, contact icons and accessible locale preference popover');
  assert.deepEqual(errors,[]);
  assert.ok(!requests.some(url=>/\.mp4(?:[?#]|$)/.test(url)),'No page requests redundant MP4 media');
  assert.ok(!requests.some(url=>/\/(?:client|react)\.[\w-]+\.js(?:$|\?)/.test(url)),'No visited page downloads React hydration runtime');
  writeFileSync(join(out,'browser-results.json'),JSON.stringify({passed,viewports:[360,390,412,430,768,1280,1440],errors},null,2));
  console.log(passed.length+' browser groups passed.');
}finally{await site.close();}
