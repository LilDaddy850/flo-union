import * as THREE from 'three';

export type Rain = { mesh: THREE.Mesh; update: (time: number, camera: THREE.Camera) => void; material: THREE.ShaderMaterial };

const vert = /* glsl */ `
  attribute vec3 aOffset;
  attribute float aSeed;
  uniform float uTime; uniform float uHeight; uniform float uSpeed; uniform vec3 uRight; uniform vec2 uWind; uniform float uLen; uniform float uWidth;
  varying float vFade; varying vec2 vUv;
  void main() {
    vUv = uv;
    float speed = uSpeed * (0.85 + 0.3 * aSeed);
    float y = mod(aOffset.y - uTime * speed + aSeed * uHeight, uHeight);
    vec3 fall = normalize(vec3(uWind.x, -1.0, uWind.y));
    vec3 base = vec3(aOffset.x + uWind.x * (uHeight - y), y, aOffset.z + uWind.y * (uHeight - y));
    float len = uLen * (0.7 + 0.6 * aSeed);
    vec3 p = base + uRight * (position.x * uWidth) - fall * (position.y * len);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float d = length(mv.xyz);
    vFade = smoothstep(60.0, 8.0, d) * smoothstep(0.0, 1.2, d);
    gl_Position = projectionMatrix * mv;
  }
`;
const frag = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity; varying float vFade; varying vec2 vUv;
  void main() {
    float a = (1.0 - abs(vUv.y - 0.5) * 2.0) * (1.0 - abs(vUv.x - 0.5) * 1.2);
    gl_FragColor = vec4(uColor, a * uOpacity * vFade);
  }
`;

export function createRain(count: number, region = { x: 36, z: 34, cx: 0, cz: 3 }, height = 18): Rain {
  const base = new THREE.PlaneGeometry(1, 1);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index; geo.attributes.position = base.attributes.position; geo.attributes.uv = base.attributes.uv;
  const offsets = new Float32Array(count * 3), seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    offsets.set([region.cx + (Math.random() - 0.5) * region.x, Math.random() * height, region.cz + (Math.random() - 0.5) * region.z], i * 3);
    seeds[i] = Math.random();
  }
  geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
  geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
  geo.instanceCount = count;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uHeight: { value: height }, uSpeed: { value: 11 }, uRight: { value: new THREE.Vector3(1, 0, 0) },
      uWind: { value: new THREE.Vector2(0.12, 0.04) }, uLen: { value: 0.55 }, uWidth: { value: 0.014 },
      uColor: { value: new THREE.Color(0xaebcd8) }, uOpacity: { value: 0.42 },
    },
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.frustumCulled = false;
  const right = new THREE.Vector3();
  const update = (time: number, camera: THREE.Camera) => {
    material.uniforms.uTime.value = time;
    right.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize();
    material.uniforms.uRight.value.copy(right);
  };
  return { mesh, update, material };
}
