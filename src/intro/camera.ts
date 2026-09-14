import * as THREE from 'three';
import type { HouseParts } from './house';

export type Paths = { a: THREE.CatmullRomCurve3; la: THREE.CatmullRomCurve3; b: THREE.CatmullRomCurve3; lb: THREE.CatmullRomCurve3; approach: THREE.CatmullRomCurve3; tunnel: THREE.CatmullRomCurve3 };

/**
 * Beats: 0 wide storm shot · 0.5 the corner: gutter with water, the whole downspout, water leaving at the bottom ·
 * 0.72–0.82 nose into the outlet · 0.83–0.96 riding down the pipe.
 */
export function makeBeats(h: HouseParts, portrait: boolean): Paths {
  const o = h.outlet;
  const ch = h.gutterChannel;
  const land = h.downspoutCurve.getPointAt(1);
  const pos = portrait
    ? [new THREE.Vector3(-6, 4.6, 24), new THREE.Vector3(-3, 4.8, 13), new THREE.Vector3(o.x - 1.7, ch.y + 2.5, ch.z + 3.0), new THREE.Vector3(o.x - 0.3, o.y + 0.36, o.z + 0.42)]
    : [new THREE.Vector3(-15.5, 4.4, 16), new THREE.Vector3(-5, 4.8, 11), new THREE.Vector3(o.x - 2.7, ch.y + 2.4, ch.z + 2.9), new THREE.Vector3(o.x - 0.32, o.y + 0.34, o.z + 0.42)];
  const look = portrait
    ? [new THREE.Vector3(0.3, 2.4, 0), new THREE.Vector3(1.5, 3.0, 2), new THREE.Vector3(o.x - 0.2, ch.y - 1.05, land.z * 0.55 + ch.z * 0.45), new THREE.Vector3(o.x, o.y - 0.08, o.z)]
    : [new THREE.Vector3(1.2, 2.5, 0), new THREE.Vector3(1.5, 3.0, 2.5), new THREE.Vector3(o.x - 0.2, ch.y - 1.0, land.z * 0.55 + ch.z * 0.45), new THREE.Vector3(o.x, o.y - 0.08, o.z)];
  const a = new THREE.CatmullRomCurve3([pos[0], pos[1], pos[2]], false, 'centripetal');
  const la = new THREE.CatmullRomCurve3([look[0], look[1], look[2]], false, 'centripetal');
  const b = new THREE.CatmullRomCurve3([pos[2], new THREE.Vector3(o.x - 1.2, o.y + 0.9, o.z + 1.4), pos[3]], false, 'centripetal');
  const lb = new THREE.CatmullRomCurve3([look[2], new THREE.Vector3(o.x - 0.4, o.y - 0.3, o.z), look[3]], false, 'centripetal');
  const c = h.downspoutCurve;
  const approach = new THREE.CatmullRomCurve3([pos[3], new THREE.Vector3(o.x, o.y + 0.02, o.z)], false, 'centripetal');
  const tunnel = c; // ride the real centreline
  return { a, la, b, lb, approach, tunnel };
}

const tmpP = new THREE.Vector3(), tmpL = new THREE.Vector3();
export const DIVE_START = 0.72;
export const TUNNEL_START = 0.82;

export type CamPhase = { dive: number; tunnel: number };

/** Places the camera for t in [0, 1]. Returns dive (0..1 from the outlet approach on) and tunnel (0..1 inside the pipe). */
export function placeCamera(camera: THREE.PerspectiveCamera, paths: Paths, t: number, time: number): CamPhase {
  const u = THREE.MathUtils.clamp(t, 0, 1);
  let dive = 0, tunnel = 0;
  if (u <= 0.5) {
    const k = u * 2;
    paths.a.getPointAt(k, tmpP); paths.la.getPointAt(k, tmpL);
  } else if (u <= DIVE_START) {
    const k = (u - 0.5) / (DIVE_START - 0.5);
    paths.b.getPointAt(k, tmpP); paths.lb.getPointAt(k, tmpL);
  } else if (u <= TUNNEL_START) {
    dive = (u - DIVE_START) / (TUNNEL_START - DIVE_START);
    const k = dive * dive;
    paths.approach.getPointAt(k, tmpP);
    tmpL.set(paths.approach.getPointAt(1).x, paths.approach.getPointAt(1).y - 0.3, paths.approach.getPointAt(1).z);
  } else {
    dive = 1;
    tunnel = (u - TUNNEL_START) / (1 - TUNNEL_START);
    const s = 0.1 + tunnel * 0.46;
    paths.tunnel.getPointAt(s, tmpP);
    paths.tunnel.getPointAt(Math.min(0.62, s + 0.035), tmpL);
  }
  const drift = dive > 0 ? 0 : 0.035 * (1 - u);
  tmpP.x += Math.sin(time * 0.35) * drift;
  tmpP.y += Math.sin(time * 0.27 + 1.3) * drift * 0.6;
  camera.position.copy(tmpP);
  camera.lookAt(tmpL);
  if (tunnel > 0) camera.rotateZ(tunnel * 1.4 + Math.sin(time * 0.8) * 0.1);
  return { dive, tunnel };
}
