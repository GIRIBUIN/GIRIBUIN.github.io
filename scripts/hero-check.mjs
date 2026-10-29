// Focused checks for the actual GLB, motion constraints and native pointer/keyboard input.
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { preparePet, createPetMotion, stepPetMotion } from '../src/lib/pet-scene.ts';
import { openSite } from './browser-harness.mjs';

mkdirSync('.verification', { recursive: true });
const bytes = readFileSync('public/models/pet.glb');
const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const { model, head } = preparePet(gltf.scene);
assert.ok(head, 'The three original head objects form a safe web pivot');
model.updateMatrixWorld(true);
const body = model.getObjectByName('body'), eye = model.getObjectByName('eyes');
const bodyBefore = body.getWorldPosition(new Vector3()), eyeBefore = eye.getWorldPosition(new Vector3());
head.rotation.y = .2; model.updateMatrixWorld(true);
assert.deepEqual(body.getWorldPosition(new Vector3()).toArray(), bodyBefore.toArray());
assert.ok(eye.getWorldPosition(new Vector3()).distanceTo(eyeBefore) > .01);
assert.equal(gltf.scene.getObjectByName('head').parent, gltf.scene, 'Cached/source hierarchy is unchanged');
const motion = createPetMotion(); motion.lookX = motion.lookY = 1; motion.hovered = true;
for (let i = 0; i < 120; i++) stepPetMotion(motion, 1 / 60, false, true);
assert.ok(motion.pose.headYaw > .20 && motion.pose.headYaw < .21);
assert.ok(motion.pose.headPitch > .10 && motion.pose.headPitch < .105);
assert.equal(motion.pose.yaw, -.15);
assert.ok(motion.pose.scale > 1.029 && motion.pose.scale <= 1.03);
motion.drag = { id: 1, x: 0, y: 0, lastX: 0, moved: true }; motion.baseYaw = 2;
for (let i = 0; i < 120; i++) stepPetMotion(motion, 1 / 60, false, true);
assert.ok(motion.pose.headYaw < .0001 && motion.pose.yaw > 1.99, 'Drag suspends head look while rotating the entire pet');
motion.reaction = 0; stepPetMotion(motion, 1 / 60, true, true);
assert.equal(motion.pose.y, 0); assert.equal(motion.reaction, -1);
console.log('PASS original GLB/head-only pivot, unchanged body/source, bounded damping/hover, drag priority and reduced motion');

