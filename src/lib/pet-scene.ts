import { ACESFilmicToneMapping, AnimationMixer, Box3, DirectionalLight, Group, HemisphereLight, Mesh, PerspectiveCamera, Scene, Sphere, Texture, Vector3, WebGLRenderer, type Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function disposeModel(root: Object3D) {
  root.traverse(object => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      for (const value of Object.values(material)) if (value instanceof Texture) value.dispose();
      material.dispose();
    }
  });
}

export async function mountPetScene(host: HTMLElement) {
  const canvas = host.querySelector('canvas');
  if (!canvas) return;
  host.dataset.sceneState = 'loading';
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    host.dataset.sceneState = 'unavailable';
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, .01, 100);
  const model = new Group();
  scene.add(model, new HemisphereLight(0xfff7e8, 0x454b3a, 2.4));
  const light = new DirectionalLight(0xfff3dd, 3);
  light.position.set(4, 6, 7); scene.add(light);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  let disposed = false, radius = 1, mixer: AnimationMixer | undefined, frame = 0, previousTime = 0;
  const draw = () => { if (!disposed) renderer.render(scene, camera); };
  const animate = (time: number) => {
    mixer?.update(Math.min((time - previousTime) / 1000, .05));
    previousTime = time; draw(); frame = requestAnimationFrame(animate);
  };
  const updateMotion = () => {
    cancelAnimationFrame(frame); frame = 0;
    if (disposed || document.hidden || document.documentElement.classList.contains('explorer-open')) return;
    draw();
    // pet.glb currently has no clips. Static models render only on load/resize.
    if (mixer && !motion.matches) { previousTime = performance.now(); frame = requestAnimationFrame(animate); }
  };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height || disposed) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const vertical = camera.fov * Math.PI / 180;
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
    const distance = radius / Math.sin(Math.min(vertical, horizontal) / 2) * 1.12;
    camera.position.copy(new Vector3(2, 1.1, 5).normalize().multiplyScalar(distance));
    camera.near = distance / 100; camera.far = distance * 10;
    camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); draw();
  };
  const observer = new ResizeObserver(resize); observer.observe(host);
  const uiObserver = new MutationObserver(updateMotion);
  uiObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  motion.addEventListener('change', updateMotion); document.addEventListener('visibilitychange', updateMotion);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); cancelAnimationFrame(frame); host.dataset.sceneState = 'unavailable'; });
  canvas.addEventListener('webglcontextrestored', () => { if (!disposed) { host.dataset.sceneState = 'ready'; resize(); updateMotion(); } });
  const cleanup = () => {
    disposed = true; controller.abort(); cancelAnimationFrame(frame);
    observer.disconnect(); uiObserver.disconnect();
    motion.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateMotion);
    mixer?.stopAllAction(); mixer?.uncacheRoot(model); disposeModel(model); renderer.dispose();
  };
  addEventListener('pagehide', event => { if (!event.persisted) cleanup(); });
  addEventListener('pageshow', event => { if (event.persisted) { resize(); updateMotion(); } });
  try {
    const response = await fetch(host.dataset.modelSrc!, { signal: controller.signal });
    if (!response.ok) throw new Error('Model response ' + response.status);
    const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), '/models/');
    if (disposed) { disposeModel(gltf.scene); return; }
    const bounds = new Box3().setFromObject(gltf.scene);
    const size = bounds.getSize(new Vector3());
    gltf.scene.position.sub(bounds.getCenter(new Vector3()));
    model.add(gltf.scene); model.scale.setScalar(2 / Math.max(size.x, size.y, size.z, .001));
    radius = new Box3().setFromObject(model).getBoundingSphere(new Sphere()).radius;
    if (gltf.animations.length) { mixer = new AnimationMixer(model); mixer.clipAction(gltf.animations[0]).play(); }
    resize(); host.dataset.sceneState = 'ready'; updateMotion();
  } catch {
    if (!disposed) { host.dataset.sceneState = 'unavailable'; cleanup(); }
  }
}
