// Verifies the generated content: no original menu destination lost, every internal link resolves.
import fs from 'node:fs';
import { routeHash } from './route-hash.mjs';

const manifest = JSON.parse(fs.readFileSync('public/content/manifest.json', 'utf8'));
const news = JSON.parse(fs.readFileSync('public/content/news.json', 'utf8'));
const nav = JSON.parse(fs.readFileSync('src/content/navigation.json', 'utf8'));
const aliases = JSON.parse(fs.readFileSync('src/content/aliases.json', 'utf8'));
const home = JSON.parse(fs.readFileSync('src/content/home.json', 'utf8'));

const APP_ROUTES = new Set(['/', '/search', ...manifest.map(m => m.r)]);
const errors = [];
const stripHash = r => r.split('#')[0];
const resolves = r => APP_ROUTES.has(stripHash(r)) || stripHash(r) in aliases;

function walk(nodes, fn, trail = []) {
  for (const n of nodes || []) {
    fn(n, [...trail, n.label]);
    walk(n.children, fn, [...trail, n.label]);
    for (const c of n.columns || []) walk(c.items, fn, [...trail, n.label, c.heading]);
  }
}

// 1. Every original menu destination is present in the curated menu.
const curatedTargets = new Set();
walk(nav.main, n => { if (n.to) curatedTargets.add(n.to); if (n.href) curatedTargets.add(n.href); });
walk(nav.raw, (n, trail) => {
  const target = n.to || n.href;
  if (target && !curatedTargets.has(target)) errors.push(`menu destination dropped: ${trail.join(' > ')} (${target})`);
});

// 2. Every internal link in navigation resolves to a route.
const checkTo = (where, to) => { if (to && !resolves(to)) errors.push(`${where}: unresolved route ${to}`); };
walk(nav.main, (n, trail) => checkTo(`nav ${trail.join(' > ')}`, n.to));
for (const f of [...nav.footer, ...nav.library]) checkTo(`footer/library ${f.label}`, f.to);
for (const n of home.latestNews) checkTo('home news', n.route);
for (const q of home.quickLinks) checkTo('home quick link', q.to);
for (const n of news) checkTo(`news ${n.id}`, n.route);

// 3. Every page file exists and its internal links resolve.
const kinds = {};
let internalLinks = 0, officialFiles = 0, external = 0;
for (const m of manifest) {
  const f = `public/content/p/${routeHash(m.r)}.json`;
  if (!fs.existsSync(f)) { errors.push(`missing page file for ${m.r}`); continue; }
  const p = JSON.parse(fs.readFileSync(f, 'utf8'));
  kinds[p.kind] = (kinds[p.kind] || 0) + 1;
  const html = [p.bodyHtml || '', ...(p.items || []).map(i => i.a || '')].join('');
  for (const [, href] of html.matchAll(/<a href="([^"]+)"[^>]*data-internal/g)) { internalLinks++; checkTo(`page ${m.r}`, decodeEntities(href)); }
  for (const [, href] of html.matchAll(/<a href="(https?:[^"]+)"/g)) {
    if (/ipc\.gov\.in/.test(href)) officialFiles++; else external++;
  }
  for (const r of p.rows || []) if (r.internal) checkTo(`register ${m.r}`, r.href);
  for (const a of p.albums || []) checkTo(`gallery ${m.r}`, a.route);
  for (const l of p.links || []) checkTo(`links ${m.r}`, l.to);
  for (const c of p.crumbs || []) checkTo(`crumb ${m.r}`, c.href);
}

function decodeEntities(s) { return s.replace(/&amp;/g, '&'); }

// 4. Routes hard-coded in the app source (config, sections, templates) must exist.
const srcFiles = [];
(function walkDir(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (e.name !== 'content') walkDir(p); }
    else if (/\.(ts|tsx)$/.test(e.name)) srcFiles.push(p);
  }
})('src');
let srcRoutes = 0;
for (const f of srcFiles) {
  const code = fs.readFileSync(f, 'utf8');
  for (const [, route] of code.matchAll(/\b(?:to|source|routeMap|pageRoute|releaseNews|amendments|proforma)\s*[:=]\s*\{?['"`](\/[^'"`?#]*)['"`]/g)) {
    srcRoutes++;
    if (!resolves(route)) errors.push(`${f}: route ${route} does not exist`);
  }
}

console.log('pages by kind:', kinds);
console.log(`source route literals checked: ${srcRoutes}`);
console.log(`routes ${manifest.length} · news ${news.length} · internal links ${internalLinks} · official-file links ${officialFiles} · external ${external}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors.slice(0, 60)) console.error(' -', e);
  process.exit(1);
}
console.log('content verified ✓');
