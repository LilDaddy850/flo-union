import * as THREE from 'three';

// Night-rain palette. Cool everything, one warm accent. Keep it to these.
export const C = {
  skyTop: 0x0b1630,
  skyHorizon: 0x2a2f45,
  fog: 0x232a3e,
  wall: 0x6f7c8a,
  roof: 0x39415a,
  trim: 0xd9d4cc,
  gutter: 0xf4f1ec,
  ground: 0x27332e,
  tree: 0x24483d,
  treeDark: 0x1b3830,
  trunk: 0x3b2f2a,
  door: 0xb85c14,
  glow: 0xffb765,
  orange: 0xe8862a,
  moon: 0x9db4ff,
};

let ramp: THREE.DataTexture | null = null;

/** Soft 5-step ramp: cel banding without the harsh three-tone look. */
export function toonRamp(): THREE.DataTexture {
  if (ramp) return ramp;
  const steps = [40, 100, 170, 225, 255];
  const data = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => { data.set([v, v, v, 255], i * 4); });
  ramp = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  ramp.minFilter = THREE.LinearFilter;
  ramp.magFilter = THREE.LinearFilter;
  ramp.generateMipmaps = false;
  ramp.needsUpdate = true;
  return ramp;
}

export function toon(color: number, extra: Partial<THREE.MeshToonMaterialParameters> = {}): THREE.MeshToonMaterial {
  return new THREE.MeshToonMaterial({ color, gradientMap: toonRamp(), ...extra });
}
