// Crawls www.ipc.gov.in (English site) into .cache/raw so build.mjs can normalise it.
// The live server answers every page with HTTP 500 but a complete HTML body, so status is ignored.
//
// Usage: node scripts/content/crawl.mjs [--refresh] [--seed-from <dir with pages.json + html/>]
import fs from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://www.ipc.gov.in';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const CACHE = path.resolve('.cache/raw');
const INDEX = path.join(CACHE, 'index.json');
const CONCURRENCY = 4;
const DELAY_MS = 150;

const args = process.argv.slice(2);
const refresh = args.includes('--refresh');
const seedDir = args.includes('--seed-from') ? args[args.indexOf('--seed-from') + 1] : null;

fs.mkdirSync(CACHE, { recursive: true });
/** @type {Record<string, string>} path -> cache file name */
const index = fs.existsSync(INDEX) ? JSON.parse(fs.readFileSync(INDEX, 'utf8')) : {};

// Paths that are pure duplicates of another listing — crawl only the canonical one.
const ALIASES = [
  [/^\/about-us\/media-new\/news-highlights\.html/, '/news-highlights.html'],
  [/^\/photo-gallery\.html/, '/about-us/media-new/photo-gallery.html'],
];

const KEEP_PARAMS = ['start', 'limitstart'];

export function normalise(href, base) {
  if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) return null;
  let u;
  try { u = new URL(href.replace(/&amp;/g, '&'), base); } catch { return null; }
  if (!/(^|\.)ipc\.gov\.in$|^ipc\.maxtraserver\.in$/.test(u.hostname)) return null;
  let p;
  try { p = decodeURI(u.pathname); } catch { p = u.pathname; }
  p = p.replace(/\/{2,}/g, '/');
  if (/^\/(hi|shop|component|administrator|media|templates|modules|images|plugins|components)(\/|$)/.test(p)) return null;
  if (p !== '/' && !p.endsWith('.html')) return null;
  if (u.searchParams.has('tmpl') || u.searchParams.has('print') || u.searchParams.has('format')) return null;
  for (const [re, to] of ALIASES) if (re.test(p)) p = p.replace(re, to);
  const kept = KEEP_PARAMS.filter(k => u.searchParams.get(k) && u.searchParams.get(k) !== '0')
    .map(k => `${k}=${u.searchParams.get(k)}`);
  return p + (kept.length ? `?${kept.join('&')}` : '');
}

const fileFor = p => {
  const safe = p.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 120) || 'home';
  let name = `${safe}.html`, i = 1;
  const taken = new Set(Object.values(index));
  while (taken.has(name) && index[p] !== name) name = `${safe}-${i++}.html`;
  return name;
};

function seedFromScratch(dir) {
  const pages = JSON.parse(fs.readFileSync(path.join(dir, 'pages.json'), 'utf8'));
  let n = 0;
  for (const pg of pages) {
    const p = normalise(pg.path, ORIGIN);
    if (!p || index[p]) continue;
    const src = path.join(dir, 'html', pg.file);
    if (!fs.existsSync(src)) continue;
    const body = fs.readFileSync(src, 'utf8');
    if (body.length < 2000) continue;
    const name = fileFor(p);
    fs.writeFileSync(path.join(CACHE, name), body);
    index[p] = name; n++;
  }
  console.log(`seeded ${n} pages from ${dir}`);
}

async function fetchHtml(p) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(ORIGIN + encodeURI(p).replace(/%25/g, '%'), { headers: { 'User-Agent': UA, Accept: 'text/html' } });
      const body = await res.text();
      if (body.length > 2000) return body;
    } catch { /* retry */ }
    await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
  }
  return null;
}

const linksIn = (html, base) => {
  const out = new Set();
  for (const m of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    const n = normalise(m[1], ORIGIN + base);
    if (n) out.add(n);
  }
  return out;
};

async function main() {
  if (seedDir) seedFromScratch(seedDir);

  const seen = new Set();
  const queue = ['/', '/news-highlights.html', '/news-archive.html', '/about-us/media-new/photo-gallery.html',
    '/careers/careers_archive.html', '/library-home.html', '/site-map.html', '/faq.html'];
  const failed = [];
  let fetched = 0, fromCache = 0;

  async function worker() {
    while (queue.length) {
      const p = queue.shift();
      if (seen.has(p)) continue;
      seen.add(p);
      let html;
      if (!refresh && index[p] && fs.existsSync(path.join(CACHE, index[p]))) {
        html = fs.readFileSync(path.join(CACHE, index[p]), 'utf8');
        fromCache++;
      } else {
        html = await fetchHtml(p);
        await new Promise(r => setTimeout(r, DELAY_MS));
        if (!html) { failed.push(p); continue; }
        const name = index[p] || fileFor(p);
        fs.writeFileSync(path.join(CACHE, name), html);
        index[p] = name;
        fetched++;
        if (fetched % 50 === 0) {
          fs.writeFileSync(INDEX, JSON.stringify(index));
          console.log(`fetched ${fetched}, cached ${fromCache}, queue ${queue.length}`);
        }
      }
      for (const l of linksIn(html, p)) if (!seen.has(l)) queue.push(l);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  // Drop index entries that are no longer reachable from the site.
  for (const p of Object.keys(index)) if (!seen.has(p)) delete index[p];
  fs.writeFileSync(INDEX, JSON.stringify(index, null, 1));
  fs.writeFileSync(path.join(CACHE, 'meta.json'), JSON.stringify({ crawledAt: new Date().toISOString(), pages: Object.keys(index).length, failed }, null, 1));
  console.log(`done: ${Object.keys(index).length} pages (fetched ${fetched}, from cache ${fromCache}), failed ${failed.length}`);
  if (failed.length) console.log('failed:', failed.slice(0, 20));
}

main();
