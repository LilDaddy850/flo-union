import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createStage } from './scene';
import { buildHouse } from './house';
import { makeBeats, placeCamera } from './camera';
import { createRain } from './rain';
import { createGutterWater, createDownspoutWater, createEaveSheet, createSplashes } from './water';

gsap.registerPlugin(ScrollTrigger);

export type Overlays = { cap1?: HTMLElement | null; cap2?: HTMLElement | null; fade?: HTMLElement | null; hint?: HTMLElement | null; hud?: HTMLElement | null; onReady?: () => void };
export type IntroHandle = { setT: (t: number) => void; state: { t: number }; destroy: () => void };

const smooth = (a: number, b: number, x: number) => { const k = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
const pulse = (a: number, b: number, c: number, d: number, x: number) => smooth(a, b, x) * (1 - smooth(c, d, x));

export function startIntro(container: HTMLElement, canvas: HTMLCanvasElement, overlays: Overlays = {}): IntroHandle {
  const stage = createStage(canvas);
  const house = buildHouse();
  stage.scene.add(house.group);
  stage.moon.target.position.set(0, 2, 0);

  const phone = matchMedia('(max-width: 899px)').matches;
  const rain = createRain(phone ? 1600 : 3200);
  const water = createGutterWater(house);
  const tubeWater = createDownspoutWater(house);
  const sheet = createEaveSheet(house);
  const splashes = createSplashes(house, phone ? 100 : 160);
  stage.scene.add(rain.mesh, water.mesh, tubeWater.mesh, sheet.mesh, splashes.mesh);
  const gutterHomeX = house.gutter.position.x;
  const baseFov = () => (canvas.clientHeight > canvas.clientWidth ? 56 : 42);

  // a small lamp that rides with the camera so the inside of the downspout is visible
  const lamp = new THREE.PointLight(0x9fb4d8, 0, 1.6, 2);
  stage.camera.add(lamp);
  stage.scene.add(stage.camera);

  const portrait = () => canvas.clientHeight > canvas.clientWidth;
  let paths = makeBeats(house, portrait());
  const state = { t: 0 };
  let locked = false;

  ScrollTrigger.config({ ignoreMobileResize: true });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      snap: { snapTo: 'labels', duration: { min: 0.25, max: 0.7 }, delay: 0.05, ease: 'power2.inOut', directional: true },
      invalidateOnRefresh: true,
      onToggle: (self) => { document.documentElement.style.scrollBehavior = self.isActive ? 'auto' : ''; },
    },
  });
  const proxy = { t: 0 };
  tl.addLabel('storm', 0)
    .to(proxy, { t: 0.5, duration: 1, ease: 'power2.inOut', onUpdate: () => { if (!locked) state.t = proxy.t; } }, 0)
    .addLabel('gutter', 1)
    .to(proxy, { t: 1, duration: 1, ease: 'power1.in', onUpdate: () => { if (!locked) state.t = proxy.t; } }, 1)
    .addLabel('dive', 2);

  const timer = new THREE.Timer();
  let raf = 0;
  let ready = false;
  let visible = true;
  const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0 });
  io.observe(container);

  const setOpacity = (el: HTMLElement | null | undefined, v: number) => { if (el) el.style.opacity = v.toFixed(3); };

  const applyStory = (t: number, dive: number, tunnel: number) => {
    // the gutter slides in along the eave in one piece, the sheeting stops, the channel fills
    const slide = smooth(0.2, 0.43, t);
    house.gutter.position.x = gutterHomeX - (1 - slide) * (house.gutterLength + 5);
    const sheetA = 1 - smooth(0.36, 0.5, t);
    sheet.uniforms.uAlpha.value = sheetA;
    splashes.uniforms.uAlpha.value = sheetA;
    water.uniforms.uFill.value = smooth(0.44, 0.58, t);
    lamp.intensity = tunnel > 0 ? 2.4 : dive * 0.8;
    setOpacity(overlays.cap1, pulse(0.02, 0.1, 0.16, 0.26, t));
    setOpacity(overlays.hint, 1 - smooth(0.01, 0.06, t));
    setOpacity(overlays.cap2, pulse(0.41, 0.49, 0.6, 0.68, t));
    // a black dip hides the outlet lip as the camera passes through it, then the tunnel fades to black at the end
    setOpacity(overlays.fade, Math.max(pulse(0.785, 0.815, 0.83, 0.86, t), smooth(0.955, 1.0, t)));
  };

  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    timer.update();
    const time = timer.getElapsed();
    const { dive, tunnel } = placeCamera(stage.camera, paths, state.t, time);
    const fov = baseFov() + tunnel * 28;
    if (Math.abs(stage.camera.fov - fov) > 0.01) { stage.camera.fov = fov; stage.camera.updateProjectionMatrix(); }
    applyStory(state.t, dive, tunnel);
    stage.camera.updateMatrixWorld();
    rain.update(time, stage.camera);
    water.uniforms.uTime.value = time;
    tubeWater.uniforms.uTime.value = time;
    sheet.uniforms.uTime.value = time;
    splashes.uniforms.uTime.value = time;
    stage.renderer.render(stage.scene, stage.camera);
    if (!ready) { ready = true; overlays.onReady?.(); }
    if (overlays.hud) overlays.hud.textContent = `t ${state.t.toFixed(3)}`;
  };
  // compile every shader before the first frame so the first paint does not stall the main thread
  placeCamera(stage.camera, paths, state.t, 0);
  stage.camera.updateMatrixWorld();
  stage.renderer.compileAsync(stage.scene, stage.camera).then(loop, loop);

  const ro = new ResizeObserver(() => { stage.resize(); paths = makeBeats(house, portrait()); ScrollTrigger.refresh(); });
  ro.observe(canvas);

  return {
    state,
    setT: (t) => { locked = true; state.t = t; },
    destroy: () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); tl.scrollTrigger?.kill(); tl.kill(); stage.dispose(); },
  };
}
