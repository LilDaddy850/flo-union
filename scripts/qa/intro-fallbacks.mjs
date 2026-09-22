// Intro fallback paths on the iPhone engine: reduced motion hides the intro; Skip works and persists for the session
// (and a reload starts at the top); hash links bypass the intro.
// Usage: node scripts/qa/intro-fallbacks.mjs <url>   (needs playwright + webkit, see scroll-matrix.mjs)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { webkit, devices } = require('playwright');
const url = process.argv[2] || 'http://localhost:4321/flo-union/';
const browser = await webkit.launch();
const R = {};
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(2500);
  R.reducedMotion = await p.evaluate(() => { const s = document.getElementById('intro'); return { display: getComputedStyle(s).display, off: s.classList.contains('intro-off'), heroTop: Math.round(document.querySelector('.hero').getBoundingClientRect().top) }; });
  await ctx.close();
}
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(5000);
  await p.tap('.intro-skip'); await p.waitForTimeout(1500);
  R.skip = await p.evaluate(() => ({ pastIntro: scrollY >= document.getElementById('intro').offsetTop + document.getElementById('intro').offsetHeight - 2, stored: sessionStorage.getItem('flo-intro') }));
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(1500);
  R.afterReload = await p.evaluate(() => ({ off: document.getElementById('intro').classList.contains('intro-off'), heroTop: Math.round(document.querySelector('.hero').getBoundingClientRect().top) }));
  await ctx.close();
}
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  await p.goto(url + '#services', { waitUntil: 'load' }); await p.waitForTimeout(2500);
  R.anchor = await p.evaluate(() => ({ off: document.getElementById('intro').classList.contains('intro-off'), servicesTop: Math.round(document.getElementById('services').getBoundingClientRect().top) }));
  await ctx.close();
}
await browser.close();
const ok = R.reducedMotion.off && R.reducedMotion.display === 'none' && R.skip.pastIntro && R.skip.stored === 'skip' && R.afterReload.off && R.afterReload.heroTop >= 0 && R.afterReload.heroTop < 120 && R.anchor.off && Math.abs(R.anchor.servicesTop) < 4;
console.log(JSON.stringify(R));
console.log(ok ? 'FALLBACKS PASS' : 'FALLBACKS FAIL');
process.exit(ok ? 0 : 1);
