import * as THREE from 'three';
import { C, toon } from './palette';

export type HouseParts = {
  group: THREE.Group;
  gutter: THREE.Group;          // the seamless gutter (channel + caps + outlet), one piece
  downspout: THREE.Mesh;
  gutterLength: number;
  eaveY: number;                // world y of the fascia top (gutter top edge)
  eaveZ: number;                // world z of the fascia front face
  gutterTopY: number;
  gutterChannel: { x0: number; x1: number; y: number; z: number }; // centreline of the water channel
  outlet: THREE.Vector3;
  downspoutCurve: THREE.CatmullRomCurve3;
  porchLight: THREE.PointLight;
};

// Metres. A modest one-storey Florida ranch, gable roof running along x, front face at +z.
export const HOUSE = { W: 10, D: 7, H: 3.2, OVER: 0.45, PITCH: Math.atan2(5, 12), ROOF_T: 0.14 };

function kProfile(): { wall: THREE.Shape; cap: THREE.Shape } {
  // (x = outward from the fascia, y = up). Real K-style proportions for a 6-inch gutter, ~12 mm wall.
  const outer: [number, number][] = [
    [0, 0.118], [0, 0], [0.105, 0], [0.125, 0.03], [0.148, 0.06], [0.132, 0.084], [0.152, 0.106], [0.152, 0.118], [0.128, 0.118],
  ];
  const inner: [number, number][] = [
    [0.128, 0.104], [0.14, 0.1], [0.12, 0.084], [0.136, 0.06], [0.113, 0.033], [0.098, 0.012], [0.012, 0.012], [0.012, 0.118],
  ];
  const wall = new THREE.Shape();
  outer.forEach(([x, y], i) => (i ? wall.lineTo(x, y) : wall.moveTo(x, y)));
  inner.forEach(([x, y]) => wall.lineTo(x, y));
  wall.closePath();
  const cap = new THREE.Shape();
  outer.forEach(([x, y], i) => (i ? cap.lineTo(x, y) : cap.moveTo(x, y)));
  cap.closePath();
  return { wall, cap };
}

/** Soft radial glow sprite (for windows, porch light, moon). */
export function glowSprite(color: number, size: number, opacity: number): THREE.Sprite {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const g = cv.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.35, 'rgba(255,255,255,0.45)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(cv);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  s.scale.setScalar(size);
  return s;
}

function palm(scale: number, lean: number): THREE.Group {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(lean * 0.25, 1.8, 0), new THREE.Vector3(lean * 0.7, 3.6, 0.1), new THREE.Vector3(lean * 1.0, 5.0, 0.15)]);
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.16, 7, false), toon(C.trunk));
  trunk.castShadow = true; trunk.receiveShadow = true;
  g.add(trunk);
  const top = curve.getPoint(1);
  const crown = new THREE.Group();
  crown.position.copy(top);
  const frondGeo = new THREE.ConeGeometry(0.34, 2.8, 4);
  frondGeo.translate(0, -1.4, 0); // hinge at the base
  frondGeo.scale(1, 1, 0.22);
  for (let i = 0; i < 9; i++) {
    const f = new THREE.Mesh(frondGeo, toon(i % 2 ? C.tree : C.treeDark));
    const a = (i / 9) * Math.PI * 2 + 0.3;
    f.rotation.y = a;
    f.rotateX(Math.PI / 2 + 0.35 + (i % 3) * 0.12); // droop
    crown.add(f);
  }
  const heart = new THREE.Mesh(new THREE.SphereGeometry(0.22, 7, 5), toon(C.treeDark));
  crown.add(heart);
  g.add(crown);
  g.scale.setScalar(scale);
  return g;
}

function oak(scale: number): THREE.Group {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 2.2, 7), toon(C.trunk));
  trunk.position.y = 1.1; trunk.castShadow = true;
  g.add(trunk);
  const blobs: [number, number, number, number][] = [[0, 3.1, 0, 1.9], [-1.2, 2.6, 0.4, 1.3], [1.1, 2.7, -0.5, 1.4], [0.2, 2.3, 1.2, 1.1]];
  blobs.forEach(([x, y, z, r], i) => {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), toon(i % 2 ? C.tree : C.treeDark));
    b.position.set(x, y, z); b.rotation.set(i, i * 0.7, 0); b.castShadow = true; b.receiveShadow = true;
    g.add(b);
  });
  g.scale.setScalar(scale);
  return g;
}

