// Full wiring check over dist/: links, assets, anchors, base path, h1, titles, canonical, hreflang symmetry, sitemap, JSON-LD.
// Usage: node scripts/check-wiring.mjs   (set SITE_URL to match the build, e.g. SITE_URL=https://flounion.com)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const DIST = resolve('dist');
const _u = new URL(process.env.SITE_URL || 'https://lildaddy850.github.io/flo-union');
const BASE = _u.pathname.replace(/\/$/, '');
const SITE = _u.origin;
const problems = [];
const note = (s) => problems.push(s);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}
const pages = walk(DIST).map((p) => p.replace(/\\/g, '/'));
const pathOf = (file) => '/' + relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '');
const pageByPath = new Map(pages.map((f) => [pathOf(f), f]));

function resolveLocal(url) {
  const [pathPart, anchor] = url.split('#');
  if (!pathPart) return { exists: true, anchor };
  if (BASE && !pathPart.startsWith(BASE + '/') && pathPart !== BASE) return { exists: false, missingBase: true, anchor };
  const rel = pathPart.slice(BASE.length) || '/';
  const file = rel.endsWith('/') ? join(DIST, rel, 'index.html') : join(DIST, rel);
  return { file, exists: existsSync(file), anchor };
}

const titles = new Map();
const descs = new Map();
const hreflangs = new Map();
const externals = new Set();
let links = 0, assets = 0, anchorsChecked = 0;

for (const file of pages) {
  const path = pathOf(file);
  if (path === '/intro-lab/') continue;
  const html = readFileSync(file, 'utf8');
  const is404 = path === '/404.html';
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) note(`${path}: ${h1s} h1 elements`);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) note(`${path}: no title`); else { if (titles.has(title)) note(`${path}: duplicate title with ${titles.get(title)}`); titles.set(title, path); if (title.length > 70) note(`${path}: title ${title.length} chars`); }
  if (!desc) note(`${path}: no description`); else { if (descs.has(desc)) note(`${path}: duplicate description with ${descs.get(desc)}`); descs.set(desc, path); if (!is404 && (desc.length > 160 || desc.length < 70)) note(`${path}: description ${desc.length} chars`); }
  const lang = (html.match(/<html lang="([a-z]+)"/) || [])[1];
  const expectLang = path.startsWith('/es/') ? 'es' : 'en';
  if (!is404 && lang !== expectLang) note(`${path}: html lang ${lang}, expected ${expectLang}`);
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  if (is404) {
    if (canonical) note('404: has canonical');
    if (!/name="robots" content="noindex"/.test(html)) note('404: missing noindex');
  } else {
    const expected = SITE + BASE + path;
    if (canonical !== expected) note(`${path}: canonical ${canonical} != ${expected}`);
    const hl = {};
    for (const m of html.matchAll(/<link rel="alternate" hreflang="([a-z-]+)" href="([^"]*)"/g)) hl[m[1]] = m[2];
    if (!hl.en || !hl.es || !hl['x-default']) note(`${path}: hreflang incomplete ${JSON.stringify(hl)}`);
    hreflangs.set(path, hl);
    const ogUrl = (html.match(/<meta property="og:url" content="([^"]*)"/) || [])[1];
    if (ogUrl !== expected) note(`${path}: og:url ${ogUrl}`);
    const ogImg = (html.match(/<meta property="og:image" content="([^"]*)"/) || [])[1];
    if (!ogImg || !ogImg.startsWith(SITE + BASE + '/')) note(`${path}: og:image ${ogImg}`);
    else if (!existsSync(join(DIST, ogImg.slice((SITE + BASE).length)))) note(`${path}: og:image file missing ${ogImg}`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); const s = JSON.stringify(j); if (/null|undefined|""/.test(s)) note(`${path}: JSON-LD has empty/null value`); } catch (e) { note(`${path}: invalid JSON-LD (${e.message})`); }
  }
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const urls = [];
  for (const m of html.matchAll(/\s(?:href|src|poster)="([^"]*)"/g)) urls.push(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]*)"/g)) for (const part of m[1].split(',')) urls.push(part.trim().split(/\s+/)[0]);
  for (const m of html.matchAll(/url\(([^)]+)\)/g)) urls.push(m[1].replace(/["']/g, ''));
  for (const u of urls) {
    if (!u || u.startsWith('data:') || u.startsWith('mailto:') || u.startsWith('tel:') || u.startsWith('sms:')) continue;
    if (/^https?:\/\//.test(u)) { externals.add(u.replace(/^(https?:\/\/[^/]+).*/, '$1')); continue; }
    if (u.startsWith('#')) { anchorsChecked++; if (u !== '#' && !ids.has(u.slice(1))) note(`${path}: missing anchor ${u}`); continue; }
    const r = resolveLocal(u);
    if (r.missingBase) { note(`${path}: link without base: ${u}`); continue; }
    if (!r.exists) { note(`${path}: broken ${u}`); continue; }
    if (u.includes('/_astro/') || /\.(webp|jpg|png|svg|mp4|woff2|css|js|xml|txt)$/.test(u)) assets++; else links++;
    if (r.anchor) { anchorsChecked++; const target = readFileSync(r.file, 'utf8'); if (!new RegExp(`\\sid="${r.anchor}"`).test(target)) note(`${path}: anchor #${r.anchor} missing on ${u}`); }
  }
  for (const m of html.matchAll(/href="(tel|sms):([^"]*)"/g)) if (m[2] !== '+16892677320') note(`${path}: odd ${m[1]} link ${m[2]}`);
  if (/TODO_JAY|\[object Object\]|undefined|NaN/.test(html)) note(`${path}: placeholder text leaked`);
}
for (const [path, hl] of hreflangs) {
  for (const k of ['en', 'es', 'x-default']) {
    const t = hl[k]; if (!t) continue;
    const tPath = t.slice((SITE + BASE).length);
    if (!pageByPath.has(tPath)) { note(`${path}: hreflang ${k} -> ${tPath} does not exist`); continue; }
    const back = hreflangs.get(tPath);
    if (back && back[path.startsWith('/es/') ? 'es' : 'en'] !== SITE + BASE + path) note(`${path}: hreflang not symmetric with ${tPath}`);
  }
}
const sm = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
const locs = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
for (const path of pageByPath.keys()) { if (path === '/404.html' || path === '/intro-lab/') continue; const u = SITE + BASE + path; if (!locs.has(u)) note(`sitemap missing ${u}`); }
for (const u of locs) { const p = u.slice((SITE + BASE).length); if (!pageByPath.has(p)) note(`sitemap extra ${u}`); }
const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
if (!robots.includes(`Sitemap: ${SITE}${BASE}/sitemap-index.xml`)) note('robots.txt sitemap line does not match the site URL');
console.log(`site ${SITE}${BASE} · pages ${pages.length}, links ${links}, assets ${assets}, anchors ${anchorsChecked}, sitemap ${locs.size}, externals: ${[...externals].join(', ') || 'none'}`);
console.log(problems.length ? problems.map((p) => 'PROBLEM ' + p).join('\n') : 'ALL CLEAR');
process.exit(problems.length ? 1 : 0);
