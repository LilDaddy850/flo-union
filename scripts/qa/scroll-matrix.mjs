// Cross-engine scroll test of the home-page intro.
// Usage: node scripts/qa/scroll-matrix.mjs <url>   (needs: npm i --no-save playwright && npx playwright install webkit chromium firefox)
// Engines: WebKit (iPhone 13, iPad Mini, desktop Safari-like), Chromium (Pixel 5, Galaxy S9+, desktop), Firefox (desktop).
// Passes when every forward flick lands on the next beat, a backward flick returns to the previous one, scrolling on into the
// site never jumps backward, viewport height changes (phone toolbar) leave scroll alone, and there are no console errors.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { webkit, chromium, firefox, devices } = require('playwright');
const url = process.argv[2] || 'http://localhost:4321/flo-union/';
const shots = process.argv[3] || '';

const cases = [
  { name: 'webkit-iphone13', engine: webkit, ctx: { ...devices['iPhone 13'] } },
  { name: 'webkit-ipad-mini', engine: webkit, ctx: { ...devices['iPad Mini'] } },
  { name: 'webkit-desktop', engine: webkit, ctx: { viewport: { width: 1440, height: 900 } } },
  { name: 'chromium-pixel5', engine: chromium, ctx: { ...devices['Pixel 5'] } },
  { name: 'chromium-galaxy-s9', engine: chromium, ctx: { ...devices['Galaxy S9+'] } },
  { name: 'chromium-desktop', engine: chromium, ctx: { viewport: { width: 1280, height: 800 } } },
  { name: 'firefox-desktop', engine: firefox, ctx: { viewport: { width: 1280, height: 800 } } },
];

const results = [];
for (const c of cases) {
  let browser;
  const r = { name: c.name, errors: [] };
  try {
    browser = await c.engine.launch();
    const ctx = await browser.newContext(c.ctx);
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') r.errors.push(m.text().slice(0, 160)); });
    page.on('pageerror', (e) => r.errors.push('pageerror: ' + e.message.slice(0, 160)));
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(6000);
    Object.assign(r, await page.evaluate(() => {
      const s = document.getElementById('intro');
      return { live: s.classList.contains('is-live'), off: s.classList.contains('intro-off'), gl: !!document.createElement('canvas').getContext('webgl2'), inner: innerHeight, callVisible: [...document.querySelectorAll('.sticky-bar .call, .head-actions .call')].some((el) => { const b = el.getBoundingClientRect(); return getComputedStyle(el).display !== 'none' && b.width > 0 && b.top < innerHeight; }) };
    }));
    const prog = () => page.evaluate(() => { const s = document.getElementById('intro'); return { y: Math.round(scrollY), p: Math.round((scrollY - s.offsetTop) / (s.offsetHeight - innerHeight) * 100) / 100 }; });
    const flick = async (px) => {
      await page.evaluate(async (px) => { const steps = 24; const per = px / steps; for (let i = 0; i < steps; i++) { window.scrollBy(0, per * (1 - i / steps) * 1.6); await new Promise((r) => requestAnimationFrame(r)); await new Promise((r) => setTimeout(r, 16)); } }, px);
      const s = []; for (let i = 0; i < 18; i++) { await page.waitForTimeout(220); s.push((await prog()).p); }
      return s;
    };
    const vh = r.inner;
    r.flick1 = await flick(vh * 0.8);
    r.flick2 = await flick(vh * 0.8);
    r.flickBack = await flick(-vh * 0.6);
    r.flick3 = await flick(vh * 0.9);
    r.flick4 = await flick(vh * 1.2);
    const trail = [];
    for (let i = 0; i < 5; i++) { await page.evaluate(() => window.scrollBy(0, 500)); await page.waitForTimeout(300); trail.push((await prog()).y); }
    const before = (await prog()).y;
    const vp = page.viewportSize();
    await page.setViewportSize({ width: vp.width, height: vp.height - 120 }); await page.waitForTimeout(500); r.afterShrink = (await prog()).y;
    await page.setViewportSize({ width: vp.width, height: vp.height }); await page.waitForTimeout(500); r.afterGrow = (await prog()).y;
    r.jumpedBack = trail.some((y, i) => i > 0 && y < trail[i - 1] - 50) || r.afterShrink < before - 50 || r.afterGrow < before - 50;
    r.beats = { afterFlick1: r.flick1.at(-1), afterFlick2: r.flick2.at(-1), afterBack: r.flickBack.at(-1), afterFlick3: r.flick3.at(-1), afterFlick4: r.flick4.at(-1) };
    if (shots) await page.screenshot({ path: `${shots}/${c.name}.png` });
    await browser.close();
  } catch (e) { r.fail = String(e).slice(0, 200); try { await browser?.close(); } catch {} }
  const ok = r.live && !r.off && !r.jumpedBack && r.errors.length === 0 && r.beats && r.beats.afterFlick1 === 0.5 && r.beats.afterFlick2 === 1 && r.beats.afterBack === 0.5 && r.beats.afterFlick3 === 1 && r.beats.afterFlick4 > 1;
  results.push({ name: c.name, ok, live: r.live, gl: r.gl, callVisible: r.callVisible, beats: r.beats, jumpedBack: r.jumpedBack, errors: r.errors, fail: r.fail });
  console.log(JSON.stringify(results.at(-1)));
}
console.log('SUMMARY ' + results.map((r) => `${r.name}:${r.ok ? 'PASS' : 'FAIL'}`).join(' '));
process.exit(results.every((r) => r.ok) ? 0 : 1);
