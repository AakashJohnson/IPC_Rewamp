// Normalises the crawled Joomla HTML in .cache/raw into the JSON content the React app renders.
//
// Outputs
//   public/content/p/<hash>.json   one file per route (see route-hash.mjs)
//   public/content/manifest.json   every route with title/type/section (search + site map)
//   public/content/news.json       all News & Highlights items (index, archive, filters)
//   src/content/navigation.json    curated mega-menu + footer + library menu
//   src/content/home.json          latest news for the homepage + snapshot meta
//   src/content/aliases.json       legacy duplicate routes -> canonical route
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import sanitizeHtml from 'sanitize-html';
import { routeHash } from './route-hash.mjs';

const ORIGIN = 'https://www.ipc.gov.in';
const CACHE = path.resolve('.cache/raw');
const OUT_PUBLIC = path.resolve('public/content');
const OUT_SRC = path.resolve('src/content');

const index = JSON.parse(fs.readFileSync(path.join(CACHE, 'index.json'), 'utf8'));
const crawlMeta = JSON.parse(fs.readFileSync(path.join(CACHE, 'meta.json'), 'utf8'));
const raw = p => fs.readFileSync(path.join(CACHE, index[p]), 'utf8');

// ---------------------------------------------------------------------------------------------
// Routes

const ROUTE_ALIASES = {
  '/about-us/media-new/news-highlights': '/news-highlights',
  '/photo-gallery': '/about-us/media-new/photo-gallery',
  '/annual-reports-footer': '/about-us/about-ipc/annual-reports',
  '/careers/careers': '/careers',
  '/orders-circulars-notices/circulars': '/orders-circulars-notices',
  '/404-page-not-found': null,
};

/** Crawl path (may include ?start=) -> app route */
export function toRoute(p) {
  let r = p.split('?')[0].replace(/\.html$/, '');
  if (r === '') r = '/';
  if (r.length > 1) r = r.replace(/\/+$/, '');
  if (r in ROUTE_ALIASES) return ROUTE_ALIASES[r];
  return r;
}

const decodeEntities = s => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
  .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&rdquo;/g, '”').replace(/&ldquo;/g, '“')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const clean = s => decodeEntities(s || '').replace(/\s+/g, ' ').trim();

// Pages that exist as routes (filled in during the first pass).
const routes = new Map(); // route -> { kind, title, crawlPaths: [] }

// ---------------------------------------------------------------------------------------------
// Link rewriting

const unresolved = new Map(); // official URL -> count (internal .html pages we did not crawl)

function unwrapRedirect(href) {
  const m = href.match(/reUrlCheck\.do\?url=([^&]+)/);
  if (m) { try { return decodeURIComponent(m[1]); } catch { return href; } }
  return href;
}

/**
 * Returns { href, internal } where internal hrefs are app routes and everything else is absolute.
 */
