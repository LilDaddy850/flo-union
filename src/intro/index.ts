import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createStage } from './scene';
import { buildHouse } from './house';
import { makeBeats, placeCamera } from './camera';
import { createRain } from './rain';
import { createGutterWater, createDownspoutWater, createEaveSheet, createSplashes, createOutflow, createRoofRunoff } from './water';

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
  const outflow = createOutflow(house, phone);
  const runoff = createRoofRunoff(house);
  stage.scene.add(rain.mesh, water.mesh, tubeWater.mesh, sheet.mesh, splashes.mesh, outflow.group, runoff.mesh);
  // everything the gutter brings with it rides in the gutter group so the whole assembly slides in as one piece
  house.gutter.attach(tubeWater.mesh);
  house.gutter.attach(outflow.group);
  house.gutter.attach(water.mesh);
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

  // CSS smooth scrolling fights ScrollTrigger's snap tween (worst on iOS Safari): keep native scrolling instant while the intro exists.
  const html = document.documentElement;
  const prevScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';

  const BEATS = [0, 0.5, 1];
  let restBeat = 0;
  // Pure: the beat we last rested on decides the target; it only advances once a snap has actually finished,
  // so a hard flick (or several snap evaluations in a row) can never skip a beat.
  const snapTarget = (value: number): number => {
    if (value > restBeat + 0.04) return BEATS.find((b) => b > restBeat) ?? 1;
    if (value < restBeat - 0.04) return [...BEATS].reverse().find((b) => b < restBeat) ?? 0;
    return restBeat;
  };
  const settle = (progress: number) => { restBeat = BEATS.reduce((a, b) => (Math.abs(b - progress) < Math.abs(a - progress) ? b : a), 0); };
  ScrollTrigger.config({ ignoreMobileResize: true });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.1,
      // Deterministic snapping: a forward flick always lands on the NEXT beat, a backward one on the PREVIOUS beat,
      // judged against the beat we last rested on, never from momentary scroll velocity (which can read backwards on
      // iOS momentum scrolling and throw the visitor back to the top).
      // Slow, deliberate: each swipe plays out over about a second and a half so the animation can be watched.
      snap: { snapTo: (value: number) => snapTarget(value), duration: { min: 1.2, max: 1.8 }, delay: 0.1, ease: 'power1.inOut', onComplete: (self) => settle(self.progress) },
      onLeave: () => settle(1),
      onLeaveBack: () => settle(0),
      invalidateOnRefresh: true,
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
    // the gutter slides in along the eave in one piece, the sheeting stops, the channel fills, water leaves the downspout
    const slide = smooth(0.2, 0.43, t);
    house.gutter.position.x = gutterHomeX - (1 - slide) * (house.gutterLength + 5);
    const sheetA = 1 - smooth(0.36, 0.5, t);
    sheet.uniforms.uAlpha.value = sheetA;
    splashes.uniforms.uAlpha.value = sheetA;
    water.uniforms.uFill.value = smooth(0.44, 0.58, t);
    runoff.uniforms.uAlpha.value = smooth(0.43, 0.55, t);
    const out = smooth(0.4, 0.5, t);
    for (const u of outflow.uniforms) u.uFill.value = out;
    outflow.splashes.uniforms.uAlpha.value = out;
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
    const fov = baseFov() + tunnel * 28 + 7 * pulse(0.3, 0.46, 0.54, 0.7, state.t);
    if (Math.abs(stage.camera.fov - fov) > 0.01) { stage.camera.fov = fov; stage.camera.updateProjectionMatrix(); }
    applyStory(state.t, dive, tunnel);
    stage.camera.updateMatrixWorld();
    rain.update(time, stage.camera);
    water.uniforms.uTime.value = time;
    tubeWater.uniforms.uTime.value = time;
    for (const u of outflow.uniforms) u.uTime.value = time;
    outflow.splashes.uniforms.uTime.value = time;
    sheet.uniforms.uTime.value = time;
    runoff.uniforms.uTime.value = time;
    splashes.uniforms.uTime.value = time;
    stage.renderer.render(stage.scene, stage.camera);
    if (!ready) { ready = true; overlays.onReady?.(); }
    if (overlays.hud) overlays.hud.textContent = `t ${state.t.toFixed(3)}`;
  };
  // compile every shader before the first frame so the first paint does not stall the main thread
  placeCamera(stage.camera, paths, state.t, 0);
  stage.camera.updateMatrixWorld();
  stage.renderer.compileAsync(stage.scene, stage.camera).then(loop, loop);

  // Resize: the renderer and camera always follow the canvas. ScrollTrigger is only refreshed when the WIDTH changes
  // (orientation / window resize). Height-only changes are the phone browser toolbar showing and hiding mid-scroll;
  // refreshing then restores a stale scroll position and throws the visitor back up the page (seen on iOS Safari).
  let lastW = canvas.clientWidth;
  let refreshTimer = 0;
  const ro = new ResizeObserver(() => {
    stage.resize();
    paths = makeBeats(house, portrait());
    const w = canvas.clientWidth;
    if (w !== lastW) {
      lastW = w;
      clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => { if (!ScrollTrigger.isScrolling()) ScrollTrigger.refresh(); }, 250);
    }
  });
  ro.observe(canvas);

  return {
    state,
    setT: (t) => { locked = true; state.t = t; },
    destroy: () => {
      cancelAnimationFrame(raf); clearTimeout(refreshTimer); ro.disconnect(); io.disconnect();
      tl.scrollTrigger?.kill(); tl.kill(); stage.dispose();
      html.style.scrollBehavior = prevScrollBehavior;
    },
  };
}