export function buildHouse(): HouseParts {
  const { W, D, H, OVER, PITCH, ROOF_T } = HOUSE;
  const g = new THREE.Group();
  const mWall = toon(C.wall), mRoof = toon(C.roof), mTrim = toon(C.trim);
  // painted aluminum: a soft specular so it reads wet under the moon
  const mGutter = new THREE.MeshPhongMaterial({ color: 0xe9e5dd, shininess: 34, specular: 0x4a5566 });

  // walls
  const walls = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), mWall);
  walls.position.y = H / 2; walls.castShadow = true; walls.receiveShadow = true;
  g.add(walls);

  // gable triangles
  const halfD = D / 2 + OVER;
  const rise = halfD * Math.tan(PITCH);
  const tri = new THREE.Shape([new THREE.Vector2(-D / 2, 0), new THREE.Vector2(D / 2, 0), new THREE.Vector2(0, rise - 0.02)]);
  const triGeo = new THREE.ExtrudeGeometry(tri, { depth: 0.04, bevelEnabled: false });
  for (const s of [-1, 1]) {
    const m = new THREE.Mesh(triGeo, mWall);
    m.rotation.y = (Math.PI / 2) * s; m.position.set(s * (W / 2 - 0.02), H, 0); m.castShadow = true;
    g.add(m);
  }

  // roof slabs + ridge
  const L = halfD / Math.cos(PITCH);
  const slabGeo = new THREE.BoxGeometry(W + 2 * OVER, ROOF_T, L);
  for (const s of [1, -1]) {
    const slab = new THREE.Mesh(slabGeo, mRoof);
    slab.rotation.x = PITCH * s;
    slab.position.set(0, H + (L / 2) * Math.sin(PITCH), s * (L / 2) * Math.cos(PITCH));
    slab.castShadow = true; slab.receiveShadow = true;
    g.add(slab);
  }
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(W + 2 * OVER + 0.04, 0.12, 0.3), mRoof);
  ridge.position.set(0, H + L * Math.sin(PITCH) + 0.02, 0);
  g.add(ridge);

  // fascia boards
  const eaveTop = H - ROOF_T / 2 + 0.01;
  const fasciaGeo = new THREE.BoxGeometry(W + 2 * OVER, 0.2, 0.04);
  for (const s of [1, -1]) {
    const f = new THREE.Mesh(fasciaGeo, mTrim);
    f.position.set(0, eaveTop - 0.1, s * (halfD + 0.02));
    f.castShadow = true;
    g.add(f);
  }
  const eaveZ = halfD + 0.04;

  // the seamless gutter: one K-profile sweep along the whole front eave, capped, with an outlet
  const gutterLength = W + 2 * OVER;
  const { wall, cap } = kProfile();
  const gutter = new THREE.Group();
  const channel = new THREE.Mesh(new THREE.ExtrudeGeometry(wall, { depth: gutterLength, bevelEnabled: false }), mGutter);
  channel.castShadow = true; channel.receiveShadow = true;
  gutter.add(channel);
  for (const end of [0, gutterLength]) {
    const c = new THREE.Mesh(new THREE.ShapeGeometry(cap), mGutter);
    c.position.z = end;
    gutter.add(c);
  }
  gutter.rotation.y = -Math.PI / 2;
  const gutterTopY = eaveTop;
  gutter.position.set(gutterLength / 2, gutterTopY - 0.118, eaveZ);
  g.add(gutter);

  const outletX = gutterLength / 2 - 0.4;
  const channelZ = eaveZ + 0.076;
  const outlet = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.16, 10), mGutter);
  outlet.position.set(outletX, gutterTopY - 0.118 - 0.07, channelZ);
  gutter.attach(outlet);

  // downspout with crisp elbows: outlet -> to the wall -> down -> away from the house
  const wallZ = D / 2 + 0.09;
  const y0 = gutterTopY - 0.118 - 0.15;
  const pts = [
    [outletX, y0, channelZ], [outletX, y0 - 0.22, channelZ], [outletX, y0 - 0.3, channelZ - 0.03],
    [outletX, y0 - 0.5, wallZ + 0.03], [outletX, y0 - 0.58, wallZ],
    [outletX, 0.62, wallZ], [outletX, 0.5, wallZ + 0.02], [outletX, 0.3, wallZ + 0.18], [outletX, 0.17, wallZ + 0.42],
    [outletX, 0.12, wallZ + 0.8], [outletX, 0.1, wallZ + 1.4],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const downspoutCurve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  const mGutterInside = new THREE.MeshPhongMaterial({ color: 0xe9e5dd, shininess: 34, specular: 0x4a5566, side: THREE.DoubleSide });
  const downspout = new THREE.Mesh(new THREE.TubeGeometry(downspoutCurve, 200, 0.056, 16, false), mGutterInside);
  downspout.castShadow = true;
  g.add(downspout);

  // windows and door
  const glass = new THREE.MeshBasicMaterial({ color: 0xffc27a });
  for (const x of [-2.9, 2.4]) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.35, 0.1), mTrim);
    frame.position.set(x, 1.75, D / 2 + 0.03);
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.1), glass);
    pane.position.set(x, 1.75, D / 2 + 0.085);
    const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, 0.02), mTrim);
    mullionV.position.set(x, 1.75, D / 2 + 0.09);
    const mullionH = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.06, 0.02), mTrim);
    mullionH.position.set(x, 1.75, D / 2 + 0.09);
    const halo = glowSprite(0xffb765, 2.2, 0.22);
    halo.position.set(x, 1.75, D / 2 + 0.3);
    g.add(frame, pane, mullionV, mullionH, halo);
  }
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.3, 0.1), mTrim);
  doorFrame.position.set(-0.2, 1.15, D / 2 + 0.03);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.15, 0.06), toon(C.door));
  door.position.set(-0.2, 1.08, D / 2 + 0.08);
  const step = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.18, 0.9), mTrim);
  step.position.set(-0.2, 0.09, D / 2 + 0.45); step.receiveShadow = true;
  const path = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 6), toon(0x474c54));
  path.position.set(-0.2, 0.025, D / 2 + 3.8); path.receiveShadow = true;
  g.add(doorFrame, door, step, path);

  // porch light: warm, no shadows, plus a soft halo
  const porchLight = new THREE.PointLight(C.glow, 4, 8, 2);
  porchLight.position.set(0.75, 2.5, D / 2 + 0.3);
  g.add(porchLight);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe9c4 }));
  lamp.position.copy(porchLight.position);
  const lampHalo = glowSprite(0xffb765, 1.6, 0.35);
  lampHalo.position.copy(porchLight.position).z += 0.15;
  g.add(lamp, lampHalo);

  // chimney
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.9, 0.8), mWall);
  chimney.position.set(3.2, H + 1.2, -1.4); chimney.castShadow = true;
  g.add(chimney);

  // ground: lighter near the house, dark at the edges (vertex colours)
  const groundGeo = new THREE.CircleGeometry(70, 96);
  const pos = groundGeo.attributes.position; const colors = new Float32Array(pos.count * 3);
  const near = new THREE.Color(0x3a4a42), far = new THREE.Color(0x141a17), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const r = Math.hypot(pos.getX(i), pos.getY(i)) / 70;
    tmp.copy(near).lerp(far, Math.min(1, Math.pow(r, 0.55)));
    colors.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  groundGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const ground = new THREE.Mesh(groundGeo, toon(0xffffff, { vertexColors: true }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  g.add(ground);

  // Florida: palms framing the shot, oaks behind
  const palms: [number, number, number, number][] = [[-13.5, 8.5, 1.4, 0.55], [12.5, 5, 1.2, -0.5], [-9, -6, 1.1, 0.3]];
  for (const [x, z, s, lean] of palms) { const p = palm(s, lean); p.position.set(x, 0, z); p.rotation.y = x * 0.9; g.add(p); }
  const oaks: [number, number, number][] = [[-11, -7, 1.5], [9, -8.5, 1.7], [14, -2, 1.2], [4, -11, 1.4], [-4, -12, 1.3]];
  for (const [x, z, s] of oaks) { const o = oak(s); o.position.set(x, 0, z); o.rotation.y = z * 0.7; g.add(o); }

  return {
    group: g,
    gutter,
    downspout,
    gutterLength,
    eaveY: eaveTop,
    eaveZ,
    gutterTopY,
    gutterChannel: { x0: -gutterLength / 2, x1: gutterLength / 2, y: gutterTopY - 0.06, z: channelZ },
    outlet: new THREE.Vector3(outletX, gutterTopY - 0.118, channelZ),
    downspoutCurve,
    porchLight,
  };
}
