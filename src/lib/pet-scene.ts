import { Box3, Group, MathUtils, Mesh, Vector3, type Object3D } from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';

export const PET_MODEL = '/models/pet.glb';
export const PET_HEIGHT = 2.8;
let asset: Promise<GLTF> | undefined;
export function preloadPet() { return asset ||= new GLTFLoader().loadAsync(PET_MODEL); }

// Clone the GLB; attach() preserves the three head parts' original world transforms.
export function preparePet(source: Group) {
  const root = source.clone(true);
  root.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(root);
  const height = bounds.getSize(new Vector3()).y;
  const center = bounds.getCenter(new Vector3());
  const parts = ['head', 'hood', 'eyes'].map(name => root.getObjectByName(name));
  let head: Group | null = null;
  if (parts.every((part): part is Object3D => Boolean(part))) {
    const headBounds = new Box3();
    parts.forEach(part => headBounds.union(new Box3().setFromObject(part!)));
    const pivot = headBounds.getCenter(new Vector3());
    pivot.y = headBounds.min.y + headBounds.getSize(new Vector3()).y * .1;
    head = new Group(); head.name = 'web-head-pivot'; head.position.copy(pivot);
    root.add(head); root.updateMatrixWorld(true);
    parts.forEach(part => head!.attach(part!));
  }
  root.position.sub(center);
  const normalized = new Group(); normalized.add(root);
  normalized.scale.setScalar(PET_HEIGHT / Math.max(height, .001));
  root.traverse(object => { if (object instanceof Mesh) object.castShadow = true; });
  return { model: normalized, head };
}

export function createPetMotion() {
  return {
    elapsed: 0, baseYaw: -.15, lookX: 0, lookY: 0, hovered: false,
    drag: null as null | { id: number; x: number; y: number; lastX: number; moved: boolean },
    resumeLookAt: 0, reaction: -1,
    pose: { yaw: -.15, pitch: 0, headYaw: 0, headPitch: 0, y: 0, scale: 1 },
  };
}
export type PetMotion = ReturnType<typeof createPetMotion>;

export function stepPetMotion(state: PetMotion, delta: number, reduced: boolean, headLook: boolean) {
  const dt = Math.min(delta, .05);
  state.elapsed += dt;
  const look = !reduced && !state.drag && state.elapsed >= state.resumeLookAt;
  const yaw = look ? state.lookX * MathUtils.degToRad(12) : 0;
  const pitch = look ? state.lookY * MathUtils.degToRad(6) : 0;
  const pose = state.pose;
  const targetYaw = state.baseYaw + (headLook ? 0 : yaw);
  pose.yaw = MathUtils.damp(pose.yaw, targetYaw, state.drag ? 18 : 8, dt);
  pose.pitch = MathUtils.damp(pose.pitch, headLook ? 0 : pitch, 7, dt);
  pose.headYaw = MathUtils.damp(pose.headYaw, headLook ? yaw : 0, 7, dt);
  pose.headPitch = MathUtils.damp(pose.headPitch, headLook ? pitch : 0, 7, dt);
  const targetScale = state.hovered && !reduced ? 1.03 : 1;
  pose.scale = MathUtils.damp(pose.scale, targetScale, 9, dt);
  if (state.reaction >= 0) state.reaction = reduced || state.reaction > .65 ? -1 : state.reaction + dt;
  const jump = state.reaction < 0 ? 0 : Math.sin(Math.PI * Math.min(state.reaction / .65, 1)) * .19;
  const idle = reduced ? 0 : Math.sin(state.elapsed * .95) * .027 + Math.sin(state.elapsed * 1.6 + .8) * .009;
  pose.y = idle + jump;
  return !reduced || Math.abs(pose.yaw - targetYaw) > .0001 || Math.abs(pose.scale - targetScale) > .0001
    || Math.abs(pose.headYaw - (headLook ? yaw : 0)) > .0001 || Math.abs(pose.headPitch - (headLook ? pitch : 0)) > .0001
    || Math.abs(pose.pitch - (headLook ? 0 : pitch)) > .0001;
}
