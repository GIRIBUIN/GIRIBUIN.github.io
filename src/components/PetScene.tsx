import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Group, MathUtils, OrthographicCamera } from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { createPetMotion, PET_HEIGHT, preloadPet, preparePet, stepPetMotion, type PetMotion } from '../lib/pet-scene';
import type { Locale } from '../i18n/ui';

const copy = {
  en: { label: 'Interact with the companion', hint: 'Drag to rotate · Click to react', keys: 'Left and right arrows rotate. Enter or Space reacts. Home resets the view.' },
  ko: { label: '컴패니언과 상호작용', hint: '드래그로 회전 · 클릭하면 반응', keys: '좌우 방향키로 회전, Enter 또는 Space로 반응, Home으로 정면을 봅니다.' },
};
function Poster() { return <img className="scene-poster" src="/images/profile/pet.png" alt="" />; }
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? <Poster /> : this.props.children; }
}
function StageCamera() {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    camera.zoom = Math.min(size.height * .7 / PET_HEIGHT, size.width * .9 / 3.6);
    camera.lookAt(0, -.15, 0); camera.updateProjectionMatrix(); invalidate();
  }, [camera, size.width, size.height, invalidate]);
  return null;
}
function Lighting() {
  return <>
    <hemisphereLight args={['#fff6e9', '#414a32', 1.8]} />
    <directionalLight position={[-2, 7, 3]} intensity={1.8} color="#fff1dd" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-camera-near={1} shadow-camera-far={20} shadow-bias={-.0005} shadow-radius={4} />
    <directionalLight position={[4, 1, 3]} intensity={.8} color="#c4d2b2" />
    <directionalLight position={[1, 3, -4]} intensity={1.6} color="#c6c397" />
    <mesh rotation-x={-Math.PI / 2} position-y={-1.52} receiveShadow>
      <planeGeometry args={[30, 30]} /><shadowMaterial transparent opacity={.13} depthWrite={false} />
    </mesh>
  </>;
}
function PetModel({ gltf, input, reduced, active, onReady, onDown, onHover }: {
  gltf: GLTF;
  input: RefObject<PetMotion>; reduced: boolean; active: boolean;
  onReady: (head: boolean) => void; onDown: (event: PointerEvent) => void; onHover: (hovered: boolean) => void;
}) {
  const { model, head } = useMemo(() => preparePet(gltf.scene), [gltf.scene]);
  const ref = useRef<Group>(null);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => { onReady(Boolean(head)); invalidate(); }, [head, invalidate, onReady]);
  useFrame((state, delta) => {
    if (!active || !ref.current) return;
    const moving = stepPetMotion(input.current, delta, reduced, Boolean(head));
    const pose = input.current.pose;
    ref.current.position.y = pose.y; ref.current.rotation.set(pose.pitch, pose.yaw, 0, 'YXZ');
    ref.current.scale.setScalar(pose.scale);
    if (head) head.rotation.set(pose.headPitch, pose.headYaw, 0, 'YXZ');
    if (moving) state.invalidate();
  });
  return <group ref={ref} dispose={null}
    onPointerOver={(event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); onHover(true); }}
    onPointerOut={() => onHover(false)}
    onPointerDown={(event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); onDown(event.nativeEvent); }}>
    <primitive object={model} />
  </group>;
}