const site = await openSite();
try {
  const context = await site.browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const ready = async () => { await page.waitForFunction(() => document.querySelector('[data-pet-scene]')?.dataset.sceneState === 'ready'); await page.locator('[data-explorer-ready]').waitFor(); };
  const silhouette = async () => {
    const { data, info } = await sharp(await page.locator('.visual-scene canvas').screenshot()).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let left = info.width, top = info.height, right = 0, bottom = 0;
    for (let y = 16; y < info.height - 44; y++) for (let x = 16; x < info.width - 16; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i] > 110 && data[i + 1] > 100 && data[i + 2] > 80) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
    }
    assert.ok(bottom > top, 'The canvas contains the rendered pet, not an empty WebGL surface');
    return { left, top, right, bottom, height: bottom - top };
  };
  for (const [width, height] of [[1440, 900], [1280, 800], [768, 900], [390, 844], [360, 740]]) {
    await page.setViewportSize({ width, height }); await page.goto(site.base + '/ko/'); await ready();
    assert.equal(await page.locator('[data-pet-scene]').getAttribute('data-look-mode'), 'head');
    assert.equal(await page.locator('astro-island').count(), 2);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.ok(await page.locator('.visual-scene').evaluate(el => { const r = el.getBoundingClientRect(), body = document.body.getBoundingClientRect(); return Math.abs((r.left + r.right - body.left - body.right) / 2) <= 1; }));
    assert.equal(await page.locator('.header .header-brand span,.scene-hint,.title-screen-copy').count(), 0);
    assert.ok(await page.locator('.visual-scene').evaluate(el => el.getBoundingClientRect().bottom < document.querySelector('.title-menu').getBoundingClientRect().top));
    if (width >= 1100) {
      const shape = await silhouette();
      assert.ok(shape.height / height >= .4 && shape.height / height <= .56, 'Visible pet occupies 40–55% of desktop viewport height');
    }
    await page.screenshot({ path: '.verification/hero-showcase-' + width + '.png' });
    const length = await page.evaluate(() => history.length);
    await page.locator('[data-menu="projects"]').click(); await page.locator('.collection-grid').waitFor();
    assert.equal(await page.locator('.visual-scene').evaluate(el => el.inert), true);
    await page.keyboard.press('Escape'); await page.locator('.explorer-window').waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => history.length), length);
    console.log('PASS ' + width + 'px: large pet/layout, menu/history and inactive background scene');
  }
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto(site.base + '/'); await ready();
  const canvas = page.locator('.visual-scene canvas');
  const still = await canvas.screenshot(); await page.waitForTimeout(250);
  assert.deepEqual(await canvas.screenshot(), still, 'Reduced motion remains still without user input');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(300); const idle = await canvas.screenshot(); await page.waitForTimeout(400);
  assert.notDeepEqual(await canvas.screenshot(), idle, 'Idle animates in the browser');
  const scene = await canvas.boundingBox(), shape = await silhouette();
  const point = { x: scene.x + (shape.left + shape.right) / 2, y: scene.y + shape.top + shape.height * .45 };
  await page.mouse.move(point.x, point.y); await page.waitForTimeout(350);
  const front = await canvas.screenshot();
  await page.mouse.down(); assert.equal(await page.locator('.pet-stage').getAttribute('data-dragging'), 'true');
  await page.mouse.move(point.x + 300, point.y, { steps: 15 }); await page.waitForTimeout(250);
  assert.notDeepEqual(await canvas.screenshot(), front, 'Native drag visibly rotates the model');
  await page.mouse.move(3, point.y, { steps: 10 }); await page.mouse.up();
  assert.equal(await page.locator('.pet-stage').getAttribute('data-dragging'), null, 'Capture releases outside the canvas');
  await page.locator('.pet-stage').focus(); await page.keyboard.press('Home'); await page.waitForTimeout(850);
  await page.locator('.pet-stage').evaluate(el => el.blur());
  await page.mouse.move(point.x, point.y); await page.waitForTimeout(350);
  const beforeJump = await silhouette(); await page.mouse.click(point.x, point.y); await page.waitForTimeout(180);
  const jump = await silhouette(); assert.ok(jump.bottom < beforeJump.bottom - 5, 'A click triggers a small upward reaction');
  await page.screenshot({ path: '.verification/hero-reaction.png' });
  await page.locator('.pet-stage').focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter');
  assert.deepEqual(errors, []);
  console.log('PASS actual idle, pointer drag/capture, click jump, keyboard interaction and no uncaught errors');
  const touch = await site.browser.newContext({ viewport: { width: 360, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const mobile = await touch.newPage();
  await mobile.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await mobile.goto(site.base + '/ko/'); await mobile.waitForFunction(() => document.querySelector('[data-pet-scene]')?.dataset.sceneState === 'ready');
  const mobileCanvas = mobile.locator('.visual-scene canvas'), touchBefore = await mobileCanvas.screenshot();
  const touchBox = await mobileCanvas.boundingBox(), touchPoint = { x: touchBox.x + touchBox.width / 2, y: touchBox.y + touchBox.height / 2 };
  const cdp = await touch.newCDPSession(mobile);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [touchPoint] });
  assert.equal(await mobile.locator('.pet-stage').getAttribute('data-dragging'), 'true');
  for (const delta of [20, 50, 80]) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touchPoint.x + delta, y: touchPoint.y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await mobile.waitForTimeout(350);
  assert.equal(await mobile.locator('.pet-stage').getAttribute('data-dragging'), null);
  assert.notDeepEqual(await mobileCanvas.screenshot(), touchBefore, 'Explicit touch drag rotates even with reduced motion enabled');
  await mobile.locator('.pet-stage').tap(); await mobile.locator('[data-menu="about"]').tap(); await mobile.locator('.profile-menu').waitFor();
  await mobile.locator('.window-close').tap(); await mobile.locator('#settings-toggle').tap(); await mobile.locator('[data-locale="en"]').tap();
  assert.equal(await mobile.locator('.pet-stage').getAttribute('aria-label'), 'Interact with the companion');
  await touch.close(); console.log('PASS mobile touch drag/capture, reduced motion, About and existing locale controls');
} finally { await site.close(); }
