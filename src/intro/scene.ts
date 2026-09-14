import * as THREE from 'three';
import { C } from './palette';
import { glowSprite } from './house';

export type Stage = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  moon: THREE.DirectionalLight;
  resize: () => void;
  dispose: () => void;
};

const skyVert = /* glsl */ `
  varying vec3 vWorld;
  void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`;
const skyFrag = /* glsl */ `
  uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; varying vec3 vWorld;
  void main() {
    float h = clamp(vWorld.y / 80.0, 0.0, 1.0);
    vec3 c = h < 0.22 ? mix(horizon, mid, smoothstep(0.0, 0.22, h)) : mix(mid, top, smoothstep(0.22, 1.0, h));
    gl_FragColor = vec4(c, 1.0);
  }
`;

export function createStage(canvas: HTMLCanvasElement): Stage {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  const phone = matchMedia('(max-width: 899px)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, phone ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(C.fog, 0.021);

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(160, 24, 12),
    new THREE.ShaderMaterial({
      uniforms: { top: { value: new THREE.Color(0x070d22) }, mid: { value: new THREE.Color(0x141c3a) }, horizon: { value: new THREE.Color(0x3a3454) } },
      vertexShader: skyVert, fragmentShader: skyFrag, side: THREE.BackSide, depthWrite: false,
    }),
  );
  scene.add(sky);

  // stars: only high in the dome, unfogged
  const starCount = 600;
  const sp = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const a = Math.random() * Math.PI * 2, e = 0.18 + Math.random() * 0.75;
    const r = 150;
    sp.set([r * Math.cos(e) * Math.cos(a), r * Math.sin(e), r * Math.cos(e) * Math.sin(a)], i * 3);
  }
  const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xcfd8ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.75, fog: false, depthWrite: false }));
  scene.add(stars);

  // moon disc + halo, behind the house to the upper left
  const moonDisc = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 12), new THREE.MeshBasicMaterial({ color: 0xeef2ff, fog: false }));
  moonDisc.position.set(54, 36, -127);
  const moonHalo = glowSprite(0xaebcff, 34, 0.35);
  moonHalo.position.copy(moonDisc.position);
  scene.add(moonDisc, moonHalo);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.02, 400);

  // key light from the front-left and high, so the front wall and roof slope catch it
  const moon = new THREE.DirectionalLight(C.moon, 1.9);
  moon.position.set(-10, 17, 13);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  moon.shadow.camera.left = -16; moon.shadow.camera.right = 16; moon.shadow.camera.top = 16; moon.shadow.camera.bottom = -16;
  moon.shadow.camera.near = 1; moon.shadow.camera.far = 60;
  moon.shadow.bias = -0.0006; moon.shadow.normalBias = 0.03; moon.shadow.radius = 3;
  scene.add(moon, moon.target);
  const hemi = new THREE.HemisphereLight(0x4a5a8c, 0x252d28, 1.35);
  scene.add(hemi);

  const resize = () => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = h > w ? 56 : 42;
    camera.updateProjectionMatrix();
  };
  resize();

  const dispose = () => { renderer.dispose(); };
  return { renderer, scene, camera, moon, resize, dispose };
}
