// Run after npm test: exercises the interactive island and existing static routes.
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { openSite } from './browser-harness.mjs';
const out=resolve('.verification'); mkdirSync(out,{recursive:true});
const site=await openSite(); const passed=[]; const errors=[];
const pass=name=>{passed.push(name);console.log('PASS '+name);};
try {
  const context=await site.browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const requests=[];page.on('request',r=>requests.push(new URL(r.url()).pathname));
  const goto=async path=>{await page.goto(site.base+path);await page.evaluate(()=>document.fonts.ready);if(!path.includes('/work/')&&!path.includes('/projects/'))await page.waitForSelector('[data-explorer-ready]');};
  const hash=async value=>page.waitForFunction(value=>location.hash===value,value);
  const open=async name=>{await page.locator('[data-menu="'+name+'"]').click();await hash('#'+name);await page.locator('.explorer-window').waitFor({state:'visible'});};
  const close=async()=>{await page.locator('.window-close').click();await hash('');await page.locator('.explorer-window').waitFor({state:'hidden'});};
  const select=async slug=>{await page.locator('[data-collection-project="'+slug+'"]').click();await hash('#projects/'+slug);await page.locator('.project-description').waitFor();};
  const details=async slug=>{await page.locator('[data-project-action="details"]').click();await hash('#projects/'+slug+'/details');await page.locator('.detail-window-content .detail-page').waitFor();};
  const escape=async value=>{await page.keyboard.press('Escape');await hash(value);};
  const settledWindowFocus=async()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const language=async code=>{await page.locator('#settings-toggle').click();await page.locator('#settings-panel').waitFor({state:'visible'});await page.locator('#settings-panel [data-locale="'+code+'"]').click();await page.waitForFunction(code=>document.documentElement.lang===code,code);await page.keyboard.press('Escape');await page.locator('#settings-panel').waitFor({state:'hidden'});};
  await goto('/');
  assert.equal(await page.locator('astro-island').count(),2,'Menu UI and the independent character scene are separate islands');
  assert.equal(await page.locator('.title-menu a').count(),4);
  assert.equal(await page.locator('.menu-arrow').count(),0);
  assert.deepEqual(await page.locator('.title-menu a').allTextContents(),['PROJECTS','ABOUT','RESUME','CONTACT']);
  assert.ok(await page.locator('.menu-choice').evaluateAll(items=>items.every(el=>{const css=getComputedStyle(el);return css.borderTopWidth==='3px' && css.backgroundColor!=='rgba(0, 0, 0, 0)';})),'Home menu entries use the shared physical game button frame');
  assert.equal(await page.locator('.scene-landscape,.hero-scene,.title-screen-role,.title-screen-intro').count(),0);
  await page.waitForFunction(()=>document.querySelector('[data-pet-scene]')?.dataset.sceneState==='ready');
  assert.equal(await page.locator('.visual-scene canvas').count(),1);
  assert.equal(await page.locator('[data-pet-scene]').getAttribute('data-look-mode'),'head');
  assert.ok(await page.locator('.visual-scene').evaluate(el=>{const r=el.getBoundingClientRect(),body=document.body.getBoundingClientRect();return Math.abs((r.left+r.right-body.left-body.right)/2)<=1;}),'The character scene is centered');
  assert.equal(await page.locator('.header .header-brand span,.scene-hint,.title-screen-copy').count(),0);
  assert.equal(await page.locator('.explorer-window').evaluate(el=>el.open),false);
  assert.equal(requests.filter(p=>p.endsWith('.mp4')).length,0,'No project videos requested by the title screen');
  await page.screenshot({path:join(out,'window-main.png')});
  pass('independent R3F pet scene with head pivot, split Hero, four menu entries and no initial project video fetch');

  const settings=page.locator('#settings-toggle'),settingsPanel=page.locator('#settings-panel');
  assert.equal(await page.locator('.header .language-switch').count(),0);
  assert.ok(await page.locator('.menu-home .header').evaluate(el=>{const css=getComputedStyle(el);return css.backgroundColor==='rgba(0, 0, 0, 0)' && css.borderBottomWidth==='0px';}),'Home has independent HUD controls without a header bar');
  assert.equal(await settings.getAttribute('aria-controls'),'settings-panel');
  assert.equal(await settings.getAttribute('aria-expanded'),'false');
  await settings.focus();await page.keyboard.press('Enter');await settingsPanel.waitFor({state:'visible'});
  await page.waitForFunction(()=>document.activeElement?.getAttribute('data-locale')==='en');
  assert.equal(await settings.getAttribute('aria-expanded'),'true');
  assert.equal(await settingsPanel.locator('[data-locale]').count(),2);
  assert.equal(await settingsPanel.locator('.settings-group').count(),1,'Only real Language controls are shown');
  await page.keyboard.press('Shift+Tab');assert.equal(await page.locator(':focus').getAttribute('data-locale'),'ko');
  await page.keyboard.press('Escape');await settingsPanel.waitFor({state:'hidden'});
  assert.equal(await page.locator(':focus').getAttribute('id'),'settings-toggle');
  await settings.click();await settingsPanel.waitFor({state:'visible'});await page.locator('#hero').click({position:{x:10,y:120}});await settingsPanel.waitFor({state:'hidden'});
  await language('ko');assert.equal(new URL(page.url()).hash,'');await language('en');
  await page.locator('[data-menu="projects"]').click();await hash('#projects');
  await settings.click();await settingsPanel.waitFor({state:'visible'});await page.keyboard.press('Escape');await settingsPanel.waitFor({state:'hidden'});
  assert.equal(new URL(page.url()).hash,'#projects','Escape closes Settings before the underlying project window');
  await escape('');await page.locator('.explorer-window').waitFor({state:'hidden'});
  pass('floating Settings replaces header language UI; native popover keyboard/focus/outside dismissal, existing locale logic, Escape priority');

  for(const state of ['projects','projects/kuroom','projects/kuroom/details','about','resume','contact']) {
    await goto('/#'+state);await page.waitForSelector('.explorer-window[open]');
    await page.locator('#explorer-title').click();assert.equal(new URL(page.url()).hash,'#'+state,'Inside clicks keep the window open');
    await page.locator('.window-backdrop').click({position:{x:4,y:400}});await hash('');await page.locator('.explorer-window').waitFor({state:'hidden'});
    await page.waitForFunction(()=>document.activeElement?.matches('.menu-choice'));
  }
  await open('projects');await settings.click();await settingsPanel.waitFor({state:'visible'});
  await page.locator('.window-backdrop').click({position:{x:4,y:400}});await settingsPanel.waitFor({state:'hidden'});
  assert.equal(new URL(page.url()).hash,'#projects','An outside click dismisses Settings alone first');
  const titleBox=await page.locator('#explorer-title').boundingBox();await page.mouse.move(titleBox.x+20,titleBox.y+20);await page.mouse.down();await page.mouse.move(4,400,{steps:5});await page.mouse.up();
  assert.equal(new URL(page.url()).hash,'#projects','Dragging from inside to outside does not dismiss');
  await page.locator('.window-backdrop').click({position:{x:4,y:400}});await hash('');await page.locator('.explorer-window').waitFor({state:'hidden'});
  pass('outside click closes every window to Home with focus restored; inside clicks/drags and Settings dismissal are isolated');

  await open('projects');
  const expected=['zzz','smart-parking','review-analyzer','ct','kuroom','kutodo','baljucall','convoary'];
  assert.deepEqual(await page.locator('[data-collection-project]').evaluateAll(a=>a.map(x=>x.dataset.collectionProject)),expected);
  assert.equal(await page.locator('.collection-entry').count(),8);
  assert.equal(await page.locator('.project-browser,.project-description,.collection-panel [aria-current]').count(),0);
  assert.ok(await page.locator('.collection-panel video').evaluateAll(a=>a.every(v=>v.paused)));
  const originalWindow=await page.locator('.explorer-window').elementHandle();
  await page.screenshot({path:join(out,'window-list.png')});
  await select('convoary');
  assert.equal(await originalWindow.evaluate(el=>el===document.querySelector('.explorer-window')&&el.open),true);
  assert.equal(await page.locator('.project-name-list a').count(),8);
  assert.equal(await page.locator('.project-name-list img,.project-name-list video,.project-name-list svg').count(),0);
  assert.equal(await page.locator('.explorer-left .explorer-media').count(),1);
  assert.equal(await page.locator('[data-collection-project="convoary"]').getAttribute('aria-current'),'true');
  await page.screenshot({path:join(out,'window-split.png')});
  await page.locator('.window-previous').click();await hash('#projects');await page.locator('.collection-grid').waitFor();
  await page.waitForFunction(()=>document.activeElement?.dataset.collectionProject==='convoary');
  await select('convoary');
  await escape('#projects');await page.locator('.collection-grid').waitFor();
  assert.equal(await page.locator('.project-browser,.project-description,.collection-panel [aria-current]').count(),0);
  await escape('');await page.locator('.explorer-window').waitFor({state:'hidden'});
  await open('projects');assert.equal(await page.locator('.collection-entry').count(),8);
  assert.equal(await page.locator('.project-description').count(),0,'Reopening must not select the previously viewed project');
  await page.locator('.header .header-brand').click();await hash('');await page.locator('.explorer-window').waitFor({state:'hidden'});await open('projects');
  pass('Home → Projects unselected grid → Convoary split → ESC grid → ESC Home; reopening stays unselected; favicon closes to Home');
  await select('kuroom');
  assert.equal(await page.locator('[data-preview-heading]').textContent(),'KUROOM');
  await page.waitForFunction(()=>document.activeElement?.hasAttribute('data-preview-heading'));
  assert.ok(await page.locator('.preview-facts').textContent());
  assert.equal(await page.locator('.preview-heading-bar [data-project-action="details"]').getAttribute('href'),'/work/kuroom/');
  assert.equal(await page.locator('[data-project-action="demo"]').count(),0,'Do not invent a demo URL');
  assert.equal(await page.locator('.project-action-footer [data-project-action="details"]').count(),0);
  assert.ok(await page.locator('[data-project-action]').evaluateAll(links=>links.every(link=>link.querySelector('svg') && link.getAttribute('aria-label') && link.getAttribute('title') && !link.textContent.trim())),'Every project action is an accessible icon link');
  await page.screenshot({path:join(out,'menu-preview.png')});
  await details('kuroom');
  const independent=await (await page.request.get(site.base+'/work/kuroom/')).text();
  const same=await page.locator('.detail-window-content .detail-prose').evaluate((el,html)=>el.textContent===new DOMParser().parseFromString(html,'text/html').querySelector('.detail-prose').textContent,independent);
  assert.ok(same,'Overlay must use the existing Astro-rendered document');
  assert.equal(await page.locator('.standalone-link').getAttribute('href'),'/work/kuroom/');
  assert.equal(await page.locator('.detail-window-content .detail-page > :is(.detail-intro,h1,.detail-summary,.tech,.project-actions,.eyebrow,.back-link)').count(),0,'Details omits the standalone introduction and duplicate actions');
  assert.ok(await page.evaluate(html=>{const doc=new DOMParser().parseFromString(html,'text/html');return Boolean(doc.querySelector('.project-hud-title h1') && doc.querySelector('.project-info-summary') && doc.querySelector('.project-info-tech') && doc.querySelector('#project-info .project-toolbar-actions') && !doc.querySelector('.detail-intro,.standalone-actions'));},independent),'Standalone page keeps information and shared action icons inside the popover');
  assert.equal(await page.locator('.detail-window-content .project-action-footer [data-project-action="standalone"]').count(),1);
  assert.ok(await page.locator('.detail-window-content .project-action-footer a').evaluateAll(links=>links.every(link=>link.querySelector('svg') && link.getAttribute('aria-label') && link.getAttribute('title') && !link.textContent.trim())));
  await page.locator('.window-body').evaluate(el=>el.scrollTop=900);
  assert.ok(await page.locator('.detail-window-content .project-action-footer').evaluate(el=>{const footer=el.getBoundingClientRect(),body=el.closest('.window-body').getBoundingClientRect();return Math.abs(footer.bottom-body.bottom)<=1 && footer.top>=body.top;}),'Details footer remains visible during document scrolling');
  await page.locator('.window-body').evaluate(el=>el.scrollTop=0);
  await page.screenshot({path:join(out,'menu-detail.png')});
  await page.locator('.window-previous').click();await hash('#projects/kuroom');await details('kuroom');
  pass('collection order, single-click preview, real metadata/links and identical standalone/overlay content');
  await escape('#projects/kuroom'); await escape('#projects');
  await page.waitForFunction(()=>document.activeElement?.dataset.collectionProject==='kuroom');
  await escape('');
  await page.waitForFunction(()=>document.activeElement?.dataset.menu==='projects');
  pass('ESC detail → preview → list → main, selection focus and menu focus restored');

  await goto('/projects/');await goto('/');
  const pageHistoryLength=await page.evaluate(()=>history.length);
  for(const menu of ['resume','about','contact']){await open(menu);await close();}
  await open('projects');await select('zzz');await select('kuroom');await details('kuroom');
  assert.equal(await page.evaluate(()=>history.length),pageHistoryLength,'Menu/selection/Details/close replace the current URL without appending visits');
  await page.locator('.standalone-link').click();await page.waitForURL(site.base+'/work/kuroom/');
  assert.equal(await page.evaluate(()=>history.length),pageHistoryLength+1,'Only the standalone document adds a history entry');
  await page.goBack();await page.waitForURL(site.base+'/');await page.locator('[data-explorer-ready]').waitFor();
  assert.equal(await page.locator('.explorer-window').evaluate(el=>el.open),false,'Back returns to clean Home rather than the former Details window');
  await page.goForward();await page.waitForURL(site.base+'/work/kuroom/');
  await page.goBack();await page.waitForURL(site.base+'/');await page.goBack();await page.waitForURL(site.base+'/projects/');
  await goto('/#projects/kuroom');await page.locator('.project-description').waitFor();
  await page.reload();await page.waitForSelector('.project-description');
  assert.equal(await page.locator('[data-preview-heading]').textContent(),'KUROOM');
  await escape('#projects');await escape('');
  await goto('/#projects/zzz/details');await page.locator('.detail-window-content .detail-page').waitFor();await close();
  await goto('/#projects/not-a-project');await page.locator('.collection-panel').waitFor({state:'visible'});assert.equal(await page.locator('.collection-panel [aria-current],.project-description').count(),0);await close();
  for(const [legacy,title] of [['work','Projects'],['tools','Projects'],['background','About'],['education','About'],['skills','About'],['process','About']]){await goto('/#'+legacy);await page.locator('.explorer-window').waitFor({state:'visible'});assert.equal(await page.locator('#explorer-title').textContent(),title);await close();}
  pass('document-only Back/Forward history, clean Home return, no Resume/menu/selection entries, direct preview/detail, refresh and legacy hashes');

  await open('about');
  assert.equal(await page.locator('.profile-panel .profile-photo').isVisible(),true);
  assert.equal(await page.locator('#background-heading').textContent(),'Education');
  await page.waitForFunction(()=>{const image=document.querySelector('#background img');return image?.complete && image.naturalWidth>0;});
  assert.deepEqual(await page.locator('#profile-page-overview .core-skills li > span').allTextContents(),['Java','Python','Go','SQL','Linux','Docker','Git']);
  const aboutHistoryLength=await page.evaluate(()=>history.length);
  assert.equal(await page.locator('.profile-tab').count(),2);
  assert.equal(await page.locator('.profile-page:not([hidden])').getAttribute('data-profile-page'),'overview');
  assert.equal(await page.locator('[data-profile-tab="skills"],#profile-page-skills').count(),0);
  assert.equal(await page.locator('#profile-page-overview .core-skills li:visible').count(),7);
  await page.locator('[data-profile-tab="overview"]').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[role="tab"][aria-selected="true"]').getAttribute('data-profile-tab'),'approach');
  await page.keyboard.press('Home');
  assert.equal(await page.locator('[role="tab"][aria-selected="true"]').getAttribute('data-profile-tab'),'overview');
  const tabsY=await page.locator('.profile-tabs').evaluate(el=>el.getBoundingClientRect().top);
  await page.locator('.profile-pages').evaluate(el=>el.scrollTop=el.scrollHeight);
  assert.equal(await page.locator('.profile-tabs').evaluate(el=>el.getBoundingClientRect().top),tabsY,'Profile tabs stay visible while their content scrolls');
  assert.equal(await page.locator('.window-body').evaluate(el=>el.scrollTop),0);
  assert.equal(await page.locator('.profile-panel .profile-documents,.profile-panel .about-role,.profile-panel .profile-facts').count(),0);
  assert.equal(await page.locator('#background time').textContent(),'2027.02');
  assert.equal(await page.evaluate(()=>history.length),aboutHistoryLength);
  await page.locator('[data-profile-tab="approach"]').click();
  assert.equal(await page.locator('#process > .section-intro').count(),0);
  assert.equal(await page.locator('.principle-trigger').first().evaluate(el=>getComputedStyle(el,'::before').content),'""');
  const trigger=page.locator('button[data-principle="understand"]');await trigger.click();
  assert.equal(await page.locator('#build-dialog').evaluate(el=>el.open),true);
  assert.equal(await page.locator('#build-dialog .header-brand,#build-dialog img,#build-dialog [data-evidence],#build-dialog [data-i18n="process.evidence"]').count(),0);
  assert.equal(await page.locator('#build-dialog article:not([hidden]) .principle-detail').count(),2);
  assert.ok(await page.locator('#build-dialog article:not([hidden])').evaluate(el=>{
    const why=el.querySelector('.principle-detail-why'),how=el.querySelector('.principle-detail-how');
    return !el.querySelector('dt svg') && getComputedStyle(why).borderLeftWidth==='0px' && getComputedStyle(how).borderLeftWidth==='0px'
      && getComputedStyle(why).backgroundColor===getComputedStyle(how).backgroundColor
      && getComputedStyle(why.querySelector('dt')).color===getComputedStyle(how.querySelector('dt')).color;
  }));
  await page.locator('.build-dialog-close').click();
  await page.waitForFunction(()=>!document.querySelector('#build-dialog').open);
  assert.equal(await page.locator(':focus').getAttribute('data-principle'),'understand');
  await trigger.click();
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#build-dialog').open);
  assert.equal(await page.locator('.explorer-window').evaluate(el=>el.open),true);
  assert.equal(await page.locator(':focus').getAttribute('data-principle'),'understand');
  await page.locator('[data-profile-tab="overview"]').click();
  const koreanBiography='낯선 문제를 만나면 먼저 직접 실행해 보고, 흐름을 확인한 뒤 필요한 만큼 깊게 파고드는 편입니다. 기능을 만드는 데서 끝내기보다 실제로 어떻게 동작하고 어디에서 실패할 수 있는지 확인하려고 합니다. AI는 탐색과 반복의 속도를 높이는 도구로 적극 활용하지만, 설계와 판단, 검증은 직접 책임지는 개발자가 되고자 합니다.';
  await language('ko');assert.equal(await page.locator('.profile-panel .about-bio').innerText(),koreanBiography);
  assert.equal(await page.locator('#profile-name').textContent(),'최정길');
  assert.equal(await page.locator('#background .education-program').textContent(),'건국대학교 컴퓨터공학부');
  await language('en');assert.match(await page.locator('.profile-panel .about-bio').innerText(),/^When I encounter an unfamiliar problem/);
  await language('ko');assert.equal(await page.locator('.profile-panel .about-bio').innerText(),koreanBiography);
  assert.equal(await page.locator('#settings-panel .language-switch [aria-pressed="true"]').textContent(),'한국어');
  await page.locator('.window-body').evaluate(el=>el.scrollTop=0);
  await page.screenshot({path:join(out,'window-about.png')});await close();
  await open('projects');await select('zzz');
  assert.match(await page.locator('.preview-description').textContent(),/환경/);
  await details('zzz');await page.waitForFunction(()=>document.querySelector('.detail-window-content [data-project-body]')?.lang==='ko');
  await language('en');await page.waitForFunction(()=>document.querySelector('.detail-window-content [data-project-body]')?.lang==='en');
  assert.equal(new URL(page.url()).hash,'#projects/zzz/details');await close();
  pass('static About/education/skills/principles reused, nested dialog Escape, live EN/KO in all windows');

  for(const width of [1440,360]) {
    const reader=await context.newPage();await reader.setViewportSize({width,height:844});
    reader.on('pageerror',e=>errors.push(e.message));
    let release,requested;const gate=new Promise(resolve=>release=resolve),started=new Promise(resolve=>requested=resolve);
    await reader.route(site.base+'/work/zzz/',async route=>{requested();await gate;await route.continue();});
    try {
      await reader.goto(site.base+'/ko/#projects/zzz/details');await reader.waitForSelector('.detail-window-content .detail-page');
      const pane=reader.locator('.window-body');
      const before=await pane.evaluate(el=>{el.scrollTop=1200;return el.scrollTop;});assert.ok(before>1000);
      await reader.locator('#settings-toggle').click();await reader.locator('#settings-panel [data-locale="en"]').click();await started;
      assert.equal(await reader.locator('.detail-window-content .detail-page').count(),1,'Keep the previous document visible during translation fetch');
      assert.equal(await pane.evaluate(el=>el.scrollTop),before,'Pending translation must not collapse the scroll area');
      const latest=await pane.evaluate(el=>{el.scrollTop+=200;return el.scrollTop;});
      release();await reader.waitForFunction(()=>document.querySelector('.detail-window-content [data-project-body]')?.lang==='en');
      assert.ok(Math.abs(await pane.evaluate(el=>el.scrollTop)-latest)<=1,'Respect scrolling that happened while fetching');
      const nearEnd=await pane.evaluate(el=>{el.scrollTop=el.scrollHeight-el.clientHeight-12;return el.scrollTop;});
      for(const code of ['ko','en']) {
        await reader.locator('#settings-panel [data-locale="'+code+'"]').click();
        await reader.waitForFunction(code=>document.querySelector('.detail-window-content [data-project-body]')?.lang===code,code);
        assert.ok(Math.abs(await pane.evaluate(el=>el.scrollTop)-nearEnd)<=1,'Cached locale swap preserves deep scroll at '+width+'/'+code);
      }
      assert.equal(new URL(reader.url()).hash,'#projects/zzz/details');
      assert.equal(await reader.evaluate(()=>performance.getEntriesByType('navigation').length),1);
    } finally {release();await reader.close();}
  }
  pass('1440/360px detail locale swaps retain content and scroll during delayed fetch, cached swaps and near-bottom reading');

  await open('resume');
  assert.equal(await page.locator('.documents-panel .document-action').count(),2);
  for(const url of ['/files/resume-public.pdf','/files/portfolio.pdf']){const response=await page.request.get(site.base+url);assert.equal((await response.body()).subarray(0,4).toString(),'%PDF');}
  await close();await open('contact');
  assert.equal(await page.locator('.contact-panel a[href^="mailto:"]').getAttribute('href'),'mailto:giribuin@gmail.com');
  assert.equal(await page.locator('.contact-panel a[target="_blank"]').count(),3);
  await page.waitForFunction(()=>document.activeElement?.id==='explorer-title');
  await settledWindowFocus();
  const last=page.locator('.contact-panel a').last();await page.keyboard.press('Tab');await last.focus();await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('class'),'header-brand');
  await page.keyboard.press('Shift+Tab');assert.equal(await page.locator(':focus').getAttribute('href'),await last.getAttribute('href'));
  assert.equal(await page.locator(':focus').evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
  await close();await page.locator('[data-menu="projects"]').focus();await page.keyboard.press('Enter');await hash('#projects');
  await settledWindowFocus();
  await page.waitForFunction(()=>document.activeElement?.id==='explorer-title'||document.activeElement?.hasAttribute('data-collection-project'));
  await page.locator('[data-collection-project="ct"]').focus();await page.keyboard.press('Enter');await hash('#projects/ct');await close();
  pass('real PDF documents/contact URLs, keyboard activation, focus-visible and window/header focus cycle');

  for(const width of [1440,1280,768,390,360]){
    await page.setViewportSize({width,height:width>700?900:844});await goto('/ko/');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),'Main fits viewport at '+width);
    assert.equal(await page.locator('footer,.window-back,.window-status,.window-index,.menu-number,.document-index,.project-index,.section-index,.principle-number').count(),0);
    assert.equal(await page.locator('.header .header-brand img').getAttribute('src'),'/favicon.svg');
    await open('projects');
    assert.equal(await page.locator('.collection-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),width>1100?4:width>700?3:2);
    for(const screen of ['list','preview','detail','about','resume','contact']){
      if(screen==='preview')await select('zzz');
      if(screen==='detail')await details('zzz');
      if(['about','resume','contact'].includes(screen)){await close();await open(screen);}
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No page overflow at '+width+'/'+screen);
      assert.ok(await page.locator('.window-body').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'No panel overflow at '+width+'/'+screen);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1 && scrollY===0),'No document-level scroll at '+width+'/'+screen);
      assert.equal(await page.locator('.window-bar button').count(),['preview','detail'].includes(screen)?2:1,'Previous returns one project stage; X always remains');
      assert.ok(await page.locator('.explorer-window').evaluate(el=>{const r=el.getBoundingClientRect(),header=document.querySelector('.header').getBoundingClientRect();return r.top>header.bottom && r.left>0 && r.right<innerWidth && r.bottom<innerHeight;}),'Window is inset above the same Home');
      assert.ok(await page.locator('.window-close').evaluate(el=>{const r=el.getBoundingClientRect(),panel=el.closest('dialog').getBoundingClientRect();return r.top<panel.top && r.bottom>panel.top && r.left>0 && r.right<innerWidth && r.top>document.querySelector('.header').getBoundingClientRect().bottom;}),'Overlapping close stays visible, below the global header and inside the viewport');
      assert.ok(await page.locator('#explorer-title').evaluate(el=>{const r=el.getBoundingClientRect(),panel=el.closest('dialog').getBoundingClientRect();return r.top<panel.top && r.bottom>panel.top;}),'Title plaque overlaps the frame');
      assert.equal(await settings.isVisible(),true);
      await settings.click();await settingsPanel.waitFor({state:'visible'});
      assert.ok(await settingsPanel.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>0 && r.right<innerWidth && r.top>0 && r.bottom<innerHeight;}),'Compact Settings panel stays inside viewport');
      assert.equal(await settingsPanel.locator('[data-locale="en"]').isVisible(),true);
      assert.equal(await settingsPanel.locator('[data-locale="ko"]').isVisible(),true);
      if(width<=700)assert.ok(await settingsPanel.evaluate(el=>el.getBoundingClientRect().top>innerHeight/2),'Mobile settings uses a compact bottom panel');
      await page.keyboard.press('Escape');await settingsPanel.waitFor({state:'hidden'});
      if(screen==='preview'&&width<=700) assert.ok(await page.locator('.project-browser').evaluate(el=>{const media=el.querySelector('.explorer-media').getBoundingClientRect(),names=el.querySelector('.project-name-list').getBoundingClientRect(),description=el.querySelector('.project-description').getBoundingClientRect();return media.bottom<=names.top && names.bottom<=description.top;}));
      if(screen==='preview')assert.equal(await page.locator('.project-divider').isVisible(),width>700);
      if(screen==='contact')assert.equal(await page.locator('.contact-list').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),width>700?4:2);
      if(screen==='resume')assert.equal(await page.locator('.document-list').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),width>700?2:1);
      if(width===390&&['list','about','contact','resume'].includes(screen))await page.screenshot({path:join(out,'window-mobile-'+screen+'.png')});
    }
    await close();if(width===390)await page.screenshot({path:join(out,'window-mobile-main.png')});
  }
  pass('1440/1280/768/390/360px: game frames/plaque/overlapping close stay in viewport, responsive split/Contact/Resume, no overflow');

  await page.setViewportSize({width:1440,height:1000});await goto('/');await page.emulateMedia({reducedMotion:'no-preference'});await open('projects');
  await page.locator('.explorer-window').evaluate(el=>Promise.all(el.getAnimations().map(animation=>animation.finished)));
  assert.equal(await page.locator('.explorer-window').evaluate(el=>getComputedStyle(el).animationName),'surface-enter');
  assert.ok(await page.locator('.window-backdrop').evaluate(el=>getComputedStyle(el).backdropFilter.includes('blur')));
  const gameCard=page.locator('.collection-entry').first(),beforeHover=await gameCard.boundingBox();
  await gameCard.hover();await page.waitForFunction(top=>document.querySelector('.collection-entry').getBoundingClientRect().top<top-3,beforeHover.y);
  await settings.hover();await page.waitForFunction(()=>{const m=new DOMMatrix(getComputedStyle(document.querySelector('#settings-toggle')).transform);return Math.atan2(m.b,m.a)*180/Math.PI>10;});
  const closeButton=page.locator('.window-close');await closeButton.hover();
  await page.waitForFunction(()=>new DOMMatrix(getComputedStyle(document.querySelector('.window-close')).transform).b>0);
  await page.mouse.down();await page.waitForFunction(()=>new DOMMatrix(getComputedStyle(document.querySelector('.window-close')).transform).a<1);
  await page.mouse.up();await hash('');await page.emulateMedia({reducedMotion:'reduce'});await open('contact');
  await page.locator('.contact-action').nth(1).hover();
  assert.equal(await page.locator('.contact-action').nth(1).evaluate(el=>getComputedStyle(el).transform),'none');
  await closeButton.hover();assert.equal(await closeButton.evaluate(el=>getComputedStyle(el).transform),'none');
  await settings.hover();assert.equal(await settings.evaluate(el=>getComputedStyle(el).transform),'none');
  assert.equal(await page.locator('.explorer-window').evaluate(el=>getComputedStyle(el).animationName),'none');
  await close();
  pass('card lift, physical close hover/press/click, backdrop blur, open motion and reduced-motion controls');

  await page.setViewportSize({width:1440,height:1000});await goto('/');await open('projects');await select('zzz');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForFunction(()=>{const v=document.querySelector('.explorer-left video');return v && !v.paused && v.currentTime>.01;});
  const oldVideo=await page.locator('.explorer-left video').elementHandle();
  await select('smart-parking');await page.waitForFunction(()=>{const v=document.querySelector('.explorer-left video');return v && !v.paused && v.currentTime>.01;});
  assert.equal(await oldVideo.evaluate(el=>el.paused),true);
  assert.equal(await page.locator('.collection-panel video').count(),1);
  assert.equal(await page.locator('.collection-panel video').evaluateAll(a=>a.filter(x=>!x.paused).length),1);
  assert.match(await page.locator('.explorer-left img').getAttribute('src'),/^\/_astro\/thumbnail\..+\.webp$/);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>[...document.querySelectorAll('.collection-panel video')].every(x=>x.paused));
  await close();await page.emulateMedia({reducedMotion:'no-preference'});
  const mediaContext=await site.browser.newContext({viewport:{width:1440,height:900}});await mediaContext.route('**/*.mp4',r=>r.abort());const failed=await mediaContext.newPage();failed.on('pageerror',e=>errors.push(e.message));
  await failed.goto(site.base+'/#projects/zzz');await failed.waitForSelector('.explorer-window[open]');await failed.waitForTimeout(400);
  assert.equal(await failed.locator('.explorer-left img').isVisible(),true);
  await failed.locator('[data-collection-project="smart-parking"]').click();await failed.waitForFunction(()=>location.hash==='#projects/smart-parking');assert.equal(await failed.locator('.explorer-left img').isVisible(),true);await mediaContext.close();
  const touch=await site.browser.newContext({viewport:{width:360,height:844},isMobile:true,hasTouch:true});const mobile=await touch.newPage();mobile.on('pageerror',e=>errors.push(e.message));
  await mobile.goto(site.base+'/#projects');await mobile.waitForSelector('.explorer-window[open]');await mobile.locator('[data-collection-project="zzz"]').tap();await mobile.waitForFunction(()=>location.hash==='#projects/zzz');await mobile.waitForTimeout(250);
  assert.ok(await mobile.locator('video').evaluateAll(a=>a.every(x=>x.paused)));
  await mobile.locator('[data-project-action="details"]').tap();await mobile.waitForSelector('.detail-window-content .detail-page');
  await mobile.goto(site.base+'/#projects/convoary');await mobile.waitForSelector('.project-description');await mobile.keyboard.press('Escape');await mobile.waitForFunction(()=>location.hash==='#projects');await mobile.waitForFunction(()=>document.activeElement?.dataset.collectionProject==='convoary');assert.ok(await mobile.locator('[data-collection-project="convoary"]').evaluate(el=>{const r=el.getBoundingClientRect(),b=el.closest('.window-body').getBoundingClientRect();return r.top>=b.top && r.top<b.bottom;}));
  await mobile.locator('.window-backdrop').tap({position:{x:4,y:400}});await mobile.waitForFunction(()=>location.hash==='');await mobile.locator('.explorer-window').waitFor({state:'hidden'});
  await mobile.goto(site.base+'/ko/work/zzz/');await mobile.locator('[data-explorer-ready]').waitFor({state:'attached'});
  await mobile.locator('.project-info-toggle').tap();await mobile.locator('#project-info').waitFor({state:'visible'});
  await mobile.touchscreen.tap(4,400);await mobile.locator('#project-info').waitFor({state:'hidden'});
  await mobile.locator('.detail-projects').tap();await mobile.locator('.explorer-window[open]').waitFor();assert.equal(new URL(mobile.url()).pathname,'/ko/work/zzz/');
  await mobile.locator('.window-close').tap();await mobile.locator('.explorer-window').waitFor({state:'hidden'});assert.equal(new URL(mobile.url()).hash,'');await touch.close();
  await goto('/');assert.equal(await page.locator('.visual-scene').count(),1);await open('contact');assert.equal(await page.locator('.contact-panel').isVisible(),true);await close();
  for(const failure of ['model','webgl']) {
    const fallback=await context.newPage();fallback.on('pageerror',e=>errors.push(e.message));
    if(failure==='model')await fallback.route('**/models/pet.glb',route=>route.abort());
    else await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args);};});
    await fallback.goto(site.base+'/');await fallback.waitForFunction(()=>document.querySelector('[data-pet-scene]')?.dataset.sceneState==='unavailable');
    await fallback.locator('[data-menu="projects"]').click();await fallback.locator('.collection-grid').waitFor();assert.equal(await fallback.locator('.collection-entry').count(),8);
    await fallback.locator('.window-close').click();await fallback.locator('[data-menu="contact"]').click();await fallback.locator('.contact-panel').waitFor({state:'visible'});await fallback.close();
  }
  pass('selected media autoplay/switch/pause, reduced-motion/touch, failed-video poster and VisualScene independence');

  await goto('/projects/');assert.equal(await page.locator('#projects-grid > article').count(),8);
  for(const prefix of ['', 'ko/'])for(const slug of expected){await goto('/'+prefix+'work/'+slug+'/');assert.equal(await page.locator('.project-hud-title h1').count(),1);assert.equal(await page.locator('astro-island').count(),1);assert.equal(await page.locator('.header,[data-i18n="project.notes"]').count(),0);}
  assert.equal(await page.locator('.detail-home').getAttribute('href'),'/ko/');
  for(const prefix of ['', 'ko/']) {
    await goto('/'+prefix+'#projects/kuroom/details');await page.locator('.detail-window-content .detail-page').waitFor();
    await page.locator('.standalone-link').click();await page.waitForURL('**/'+prefix+'work/kuroom/');
    await page.locator('.detail-home').click();await page.waitForSelector('[data-explorer-ready]');
    assert.equal(new URL(page.url()).hash,'');assert.equal(await page.locator('.explorer-window').evaluate(el=>el.open),false);
  }
  pass('Details omits duplicate intro, shares the icon footer, keeps Previous and standalone navigation to EN/KO Home');

  for(const width of [1440,1280,768,390,360]) {
    await page.setViewportSize({width,height:844});await goto('/ko/work/zzz/');
    await page.locator('[data-explorer-ready]').waitFor({state:'attached'});
    assert.ok(await page.evaluate(()=>{const body=document.body.getBoundingClientRect();return Math.abs(body.top+scrollY)<=1 && Math.abs(body.bottom+scrollY-document.documentElement.scrollHeight)<=1;}),'Toolbar/footer margins stay inside the page without exposing strips of the root background');
    assert.equal(await page.locator('.detail-intro').count(),0);
    assert.equal(await page.locator('.project-info-summary').count(),1);
    assert.ok((await page.locator('.project-info-tech').textContent()).includes('Node.js · Express · MySQL · MQTT · AWS'));
    assert.equal(await page.locator('#project-info').isVisible(),false);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Standalone detail has no horizontal overflow at '+width);
    assert.ok(await page.locator('.project-hud-title').evaluate(el=>{const r=el.getBoundingClientRect(),body=document.body.getBoundingClientRect();return Math.abs((r.left+r.right)/2-(body.left+body.right)/2)<=1 && r.left>0 && r.right<innerWidth;}),'Project plaque stays centered and inside viewport');
    assert.ok(await page.locator('.detail-hud-links').evaluate(el=>{const r=el.getBoundingClientRect(),settings=document.querySelector('#settings-toggle').getBoundingClientRect();return r.left>0 && r.right<settings.left;}),'Home/Projects controls and Settings do not overlap');
    if(width<=700)assert.ok(await page.locator('.project-hud-title').evaluate(el=>el.getBoundingClientRect().top>document.querySelector('.detail-hud-links').getBoundingClientRect().bottom));
    assert.equal(await page.locator('.standalone-actions,main > footer').count(),0);
    assert.equal(await page.locator('#project-info .project-toolbar-actions a').count(),2);
    assert.equal(await page.locator('.detail-hud-links').evaluate(el=>getComputedStyle(el).position),'static');
    if(width===1440){
      await page.locator('.project-hud-title').hover({position:{x:10,y:10}});await page.locator('#project-info').waitFor({state:'visible'});
      await page.locator('#project-info [data-project-action="github"]').hover();
      assert.equal(await page.locator('#project-info').isVisible(),true,'Pointer can move from the info button to the action links');
      await page.mouse.move(4,400);await page.locator('#project-info').waitFor({state:'hidden'});
      await page.locator('.project-hud-title').click({position:{x:10,y:10}});await page.mouse.move(4,400);await page.waitForTimeout(200);
      assert.equal(await page.locator('#project-info').isVisible(),true,'Explicit click pins the popover after pointer leave');
      await page.locator('.project-info-toggle').click();await page.locator('#project-info').waitFor({state:'hidden'});
    }
    await page.locator('.project-info-toggle').focus();await page.keyboard.press('Enter');await page.locator('#project-info').waitFor({state:'visible'});
    await page.keyboard.press('Escape');await page.locator('#project-info').waitFor({state:'hidden'});
    assert.equal(await page.locator('.project-info-toggle').evaluate(el=>el===document.activeElement),true);
    await page.evaluate(()=>scrollTo({top:1200,behavior:'instant'}));
    const top=await page.evaluate(()=>scrollY);await language('en');assert.ok(Math.abs(await page.evaluate(()=>scrollY)-top)<=1,'Standalone locale switch preserves document position');
    assert.equal(await page.locator('.detail-projects').getAttribute('href'),'/projects/');
    assert.ok(await page.locator('.detail-toolbar').evaluate(el=>{const r=el.getBoundingClientRect(),css=getComputedStyle(el),settings=document.querySelector('.settings-hud').getBoundingClientRect();return css.position==='fixed' && r.top===0 && css.backgroundColor==='rgb(22, 23, 19)' && settings.top>=r.top && settings.bottom<=r.bottom;}),'Home/folder/title/Settings share an opaque pinned header');
    await page.evaluate(()=>document.querySelector('[data-project-explorer-trigger]').click());await page.locator('.explorer-window[open]').waitFor();
    assert.equal(new URL(page.url()).pathname,'/ko/work/zzz/');assert.equal(new URL(page.url()).hash,'#projects');
    assert.ok(Math.abs(await page.evaluate(()=>scrollY)-top)<=1,'Opening the local collection preserves document scroll');
    await close();assert.ok(Math.abs(await page.evaluate(()=>scrollY)-top)<=1,'Closing restores the underlying reading position');
    await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
    assert.ok(await page.locator('.detail-prose').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight),'The last paragraph is unobstructed without a bottom action bar');
    if(width===1440||width===390){await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:join(out,'standalone-game-'+width+'.png')});}
    await page.locator('.detail-projects').click();await page.waitForSelector('.explorer-window[open]');assert.equal(new URL(page.url()).pathname,'/ko/work/zzz/');assert.equal(new URL(page.url()).hash,'#projects');assert.equal(await page.locator('.collection-entry').count(),8);assert.equal(await page.locator('.project-description').count(),0);
    if(width===1440){
      const localHistoryLength=await page.evaluate(()=>history.length);
      await select('kuroom');await details('kuroom');await escape('#projects/kuroom');await escape('#projects');
      assert.equal(await page.evaluate(()=>history.length),localHistoryLength,'Embedded project browsing and ESC do not append document history');
    }
    await close();assert.equal(new URL(page.url()).pathname,'/ko/work/zzz/');
  }
  await goto('/work/zzz/#projects/kuroom');await page.locator('.project-description').waitFor();await close();assert.equal(new URL(page.url()).pathname,'/work/zzz/');
  pass('standalone 360–1440px: inline title/actions, hover/keyboard information, local collection/detail/history/direct entry and preserved reading scroll');

  await page.setViewportSize({width:1440,height:900});await goto('/#projects/zzz');await page.locator('.project-description').waitFor();
  await page.locator('.explorer-window').evaluate(el=>Promise.all(el.getAnimations().map(animation=>animation.finished)));
  const divider=page.locator('.project-divider');
  assert.equal(await divider.getAttribute('aria-orientation'),'vertical');
  assert.equal(await divider.getAttribute('aria-valuenow'),'52');
  const splitBox=await page.locator('.project-browser').boundingBox();
  const drag=async x=>{const box=await divider.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+80);await page.mouse.down();await page.mouse.move(x,box.y+80,{steps:8});};
  await drag(splitBox.x+splitBox.width*.6);
  assert.ok(Number(await divider.getAttribute('aria-valuenow'))>59,'Ratio changes while pointer is still held');
  assert.equal(await page.locator('.project-browser').getAttribute('data-resizing'),'true');
  await page.mouse.up();assert.equal(await page.locator('.project-browser').getAttribute('data-resizing'),null);
  await drag(0);await page.mouse.up();assert.equal(await divider.getAttribute('aria-valuenow'),'32');
  await drag(1440);await page.mouse.up();assert.equal(await divider.getAttribute('aria-valuenow'),'68');
  await divider.focus();await page.keyboard.press('Home');assert.equal(await divider.getAttribute('aria-valuenow'),'32');
  await page.keyboard.press('ArrowRight');assert.equal(await divider.getAttribute('aria-valuenow'),'33');
  await page.keyboard.press('End');await page.keyboard.press('ArrowLeft');assert.equal(await divider.getAttribute('aria-valuenow'),'67');
  await page.keyboard.press('Shift+ArrowLeft');assert.equal(await divider.getAttribute('aria-valuenow'),'62');
  assert.equal(await divider.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
  await page.waitForFunction(()=>localStorage.getItem('portfolio.project-split')==='62');
  await select('ct');assert.equal(await divider.getAttribute('aria-valuenow'),'62');
  await page.reload();await page.waitForFunction(()=>document.querySelector('.project-divider')?.getAttribute('aria-valuenow')==='62');
  await page.setViewportSize({width:900,height:800});await page.waitForFunction(()=>Number(document.querySelector('.project-divider')?.getAttribute('aria-valuemax'))<62);
  assert.ok(await page.locator('.project-description').evaluate(el=>el.getBoundingClientRect().width>=319));
  await page.setViewportSize({width:1280,height:800});await page.waitForFunction(()=>document.querySelector('.project-divider')?.getAttribute('aria-valuenow')==='62');
  await page.setViewportSize({width:360,height:844});assert.equal(await divider.isVisible(),false);
  await page.setViewportSize({width:1440,height:900});await page.waitForFunction(()=>document.querySelector('.project-divider')?.getAttribute('aria-valuenow')==='62');
  await page.screenshot({path:join(out,'resizable-split.png')});
  pass('pointer resize/live update/capture/clamps, separator keyboard/focus, saved ratio across projects/refresh/resize, mobile divider hidden');
  const fixture=await openSite(JSON.parse(readFileSync(join(out,'content-results.json'))).fixtureDist);
  try {await page.goto(fixture.base+'/#projects');await page.waitForSelector('.explorer-window[open]');assert.equal(await page.locator('[data-collection-project]').count(),28);
    await page.locator('[data-collection-project="ready-image"]').click();await page.waitForSelector('.project-description');assert.equal(await page.locator('.explorer-left img').getAttribute('src'),'/thumbnail.svg');
    assert.equal(await page.locator('[data-project-action="demo"]').getAttribute('href'),'/demo-fixture.html');
    await page.locator('.window-close').click();await page.locator('[data-menu="resume"]').click();await page.locator('.documents-panel').waitFor({state:'visible'});assert.equal(await page.locator('.documents-panel a').count(),0);
  } finally {await fixture.close();}
  const scrollFixture=await openSite(JSON.parse(readFileSync(join(out,'content-results.json'))).fixtureDist);
  try {
    for(const width of [1440,1280]) {
      await page.setViewportSize({width,height:800});await page.goto(scrollFixture.base+'/#projects/inserted');await page.waitForSelector('.explorer-window[open]');
      await page.locator('.explorer-window').evaluate(el=>Promise.all(el.getAnimations().map(animation=>animation.finished)));
      const left=page.locator('.project-name-list'),right=page.locator('.project-description');
      await page.waitForFunction(()=>document.querySelector('.project-description').scrollHeight>document.querySelector('.project-description').clientHeight);
      const initial=await page.evaluate(()=>({left:document.querySelector('.project-name-list').scrollTop,right:document.querySelector('.project-description').scrollTop,mediaY:document.querySelector('.explorer-media').getBoundingClientRect().y,width:document.querySelector('.project-description').clientWidth}));
      const headingY=await page.locator('.preview-heading-bar').evaluate(el=>el.getBoundingClientRect().top);
      await right.hover({position:{x:80,y:150}});await page.mouse.wheel(0,450);await page.waitForFunction(()=>document.querySelector('.project-description').scrollTop>100);
      assert.equal(await left.evaluate(el=>el.scrollTop),initial.left);
      assert.equal(await page.locator('.explorer-media').evaluate(el=>el.getBoundingClientRect().y),initial.mediaY);
      assert.equal(await page.locator('.preview-heading-bar').evaluate(el=>el.getBoundingClientRect().top),headingY,'Project heading remains sticky during description scroll');
      assert.ok(await page.locator('.project-action-footer').evaluate(el=>{const footer=el.getBoundingClientRect(),pane=el.closest('.project-description').getBoundingClientRect();return Math.abs(footer.bottom-pane.bottom)<=1 && footer.top>=pane.top;}),'Project links remain visible at the bottom of the description pane');
      assert.equal(await page.locator('[data-project-action="details"]').isVisible(),true);
      const rightTop=await right.evaluate(el=>el.scrollTop);
      await left.hover({position:{x:80,y:50}});await page.mouse.wheel(0,450);await page.waitForFunction(initial=>document.querySelector('.project-name-list').scrollTop>initial+100,initial.left);
      assert.equal(await right.evaluate(el=>el.scrollTop),rightTop);
      assert.equal(await page.locator('.explorer-media').evaluate(el=>el.getBoundingClientRect().y),initial.mediaY,'List scrolling must keep media fixed');
      assert.equal(await page.locator('.explorer-left').evaluate(el=>el.scrollTop),0);
      assert.ok(await page.evaluate(()=>scrollY===0 && document.querySelector('.window-body').scrollTop===0 && document.querySelector('.explorer-window').scrollTop===0));
      await select('ct');assert.equal(await right.evaluate(el=>el.clientWidth),initial.width,'Scrollbar changes must not shift pane width');
      assert.equal(await page.locator('[data-collection-project="ct"]').getAttribute('aria-current'),'true');
      await page.screenshot({path:join(out,'simple-scroll-'+width+'.png')});
    }
    await page.setViewportSize({width:360,height:844});await page.goto(scrollFixture.base+'/#projects/inserted');await page.waitForSelector('.project-description');
    await page.locator('.explorer-window').evaluate(el=>Promise.all(el.getAnimations().map(animation=>animation.finished)));
    await page.locator('.window-body').evaluate(el=>{el.scrollTop+=el.querySelector('.project-description').getBoundingClientRect().top-el.getBoundingClientRect().top+250;});
    assert.ok(await page.locator('.project-description').evaluate(el=>{const body=el.closest('.window-body').getBoundingClientRect(),heading=el.querySelector('.preview-heading-bar').getBoundingClientRect(),footer=el.querySelector('.project-action-footer').getBoundingClientRect();return Math.abs(heading.top-body.top)<=1 && Math.abs(footer.bottom-body.bottom)<=1;}),'Long mobile descriptions keep heading and icon footer in the window scroll viewport');
    await page.screenshot({path:join(out,'sticky-project-mobile.png')});
  } finally {await scrollFixture.close();}
  pass('desktop list/detail scroll independently by wheel; media fixed during both, no left-pane/outer scroll or width shift');
  pass('all 16 EN/KO standalone details and archive preserved; 28-project fixture, real demo URL and missing documents');
  assert.deepEqual(errors,[]);
  writeFileSync(join(out,'browser-results.json'),JSON.stringify({passed,viewports:[1440,1280,768,390,360],errors},null,2));
  console.log(passed.length+' browser groups passed.');
} finally {await site.close();}
