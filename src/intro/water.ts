import * as THREE from 'three';
import type { HouseParts } from './house';

const noiseGlsl = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
`;

export type WaterUniforms = {
  uTime: { value: number }; uFill: { value: number }; uScale: { value: number }; uSpeed: { value: number }; uEdge: { value: number }; uFadeEnd: { value: number }; uWobble: { value: number };
};

/** Stylized flowing water: scrolling noise, foam streaks at the edges. uv.x is the flow direction. */
export function makeWaterMaterial(opts: { scale?: number; speed?: number; fill?: number; edge?: number; fadeEnd?: number; wobble?: number } = {}): { material: THREE.ShaderMaterial; uniforms: WaterUniforms } {
  const uniforms: WaterUniforms = {
    uTime: { value: 0 }, uFill: { value: opts.fill ?? 0 }, uScale: { value: opts.scale ?? 1 }, uSpeed: { value: opts.speed ?? 1 },
    uEdge: { value: opts.edge ?? 1 }, uFadeEnd: { value: opts.fadeEnd ?? 0 }, uWobble: { value: opts.wobble ?? 1 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uFill; uniform float uWobble; varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        p.z *= uFill;
        p.y += (0.004 * sin(p.x * 11.0 + uTime * 7.0) + 0.0025 * sin(p.x * 23.0 - uTime * 9.0)) * uFill * uWobble;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uFill; uniform float uScale; uniform float uSpeed; uniform float uEdge; uniform float uFadeEnd; varying vec2 vUv;
      ${noiseGlsl}
      void main() {
        float t = uTime * uSpeed;
        float n1 = noise(vec2(vUv.x * 9.0 * uScale - t * 1.6, vUv.y * 2.0));
        float n2 = noise(vec2(vUv.x * 17.0 * uScale - t * 2.6 + 7.0, vUv.y * 4.0 + 3.0));
        float n3 = noise(vec2(vUv.x * 30.0 * uScale - t * 3.4 + 2.0, vUv.y * 6.0 + 9.0));
        vec3 deep = vec3(0.06, 0.16, 0.34), light = vec3(0.30, 0.55, 0.85), foamC = vec3(0.92, 0.96, 1.0);
        vec3 col = mix(deep, light, smoothstep(0.25, 0.8, n1 * 0.6 + n2 * 0.4));
        float edge = abs(vUv.y - 0.5) * 2.0 * uEdge;
        float foam = smoothstep(0.55, 0.72, n3) * (0.35 + 0.65 * edge) + smoothstep(0.66, 0.8, n2) * 0.5;
        col = mix(col, foamC, clamp(foam, 0.0, 1.0));
        float a = 0.96 * smoothstep(0.0, 0.15, uFill);
        a *= mix(1.0, 1.0 - smoothstep(0.45, 1.0, vUv.x), uFadeEnd);
        gl_FragColor = vec4(col, a);
      }`,
    transparent: true,
    depthWrite: false,
  });
  return { material, uniforms };
}

export type GutterWater = { mesh: THREE.Mesh; uniforms: WaterUniforms };

/** Water strip inside the gutter channel, about a third full. uFill 0..1 widens it from nothing. Flow runs toward +x (the outlet). */
export function createGutterWater(h: HouseParts): GutterWater {
  const len = h.gutterChannel.x1 - h.gutterChannel.x0 - 0.06;
  const geo = new THREE.PlaneGeometry(len, 0.098, 220, 2);
  geo.rotateX(-Math.PI / 2);
  const { material, uniforms } = makeWaterMaterial({ scale: 1, speed: 1 });
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set((h.gutterChannel.x0 + h.gutterChannel.x1) / 2, h.gutterTopY - 0.118 + 0.046, h.gutterChannel.z);
  mesh.renderOrder = 2;
  return { mesh, uniforms };
}

/** Water riding down inside the downspout (seen during the dive). */
export function createDownspoutWater(h: HouseParts): GutterWater {
  const geo = new THREE.TubeGeometry(h.downspoutCurve, 200, 0.05, 16, false);
  const { material, uniforms } = makeWaterMaterial({ scale: 6, speed: 2.2, fill: 1, edge: 0, wobble: 0 });
  material.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(geo, material);
  mesh.renderOrder = 2;
  return { mesh, uniforms };
}

export type Outflow = { group: THREE.Group; uniforms: WaterUniforms[]; splashes: Splashes; landing: THREE.Vector3 };