export default function PetScene({ locale: initialLocale = 'en' }: { locale?: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef(createPetMotion());
  const wake = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  const [asset, setAsset] = useState<GLTF | null>(null);
  const [prefs, setPrefs] = useState({ reduced: true, fine: false, active: false, locale: initialLocale });
  const host = () => ref.current?.closest<HTMLElement>('[data-pet-scene]');
  const unavailable = () => { const element = host(); if (element) element.dataset.sceneState = 'unavailable'; setFailed(true); };
  useEffect(() => {
    let cancelled = false;
    // Catch asset errors before entering the R3F reconciler, preserving the menu.
    void preloadPet().then(gltf => { if (!cancelled) setAsset(gltf); }).catch(() => { if (!cancelled) unavailable(); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      const active = !document.hidden && !document.documentElement.classList.contains('explorer-open');
      setPrefs({ reduced: motion.matches, fine: fine.matches, active, locale: document.documentElement.lang === 'ko' ? 'ko' : 'en' });
      if (!active) {
        const drag = input.current.drag;
        input.current.drag = null; input.current.hovered = false;
        ref.current?.removeAttribute('data-dragging');
        if (drag && ref.current?.hasPointerCapture(drag.id)) ref.current.releasePointerCapture(drag.id);
      }
      wake.current();
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'lang'] });
    motion.addEventListener('change', sync); fine.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync); sync();
    return () => { observer.disconnect(); motion.removeEventListener('change', sync); fine.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); };
  }, []);
  useEffect(() => {
    if (!prefs.fine || prefs.reduced || !prefs.active) { input.current.lookX = input.current.lookY = 0; return; }
    const move = (event: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || event.pointerType !== 'mouse' || input.current.drag) return;
      const overControl = event.target instanceof Element && event.target.closest('button,a,dialog,[popover]');
      input.current.lookX = overControl ? 0 : MathUtils.clamp((event.clientX - rect.left - rect.width / 2) / (rect.width * .7), -1, 1);
      input.current.lookY = overControl ? 0 : MathUtils.clamp((event.clientY - rect.top - rect.height / 2) / (rect.height * .7), -1, 1);
      wake.current();
    };
    const reset = () => { input.current.lookX = input.current.lookY = 0; wake.current(); };
    window.addEventListener('pointermove', move); document.addEventListener('pointerleave', reset);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', reset); };
  }, [prefs.fine, prefs.reduced, prefs.active]);
  const react = () => { if (!prefs.reduced) input.current.reaction = 0; wake.current(); };
  const begin = (event: PointerEvent) => {
    if (event.button !== 0 || !prefs.active || input.current.drag) return;
    input.current.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, moved: false };
    ref.current?.setPointerCapture(event.pointerId);
    ref.current?.setAttribute('data-dragging', 'true'); wake.current();
  };
  const finish = (cancelled = false) => {
    const drag = input.current.drag;
    if (!drag) return;
    input.current.drag = null; input.current.resumeLookAt = input.current.elapsed + .6;
    input.current.lookX = input.current.lookY = 0;
    ref.current?.removeAttribute('data-dragging');
    if (ref.current?.hasPointerCapture(drag.id)) ref.current.releasePointerCapture(drag.id);
    if (!cancelled && !drag.moved) react(); wake.current();
  };
  const text = copy[prefs.locale];
  return <div ref={ref} className="pet-stage" role={failed ? 'img' : 'button'} tabIndex={failed ? -1 : 0} aria-label={failed ? 'GIRIBUIN companion' : text.label} aria-describedby={failed ? undefined : 'pet-interaction-hint pet-keyboard-hint'}
    onPointerMove={event => {
      const drag = input.current.drag;
      if (!drag || drag.id !== event.pointerId) return;
      drag.moved ||= Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 5;
      input.current.baseYaw += (event.clientX - drag.lastX) / Math.max(ref.current!.clientWidth * .75, 260) * Math.PI * 2;
      drag.lastX = event.clientX; wake.current();
    }}
    onPointerUp={event => { if (input.current.drag?.id === event.pointerId) finish(); }}
    onPointerCancel={() => finish(true)} onLostPointerCapture={() => finish(true)}
    onClick={event => { if (event.detail === 0) react(); }}
    onKeyDown={event => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'ArrowLeft') input.current.baseYaw -= Math.PI / 12;
        else if (event.key === 'ArrowRight') input.current.baseYaw += Math.PI / 12;
        else if (event.key === 'Home') input.current.baseYaw = input.current.pose.yaw + MathUtils.euclideanModulo(-.15 - input.current.pose.yaw + Math.PI, Math.PI * 2) - Math.PI;
        else react();
        wake.current();
      }
    }}>
    <SceneBoundary onError={unavailable}>
      {failed ? <Poster /> : <Canvas orthographic camera={{ position: [0, .75, 8], zoom: 100, near: .1, far: 40 }} dpr={[1, 1.5]} shadows
        frameloop={prefs.active ? 'demand' : 'never'} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        onCreated={({ invalidate, gl }) => { wake.current = invalidate; gl.domElement.addEventListener('webglcontextlost', unavailable); }} fallback={<Poster />}>
        <StageCamera /><Lighting />
        {asset && <PetModel gltf={asset} input={input} reduced={prefs.reduced} active={prefs.active}
            onReady={head => { const element = host(); if (element) { element.dataset.sceneState = 'ready'; element.dataset.lookMode = head ? 'head' : 'body'; } }}
            onDown={begin} onHover={hovered => { input.current.hovered = hovered; wake.current(); }} />}
      </Canvas>}
    </SceneBoundary>
    <span className="visually-hidden" id="pet-interaction-hint">{text.hint}</span>
    <span className="visually-hidden" id="pet-keyboard-hint">{text.keys}</span>
  </div>;
}