function rewriteHref(rawHref, basePath = '/') {
  let href = decodeEntities((rawHref || '').trim());
  if (!href || href === '#' || /^javascript:/i.test(href)) return null;
  if (/^mailto:/i.test(href)) {
    const addr = href.slice(7).replace(/<[^>]+>/g, '').replace(/^['"\s]+|['".,;:\s]+$/g, '');
    // Authored links such as "mailto:IPC@123" are not addresses — render their text without a link.
    return /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(addr) ? { href: `mailto:${addr}`, internal: false } : null;
  }
  if (/^tel:/i.test(href)) return { href, internal: false };
  if (href.startsWith('#')) return { href, internal: false };
  href = unwrapRedirect(href);
  let u;
  try { u = new URL(href, ORIGIN + basePath); } catch { return null; }
  if (/^ipc\.maxtraserver\.in$|^ipc\.gov\.in$/.test(u.hostname)) u.hostname = 'www.ipc.gov.in';
  if (u.hostname === 'www.ipc.gov.in') {
    u.protocol = 'https:';
    let p;
    try { p = decodeURI(u.pathname); } catch { p = u.pathname; }
    if ((p.endsWith('.html') || p === '/') && !/^\/(hi|shop)\//.test(p)) {
      const r = toRoute(p);
      if (r && routes.has(r)) return { href: r + (u.hash || ''), internal: true };
      if (r === '/') return { href: '/', internal: true };
      const abs = u.toString();
      unresolved.set(abs, (unresolved.get(abs) || 0) + 1);
      return { href: abs, internal: false };
    }
    return { href: u.toString(), internal: false };
  }
  return { href: u.toString(), internal: false };
}

const absAsset = (src, basePath = '/') => {
  try {
    const u = new URL(decodeEntities(src), ORIGIN + basePath);
    if (/^ipc\.maxtraserver\.in$|^ipc\.gov\.in$/.test(u.hostname)) u.hostname = 'www.ipc.gov.in';
    if (u.hostname === 'www.ipc.gov.in') u.protocol = 'https:';
    return u.toString();
  } catch { return src; }
};

const fileKind = href => {
  const h = href.toLowerCase().split('#')[0];
  const f = (h.match(/download\.php\?f=([^&]+)/) || [])[1] || h.split('?')[0];
  const ext = (f.match(/\.([a-z0-9]{2,5})$/) || [])[1];
  if (!ext) return null;
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls';
  if (['ppt', 'pptx'].includes(ext)) return 'ppt';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['zip', 'rar'].includes(ext)) return 'zip';
  return null;
};

// ---------------------------------------------------------------------------------------------
// HTML helpers

/** Replace Joomla email-cloak spans + scripts with plain mailto links. */
function decloak(html) {
  return html.replace(/<span id="cloak([0-9a-f]+)">[\s\S]*?<\/script>/g, (whole, id) => {
    // The literals contain HTML entities (with semicolons), so match the quoted pieces, not up to ';'.
    const m = whole.match(new RegExp(`addy_text${id}\\s*=\\s*((?:'[^']*'\\s*\\+?\\s*)+)`));
    const text = m ? decodeEntities([...m[1].matchAll(/'([^']*)'/g)].map(x => x[1]).join('')) : '';
    const plain = text.replace(/<[^>]+>/g, '').replace(/^['"\s]+|['".,;:\s]+$/g, '');
    // Joomla also cloaks non-address text containing "@" (e.g. "GST@5%"); keep that as plain text.
    if (/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(plain)) return `<a href="mailto:${plain}">${plain}</a>`;
    return plain;
  });
}

const SANITIZE = {
  allowedTags: ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'u', 'sup', 'sub',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'img', 'figure', 'figcaption', 'blockquote',
    'hr', 'div', 'span', 'dl', 'dt', 'dd', 'small', 'abbr', 'mark', 's', 'pre', 'code'],
  allowedAttributes: {
    a: ['href', 'title', 'data-file', 'data-internal', 'rel', 'target'],
    img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
    td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan', 'scope'],
    ol: ['start', 'type'], abbr: ['title'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: { h1: 'h2', b: 'strong', i: 'em', font: 'span', center: 'div', strike: 's' },
  exclusiveFilter: frame => {
    // Empty-element cleanup happens after sanitising: frame.mediaChildren only sees direct children,
    // so filtering here would drop paragraphs whose only content is a linked image.
    // Signed Facebook CDN URLs pasted into old articles have expired (403 on the live site too).
    return frame.tag === 'img' && (!frame.attribs.src || /new\.gif|pdf\.png|list_icon|icon-|blank\.gif|fbcdn\.net/i.test(frame.attribs.src));
  },
};

const looksLikeFilename = alt => !alt || /^[\w\- .()]+\.(jpe?g|png|gif|webp)$/i.test(alt) || /^[A-Za-z]*[-_ ]?\d{5,}/.test(alt)
  || /^(img|image|dsc|photo|pic)[\s_-]?\d*/i.test(alt) || /\d{6,}/.test(alt);

/** Sanitise a fragment of Joomla article HTML and rewrite links/images for the app. */
function cleanBody(html, basePath, pageTitle) {
  let h = decloak(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    // Runs of non-breaking spaces were used for visual indentation; they create unbreakable lines on phones.
    .replace(/(?:&nbsp;|\u00a0)+/g, ' ');
  h = sanitizeHtml(h, {
    ...SANITIZE,
    transformTags: {
      ...SANITIZE.transformTags,
      a: (tag, attribs) => {
        const r = rewriteHref(attribs.href, basePath);
        if (!r) return { tagName: 'span', attribs: {} };
        const out = { href: r.href };
        if (r.internal) out['data-internal'] = '';
        else {
          const kind = fileKind(r.href);
          if (kind) out['data-file'] = kind;
        }
        if (attribs.title && clean(attribs.title).length < 140) out.title = clean(attribs.title);
        return { tagName: 'a', attribs: out };
      },
      img: (tag, attribs) => {
        const alt = clean(attribs.alt || attribs.title || '');
        return {
          tagName: 'img',
          attribs: {
            src: attribs.src ? absAsset(attribs.src, basePath) : '',
            alt: looksLikeFilename(alt) ? `Image: ${pageTitle}` : alt,
            loading: 'lazy', decoding: 'async',
            ...(attribs.width && /^\d+$/.test(attribs.width) ? { width: attribs.width } : {}),
            ...(attribs.height && /^\d+$/.test(attribs.height) ? { height: attribs.height } : {}),
          },
        };
      },
    },
  });
  // Unwrap meaningless spans/divs, collapse whitespace-only paragraphs and runs of <br>.
  h = h.replace(/<span>([\s\S]*?)<\/span>/g, '$1').replace(/\r/g, '')
    .replace(/(<br \/>\s*){3,}/g, '<br /><br />');
  // Repeat so wrappers that only contained other empty wrappers also disappear.
  for (let i = 0; i < 3; i++) {
    h = h.replace(/<(p|div|strong|em|li|h[2-6]|u|sup)>(?:\s|&nbsp;|<br \/>)*<\/\1>/g, '');
  }
  h = h.replace(/\n{3,}/g, '\n\n').trim();
  return enhanceLinks(h);
}

const FILE_LABEL = { pdf: 'PDF', doc: 'DOC', xls: 'XLS', ppt: 'PPT', image: 'Image', zip: 'ZIP' };

/** Adds new-tab semantics, a screen-reader cue and a file badge to external/document links; wraps tables. */
function enhanceLinks(h) {
  const root = parse(h);
  for (const a of root.querySelectorAll('a')) {
    const href = a.getAttribute('href') || '';
    if (a.hasAttribute('data-internal') || !/^https?:/.test(href)) continue;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    const kind = a.getAttribute('data-file');
    const hasImage = !!a.querySelector('img');
    if (kind && !hasImage) a.insertAdjacentHTML('beforeend', `<span class="file-badge">${FILE_LABEL[kind]}</span>`);
    a.insertAdjacentHTML('beforeend', '<span class="sr-only"> (opens in a new tab)</span>');
  }
  return root.toString()
    .replace(/<table>/g, '<div class="table-scroll" role="region" tabindex="0" aria-label="Scrollable table"><table>')
    .replace(/<\/table>/g, '</table></div>');
}

const textLength = html => clean(html.replace(/<[^>]+>/g, ' ')).length;

/** Parses just the content region — whole-page parses are unreliable on some malformed Joomla pages. */
function mainOf(html, doc) {
  const m = html.match(/<main id="content"[\s\S]*?<\/main>/);
  if (m) return parse(m[0]).querySelector('main');
  return doc.querySelector('.item-page') || doc.querySelector('body') || parse(html);
}

function titleOf(doc, fallback) {
  const t = doc.querySelector('[itemprop="headline"]') || doc.querySelector('main#content .page-header h2')
    || doc.querySelector('main#content h1') || doc.querySelector('main#content h2');
  const s = clean(t?.text || '');
  if (s) return s;
  return clean((doc.querySelector('title')?.text || fallback).replace(/ - Indian Pharmacopoeia Commission$/, ''));
}

function crumbsOf(doc, basePath) {
  const ul = doc.querySelector('ul.breadcrumb');
  if (!ul) return [];
  return ul.querySelectorAll('li').map(li => {
    const a = li.querySelector('a');
    const label = clean((li.querySelector('[itemprop="name"]') || li).text).replace(/^»\s*/, '');
    if (!label || /^(you are here|home)$/i.test(label)) return null;
    const r = a ? rewriteHref(a.getAttribute('href'), basePath) : null;
    return { label, href: r?.internal ? r.href : undefined };
  }).filter(Boolean);
}

const updatedOf = doc => {
  const t = doc.querySelector('time[itemprop="dateModified"]');
  if (t?.getAttribute('datetime')) return t.getAttribute('datetime').slice(0, 10);
  const m = (doc.querySelector('main#content')?.text || '').match(/Last Updated:\s*(\d{1,2} \w+ \d{4})/);
  if (m) { const d = new Date(`${m[1]} UTC`); if (!isNaN(d)) return d.toISOString().slice(0, 10); }
  return undefined;
};

const hiUrlOf = doc => {
  const a = doc.querySelector('.mod-languages a.language-hindi') || doc.querySelector('.mod-languages a');
  const href = a?.getAttribute('href');
  return href ? absAsset(href) : `${ORIGIN}/hi/`;
};

const dmyToIso = s => {
  const m = (s || '').trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : undefined;
};

// ---------------------------------------------------------------------------------------------
// Pass 1: classify crawl paths into routes

const LIST_NEWS = /^\/news-highlights\.html/;
const LIST_ARCHIVE = /^\/news-archive\.html/;
const GALLERY_INDEX = /^\/about-us\/media-new\/photo-gallery\.html/;
const GALLERY_ALBUM = /^\/about-us\/media-new\/photo-gallery\/category\//;
const FORMS = { '/training-form': 'training', '/feedback-form': 'feedback', '/monograph-inclusion-request-form/submissions': 'monograph-inclusion' };
const REGISTERS = new Set(['/orders-circulars-notices', '/careers', '/careers/careers_archive', '/tenders']);
const LINK_DIRS = new Set(['/related-website-links', '/related-website-links/websitelinks']);
const LIBRARY = new Set(['/library-home', '/library-about', '/sections', '/collections', '/services', '/e-resources',
  '/library-contact', '/library-rules', '/periodicals', '/library-publication', '/newspapers', '/membership', '/attachment',
  '/faq-library-information-centre', '/attachment/8-category-en/1119-membership-form',
  '/attachment/8-category-en/1140-requisition-form-books-periodicals-serials', '/about-us/departments/library-information-centre']);
const CONTACT = new Set(['/about-us/contact-us', '/contact-us']);
// CMS titles that only make sense inside their original sub-site.
const TITLE_OVERRIDES = { '/library-home': 'Library & Information Centre' };

function kindFor(route, crawlPath) {
  if (route === '/') return 'home';
  if (LIST_NEWS.test(crawlPath)) return 'news-index';
  if (LIST_ARCHIVE.test(crawlPath)) return 'news-archive';
  if (GALLERY_INDEX.test(crawlPath)) return 'gallery-index';
  if (GALLERY_ALBUM.test(crawlPath)) return 'gallery-album';
  if (/^\/news-highlights\//.test(route)) return 'news';
  if (FORMS[route]) return 'form';
  if (REGISTERS.has(route)) return 'register';
  if (LINK_DIRS.has(route)) return 'links';
  if (route === '/faq') return 'faq';
  if (route === '/site-map') return 'sitemap';
  if (LIBRARY.has(route)) return 'library';
  if (CONTACT.has(route)) return 'contact';
  return 'article';
}

for (const p of Object.keys(index)) {
  const r = toRoute(p);
  if (r === null) continue;
  const kind = kindFor(r, p);
  const entry = routes.get(r) || { kind, crawlPaths: [] };
  entry.crawlPaths.push(p);
  routes.set(r, entry);
}
// Aliased duplicates that were crawled under their alias only still need the canonical route.
for (const [from, to] of Object.entries(ROUTE_ALIASES)) if (to && !routes.has(to) && index[`${from}.html`]) {
  routes.set(to, { kind: kindFor(to, `${from}.html`), crawlPaths: [`${from}.html`] });
}

// ---------------------------------------------------------------------------------------------
// Navigation (original tree from the homepage menu, then curated)

const homeDoc = parse(raw('/'));

const MENU_LANDING = {
  'Pharmacovigilance Programme of India (PvPI)': '/mandates/pvpi/pharmacovigilance-skill-development-programme',
};

function readMenu(ul) {
  return ul.childNodes.filter(n => n.tagName === 'LI').map(li => {
    const a = li.querySelector('a');
    const label = clean(a?.text || '') || clean(a?.querySelector('img')?.getAttribute('alt') || '');
    const rawHref = a?.getAttribute('href') || '#';
    const sub = li.childNodes.find(n => n.tagName === 'UL');
    // Menu entries that are dead "#" links on the live site but have an obvious landing page.
    const r = rewriteHref(rawHref, '/') ?? (MENU_LANDING[label] ? { href: MENU_LANDING[label], internal: true } : null);
    const node = { label };
    if (r) { if (r.internal) node.to = r.href; else node.href = r.href; }
    const kind = r && !r.internal ? fileKind(r.href) : null;
    if (kind) node.file = kind;
    if (sub) node.children = readMenu(sub);
    return node;
  }).filter(n => n.label && n.label !== 'Home');
}

const rawMenu = readMenu(homeDoc.querySelector('nav#menu > ul'));

// Index every raw node so the curated menu can pick them; verify.mjs checks nothing is lost.
const allRawNodes = [];
(function walk(nodes, trail) {
  for (const n of nodes) {
    allRawNodes.push({ ...n, trail: [...trail, n.label] });
    if (n.children) walk(n.children, [...trail, n.label]);
  }
})(rawMenu, []);

function pick(selector) {
  const match = allRawNodes.find(n => (selector.to && n.to === selector.to) || (selector.href && n.href === selector.href)
    || (selector.trail && n.trail.join(' > ') === selector.trail));
  if (!match) throw new Error(`nav node not found: ${JSON.stringify(selector)}`);
  const node = structuredClone(match);
  delete node.trail;
  return node;
}
const relabel = (node, label, extra = {}) => ({ ...node, label, ...extra });

const aboutUs = pick({ trail: 'About Us' });
const findChild = (node, label) => node.children.find(c => c.label === label);
const productsServices = pick({ trail: 'Products & Services' });
const psChild = label => structuredClone(findChild(productsServices, label));

const curated = [
  {
    label: 'About IPC',
    to: '/about-us',
    columns: [
      { heading: 'The Commission', items: [
        relabel(findChild(aboutUs, 'About IPC'), 'About IPC'),
        findChild(aboutUs, 'Organisational Chart of Indian Pharmacopoeia Commission'),
        findChild(aboutUs, 'Accreditation/ Certification'),
        findChild(aboutUs, 'Expert Committees & Working Groups'),
        findChild(aboutUs, 'MOU/Collaborations/Achievements'),
        findChild(aboutUs, 'List of Employees'),
      ] },
      { heading: 'Leadership', items: aboutUs.children.filter(c => /^Message|Secretary-cum/.test(c.label)) },
      { heading: 'Divisions', items: [findChild(aboutUs, 'All Divisions')] },
      { heading: 'Media & Contact', items: [
        findChild(aboutUs, 'Events'), findChild(aboutUs, 'Gallery'), findChild(aboutUs, 'Contact Us'),
      ] },
    ],
  },
  {
    label: 'Publications & Standards',
    columns: [
      { heading: 'Indian Pharmacopoeia', items: [psChild('Indian Pharmacopoeia (IP)')] },
      { heading: 'National Formulary of India', items: [psChild('National Formulary of India(NFI)')] },
      { heading: 'Reference Substances', items: [psChild('IP Reference Substances (IPRS) & Impurity')] },
    ],
  },
  {
    label: 'Programmes',
    columns: [
      { heading: 'Pharmacovigilance', items: [psChild('Pharmacovigilance Programme of India (PvPI)')] },
      { heading: 'Materiovigilance', items: [psChild('Materiovigilance Programme of India (MvPI)')] },
      { heading: 'Capacity Building', items: [psChild('Skill Development'), psChild('Analytical Services')] },
    ],
  },
  { label: 'Online Services', ...(({ children, ...rest }) => ({ ...rest, columns: [{ heading: 'Online Services', items: children }] }))(pick({ trail: 'Online Services' })) },
  { ...pick({ trail: 'Pharmacopoeial Harmonization' }), label: 'Harmonization' },
  {
    label: 'Notices',
    columns: [{ heading: 'Official Updates', items: [
      { label: 'News & Highlights', to: '/news-highlights' },
      pick({ trail: 'Orders & Circulars' }),
      pick({ trail: 'Tenders' }),
      pick({ trail: 'Careers' }),
    ] }],
  },
  {
    label: 'More',
    columns: [{ heading: 'Services & Information', items: [
      pick({ trail: 'Certification Services' }),
      pick({ trail: 'Employees Corner' }),
      pick({ trail: 'RTI' }),
      pick({ trail: 'Related Website Links' }),
      relabel(pick({ trail: 'Phytopharmaceutical Drugs General Guidance for Development' }), 'Phytopharmaceutical Drugs: General Guidance for Development'),
      { label: 'Frequently Asked Questions', to: '/faq' },
    ] }],
  },
];

// "Products & Services" parent was href="#" on the live site; children are all placed above.
const footerHtml = (raw('/').match(/<div class="footer-nav">[\s\S]*?<div class="copyright-text">/) || [''])[0];
const footerLinks = parse(footerHtml).querySelectorAll('a').map(a => {
  const r = rewriteHref(a.getAttribute('href'), '/');
  return r && { label: clean(a.text), ...(r.internal ? { to: r.href } : { href: r.href }) };
}).filter(Boolean);

const relatedSites = (() => {
  const box = homeDoc.querySelectorAll('a').filter(a => /^https?:/.test(a.getAttribute('href') || ''));
  const wanted = ['cdsco', 'eprocure', 'indianmedicine', 'fssai', 'nrhm-mis', 'indiacode', 'iponline', 'mohfw', 'nrhm-mcts', 'nib.gov', 'nvsp', 'nhm.gov'];
  const out = [];
  for (const w of wanted) {
    const a = box.find(x => (x.getAttribute('href') || '').includes(w) && clean(x.text).length > 3);
    if (a && !out.some(o => o.href === a.getAttribute('href'))) out.push({ label: clean(a.text), href: absAsset(a.getAttribute('href')) });
  }
  return out;
})();

const libraryNav = (() => {
  const doc = parse(raw('/library-home.html'));
  const nav = doc.querySelector('nav.navbar');
  if (!nav) return [];
  const seen = new Set();
  return nav.querySelectorAll('a').map(a => {
    const r = rewriteHref(a.getAttribute('href'), '/library-home.html');
    const label = clean(a.text);
    if (!r || !label || label === 'Menu' || seen.has(r.href)) return null;
    seen.add(r.href);
    return { label, ...(r.internal ? { to: r.href } : { href: r.href }) };
  }).filter(Boolean);
})();

// ---------------------------------------------------------------------------------------------
// News

const NEWS_CATEGORIES = [
  ['Recruitment', /walk[- ]?in|interview|vacan|recruit|contractual position|position of|post of|deputation|selected candidate|shortlisted|appointment|engagement of .*(consultant|associate|staff)/i],
  ['Notices & Tenders', /auction|tender|quotation|empanel|expression of interest|\beoi\b|procure|disposal|public notice|corrigendum/i],
  ['Training & Internships', /training|internship|skill development|workshop|webinar|course|hands-on|capacity building/i],
  ['Events', /conclave|week|meet\b|ceremony|celebrat|\bday\b|diwas|seminar|conference|symposium|session|visit|delegation|award|inaugur|valedictory|campaign/i],
  ['Publications & Standards', /pharmacopoeia|monograph|\bnfi\b|formulary|guidance|addend|amendment|reference (substance|standard)|iprs|impurit|newsletter|drug (safety )?alert|document|releas|errata|harmoni/i],
];
const categoryOf = title => (NEWS_CATEGORIES.find(([, re]) => re.test(title)) || ['Announcements'])[0];

const newsById = new Map();
function readNewsList(p, archive) {
  const doc = parse(raw(p));
  for (const tr of doc.querySelectorAll('table.category tbody tr')) {
    const a = tr.querySelector('td.list-title a');
    if (!a) continue;
    const r = rewriteHref(a.getAttribute('href'), '/news-highlights.html');
    if (!r) continue;
    const id = Number((r.href.match(/\/(\d+)-/) || [])[1]) || null;
    const title = clean(a.text);
    const date = dmyToIso(tr.querySelector('td.list-date')?.text);
    const key = id ?? r.href;
    const prev = newsById.get(key);
    newsById.set(key, {
      id, title: prev?.title || title, route: r.internal ? r.href : undefined, href: r.internal ? undefined : r.href,
      date: prev?.date || date, category: categoryOf(title),
      current: (prev?.current || false) || !archive, archive: (prev?.archive || false) || archive,
    });
  }
}
for (const p of Object.keys(index)) {
  if (LIST_NEWS.test(p)) readNewsList(p, false);
  else if (LIST_ARCHIVE.test(p)) readNewsList(p, true);
}
const news = [...newsById.values()]
  .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || 0) - (a.id || 0));
const newsByRoute = new Map(news.filter(n => n.route).map(n => [n.route, n]));

// ---------------------------------------------------------------------------------------------
// Pass 2: build page JSON

fs.rmSync(path.join(OUT_PUBLIC, 'p'), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT_PUBLIC, 'p'), { recursive: true });
fs.mkdirSync(OUT_SRC, { recursive: true });

const manifest = [];
const searchIndex = [];
const hashes = new Map();
const stats = {};

function writePage(route, page) {
  const h = routeHash(route);
  if (hashes.has(h) && hashes.get(h) !== route) throw new Error(`route hash collision: ${route} vs ${hashes.get(h)}`);
  hashes.set(h, route);
  fs.writeFileSync(path.join(OUT_PUBLIC, 'p', `${h}.json`), JSON.stringify({ route, ...page }));
  manifest.push({ r: route, t: page.title, k: page.kind, ...(page.date || page.updated ? { d: page.date || page.updated } : {}) });
  // Searchable text: body copy, register rows, FAQ questions, album titles (trimmed to keep the index small).
  const text = [
    page.bodyHtml ? clean(page.bodyHtml.replace(/<span class="(file-badge|sr-only)">[^<]*<\/span>/g, '').replace(/<[^>]+>/g, ' ')) : '',
    ...(page.rows || []).map(r => r.title),
    ...(page.items || []).map(i => i.q),
    ...(page.albums || []).map(a => a.title),
  ].join(' ').replace(/\s+/g, ' ').trim();
  searchIndex.push({ r: route, t: page.title, k: page.kind, ...(page.date ? { d: page.date } : {}), x: text.slice(0, 600) });
  stats[page.kind] = (stats[page.kind] || 0) + 1;
}

const startOf = p => Number(p.match(/start=(\d+)/)?.[1] ?? 0);
const sortByStart = paths => [...paths].sort((a, b) => startOf(a) - startOf(b));

for (const [route, entry] of routes) {
  const { kind } = entry;
  if (kind === 'home') continue;
  const crawlPath = sortByStart(entry.crawlPaths)[0];
  const html = raw(crawlPath);
  const doc = parse(html);
  const main = mainOf(html, doc);
  const basePath = crawlPath.split('?')[0];
  const common = { kind, crumbs: crumbsOf(doc, basePath), updated: updatedOf(doc), hiUrl: hiUrlOf(doc), official: `${ORIGIN}${encodeURI(basePath)}` };

  if (kind === 'news-index' || kind === 'news-archive') {
    writePage(route, { ...common, title: 'News & Highlights' + (kind === 'news-archive' ? ' — Archive' : '') });
    continue;
  }

  if (kind === 'gallery-index') {
    const albums = [];
    for (const p of sortByStart(entry.crawlPaths)) {
      const d = parse(raw(p));
      for (const box of d.querySelectorAll('.pg-cats-box-float2, .pg-cats-box')) {
        const link = box.querySelector('a.category') || box.querySelector('.pg-field-table2 a');
        if (!link) continue;
        const r = rewriteHref(link.getAttribute('href'), basePath);
        const img = box.querySelector('img');
        const count = Number((clean(box.querySelector('.small')?.text || '').match(/\d+/) || [0])[0]);
        if (r && !albums.some(a => a.route === r.href)) {
          albums.push({ route: r.internal ? r.href : undefined, href: r.internal ? undefined : r.href, title: clean(link.text), count,
            // Phoca generates s/m/l thumbnails; the large one stays sharp at card size.
            cover: img ? absAsset(img.getAttribute("src"), basePath).replace("/phoca_thumb_m_", "/phoca_thumb_l_") : undefined });
        }
      }
    }
    writePage(route, { ...common, title: 'Photo Gallery', albums });
    continue;
  }

  if (kind === 'gallery-album') {
    const images = [];
    let title = '';
    for (const p of sortByStart(entry.crawlPaths)) {
      const d = parse(raw(p));
      title ||= clean(d.querySelector('#phocagallery h1')?.text || '').replace(/^Photo Gallery\s*-\s*/, '');
      for (const fig of d.querySelectorAll('figure')) {
        const a = fig.querySelector('a.photoswipe-button') || fig.querySelector('a');
        const img = fig.querySelector('img');
        if (!a || !img) continue;
        const [w, h] = (a.getAttribute('data-size') || '').split('x').map(Number);
        const src = absAsset(a.getAttribute('href'), basePath);
        if (images.some(i => i.src === src)) continue;
        const caption = clean(fig.querySelector('figcaption')?.text || a.getAttribute('title') || '');
        images.push({ src, thumb: absAsset(img.getAttribute('src'), basePath), w: w || undefined, h: h || undefined,
          caption: caption && !looksLikeFilename(caption) ? caption : undefined });
      }
    }
    writePage(route, { ...common, title: title || titleOf(doc, route), images });
    continue;
  }

  if (kind === 'register') {
    const table = main.querySelector('table');
    const headers = table ? table.querySelectorAll('thead th').map(th => clean(th.text)) : [];
    const col = re => headers.findIndex(hd => re.test(hd));
    const iTitle = col(/title/i), iSize = col(/size/i), iDate = col(/date (created|of publication)|^date|published/i), iExpiry = col(/expiry/i);
    const rows = table ? table.querySelectorAll('tbody tr').map(tr => {
      const tds = tr.querySelectorAll('td');
      const cell = tds[iTitle] || tds[1];
      const a = cell?.querySelector('a');
      if (!a) return null;
      const r = rewriteHref(a.getAttribute('href'), basePath);
      return {
        title: clean(a.text), href: r?.href, internal: r?.internal || undefined, file: r && !r.internal ? fileKind(r.href) || 'pdf' : undefined,
        sizeKB: iSize >= 0 ? Number(clean(tds[iSize]?.text).replace(/,/g, '')) || undefined : undefined,
        date: iDate >= 0 ? dmyToIso(clean(tds[iDate]?.text)) : undefined,
        expiry: iExpiry >= 0 ? dmyToIso(clean(tds[iExpiry]?.text)) : undefined,
      };
    }).filter(Boolean) : [];
    const title = clean(main.querySelector('.page-header h2, h2')?.text || '') || titleOf(doc, route);
    // Some register pages carry intro/archive links above the table.
    const introLinks = main.querySelectorAll('a').filter(a => !table || !table.innerHTML.includes(a.outerHTML))
      .map(a => ({ label: clean(a.text), r: rewriteHref(a.getAttribute('href'), basePath) }))
      .filter(x => x.label && x.r && !/^(#|javascript)/.test(x.r.href) && !/^\d+$/.test(x.label) && !/^(start|prev|next|end|title|date|expiry)/i.test(x.label))
      .map(x => ({ label: x.label, ...(x.r.internal ? { to: x.r.href } : { href: x.r.href }) }));
    writePage(route, { ...common, title, hasExpiry: iExpiry >= 0, rows, links: introLinks });
    continue;
  }

  if (kind === 'faq') {
    const items = main.querySelectorAll('.ttext').map((q, i) => {
      const a = main.querySelectorAll('.atext')[i];
      return { q: clean(q.text).replace(/^\d+\.\s*/, ''), a: a ? cleanBody(a.innerHTML, basePath, 'FAQ') : '' };
    });
    writePage(route, { ...common, title: 'Frequently Asked Questions', items });
    continue;
  }

  if (kind === 'links') {
    const links = main.querySelectorAll('a').map(a => {
      const r = rewriteHref(a.getAttribute('href'), basePath);
      return r && clean(a.text) ? { label: clean(a.text), ...(r.internal ? { to: r.href } : { href: r.href }) } : null;
    }).filter(Boolean);
    writePage(route, { ...common, title: titleOf(doc, route), links });
    continue;
  }

  if (kind === 'sitemap') {
    writePage(route, { ...common, title: 'Site Map' });
    continue;
  }

  // Articles, news, library, contact, forms: body-based pages.
  const itemPage = main.querySelector('.item-page') || main;
  const bodyEl = itemPage.querySelector('[itemprop="articleBody"]') || itemPage;
  // Strip Joomla chrome that sometimes sits inside the body container.
  for (const sel of ['.page-header', '.icons', 'dl.article-info', '.article-info', 'form button', '.pagenav', '.pager', '#system-message-container', '.btn-group']) {
    for (const el of bodyEl.querySelectorAll(sel)) el.remove();
  }
  const title = TITLE_OVERRIDES[route] || (kind === 'form' ? clean(main.querySelector('h2')?.text || '') : '') || titleOf(doc, route);
  let bodyHtml = kind === 'form' ? '' : cleanBody(bodyEl.innerHTML, basePath, title);
  if (bodyHtml && textLength(bodyHtml) === 0 && !/<img/.test(bodyHtml)) bodyHtml = '';
  const page = { ...common, title, bodyHtml };
  if (kind === 'news') {
    const n = newsByRoute.get(route);
    page.date = n?.date || common.updated;
    page.category = n?.category || categoryOf(title);
  }
  if (kind === 'form') page.formId = FORMS[route];
  writePage(route, page);
}

// ---------------------------------------------------------------------------------------------
// Homepage data (verified items surfaced on the live homepage)

const homeQuickLinks = homeDoc.querySelectorAll('.modalContent a').map(a => {
  const r = rewriteHref(a.getAttribute('href'), '/');
  return r && { label: clean(a.text), ...(r.internal ? { to: r.href } : { href: r.href }) };
}).filter(Boolean);

const snapshotDate = crawlMeta.crawledAt.slice(0, 10);
const home = {
  snapshotDate,
  latestNews: news.filter(n => n.current).slice(0, 12),
  quickLinks: homeQuickLinks,
};

// ---------------------------------------------------------------------------------------------
// Write outputs

manifest.sort((a, b) => a.r.localeCompare(b.r));
// The library navbar only exposes its top level; the rest of the library pages hang off dropdowns.
for (const e of manifest) {
  if (e.k === 'library' && e.r !== '/about-us/departments/library-information-centre' && !libraryNav.some(l => l.to === e.r)) {
    libraryNav.push({ label: e.t, to: e.r });
  }
}
fs.writeFileSync(path.join(OUT_PUBLIC, 'manifest.json'), JSON.stringify(manifest));
fs.writeFileSync(path.join(OUT_PUBLIC, 'search.json'), JSON.stringify(searchIndex));
fs.writeFileSync(path.join(OUT_PUBLIC, 'news.json'), JSON.stringify(news));
fs.writeFileSync(path.join(OUT_SRC, 'navigation.json'), JSON.stringify({ main: curated, raw: rawMenu, footer: footerLinks, related: relatedSites, library: libraryNav }, null, 1));
fs.writeFileSync(path.join(OUT_SRC, 'home.json'), JSON.stringify(home, null, 1));
fs.writeFileSync(path.join(OUT_SRC, 'aliases.json'), JSON.stringify(Object.fromEntries(Object.entries(ROUTE_ALIASES).filter(([, v]) => v)), null, 1));
fs.writeFileSync(path.join(path.resolve('.cache'), 'unresolved.json'), JSON.stringify([...unresolved.entries()].sort((a, b) => b[1] - a[1]), null, 1));

console.log('pages by kind:', stats);
console.log(`routes: ${manifest.length}, news items: ${news.length} (current ${news.filter(n => n.current).length}), unresolved internal links: ${unresolved.size}`);