/** Water leaving the downspout: a jet from the bottom elbow, a splash where it lands, and a stream running away from the house. */
export function createOutflow(h: HouseParts, phone: boolean): Outflow {
  const group = new THREE.Group();
  const end = h.downspoutCurve.getPointAt(1);
  const dir = h.downspoutCurve.getTangentAt(1).normalize(); // points away from the house along +z
  const drops = [0, 0.005, 0.03, 0.07, 0.1];
  const jetPts = [0, 0.1, 0.2, 0.3, 0.38].map((d, i) => new THREE.Vector3(end.x + dir.x * d, Math.max(0.012, end.y - drops[i]), end.z + dir.z * d));
  const jetCurve = new THREE.CatmullRomCurve3(jetPts, false, 'centripetal');
  const jet = makeWaterMaterial({ scale: 2.5, speed: 2.4, edge: 0, wobble: 0 });
  const jetMesh = new THREE.Mesh(new THREE.TubeGeometry(jetCurve, 24, 0.03, 10, false), jet.material);
  jetMesh.renderOrder = 2;
  group.add(jetMesh);
  const landing = jetPts[jetPts.length - 1].clone();
  // stream on the ground, fading out
  const streamLen = 1.5, streamW = 0.26;
  const streamGeo = new THREE.PlaneGeometry(streamLen, streamW, 60, 2);
  streamGeo.rotateX(-Math.PI / 2);
  streamGeo.rotateY(-Math.PI / 2); // uv.x (flow) now runs along +z
  const stream = makeWaterMaterial({ scale: 0.8, speed: 1.2, fadeEnd: 1, wobble: 0 });
  const streamMesh = new THREE.Mesh(streamGeo, stream.material);
  streamMesh.position.set(landing.x, 0.012, landing.z + streamLen / 2 - 0.1);
  streamMesh.renderOrder = 1;
  group.add(streamMesh);
  const splashes = createSplashes(h, phone ? 28 : 44, { x0: landing.x - 0.16, x1: landing.x + 0.16, z0: landing.z - 0.12, z1: landing.z + 0.3 }, 0.18);
  group.add(splashes.mesh);
  return { group, uniforms: [jet.uniforms, stream.uniforms], splashes, landing };
}

export type EaveSheet = { mesh: THREE.Mesh; uniforms: { uTime: { value: number }; uAlpha: { value: number } } };

/** Rain sheeting off the bare roof edge (before the gutter exists). Falls from the eave to the ground along the whole front. */
export function createEaveSheet(h: HouseParts): EaveSheet {
  const height = h.eaveY + 0.02;
  const geo = new THREE.PlaneGeometry(h.gutterLength, height, 1, 1);
  const uniforms = { uTime: { value: 0 }, uAlpha: { value: 1 } };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uAlpha; varying vec2 vUv;
      ${noiseGlsl}
      void main() {
        float col1 = noise(vec2(vUv.x * 220.0, 0.5));
        float col2 = noise(vec2(vUv.x * 380.0 + 9.0, 0.5));
        float fall1 = noise(vec2(vUv.x * 220.0, vUv.y * 2.5 + uTime * 2.6));
        float fall2 = noise(vec2(vUv.x * 380.0 + 9.0, vUv.y * 4.0 + uTime * 3.9));
        float thread = smoothstep(0.62, 0.8, col1) * smoothstep(0.35, 0.7, fall1) + smoothstep(0.7, 0.86, col2) * smoothstep(0.4, 0.75, fall2) * 0.7;
        float top = smoothstep(0.55, 0.98, vUv.y);
        float a = thread * (0.16 + 0.55 * top) + 0.35 * smoothstep(0.9, 1.0, vUv.y);
        a *= smoothstep(0.0, 0.08, vUv.y);
        gl_FragColor = vec4(vec3(0.72, 0.82, 0.96), a * uAlpha * 0.75);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, height / 2, h.eaveZ + 0.07);
  mesh.renderOrder = 1;
  return { mesh, uniforms };
}

export type Splashes = { mesh: THREE.Mesh; uniforms: { uTime: { value: number }; uAlpha: { value: number } } };
type Region = { x0: number; x1: number; z0: number; z1: number };

/** Splash rings. Default region: along the front of the house where roof water lands. */
export function createSplashes(h: HouseParts, count = 160, region?: Region, maxSize = 0.3): Splashes {
  const r: Region = region ?? { x0: h.gutterChannel.x0, x1: h.gutterChannel.x1, z0: h.eaveZ - 0.2, z1: h.eaveZ + 0.3 };
  const base = new THREE.RingGeometry(0.6, 1, 14);
  base.rotateX(-Math.PI / 2);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index; geo.attributes.position = base.attributes.position; geo.attributes.uv = base.attributes.uv;
  const offsets = new Float32Array(count * 3), seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    offsets.set([r.x0 + Math.random() * (r.x1 - r.x0), 0.02, r.z0 + Math.random() * (r.z1 - r.z0)], i * 3);
    seeds[i] = Math.random();
  }
  geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
  geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
  geo.instanceCount = count;
  const uniforms = { uTime: { value: 0 }, uAlpha: { value: 1 } };
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uAlpha: uniforms.uAlpha, uMax: { value: maxSize } },
    vertexShader: /* glsl */ `
      attribute vec3 aOffset; attribute float aSeed; uniform float uTime; uniform float uMax; varying float vLife;
      void main() {
        float life = fract(uTime * (1.4 + aSeed * 0.8) + aSeed * 7.0);
        vLife = life;
        float s = 0.04 + (uMax - 0.04) * life;
        vec3 p = aOffset + position * s;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uAlpha; varying float vLife;
      void main() { gl_FragColor = vec4(0.75, 0.85, 1.0, (1.0 - vLife) * (1.0 - vLife) * 0.8 * uAlpha); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return { mesh, uniforms };
}
