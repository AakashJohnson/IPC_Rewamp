// Machine translation through Anuvadini. Not connected until VITE_ANUVADINI_API_URL points at a proxy
// endpoint (the proxy holds any API key; nothing secret is ever shipped to the browser).
//
// Expected proxy contract (adjust in `callApi` once the real Anuvadini API is known):
//   POST { source: 'en', target: '<lang>', texts: string[] }  →  { translations: string[] }

export interface Language {
  code: string;
  label: string;
  native: string;
}

/** Languages offered through Anuvadini. Hindi is served by the official IPC Hindi pages instead. */
export const ANUVADINI_LANGUAGES: Language[] = [
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
];

const endpoint = (import.meta.env.VITE_ANUVADINI_API_URL as string | undefined)?.trim() ?? '';

export const isConnected = () => endpoint.length > 0;

const cache = new Map<string, string>();
const key = (lang: string, text: string) => `${lang}\u0000${text}`;

async function callApi(texts: string[], lang: string): Promise<string[]> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: 'en', target: lang, texts }),
  });
  if (!res.ok) throw new Error(`Translation failed (${res.status})`);
  const data = (await res.json()) as { translations?: string[] };
  if (!Array.isArray(data.translations) || data.translations.length !== texts.length) throw new Error('Unexpected translation response');
  return data.translations;
}

/** Translates texts, using a session cache. Throws when not connected or on error; callers keep English. */
export async function translate(texts: string[], lang: string): Promise<string[]> {
  if (!isConnected()) throw new Error('Anuvadini translation is not connected');
  const missing = [...new Set(texts.filter(t => !cache.has(key(lang, t))))];
  for (let i = 0; i < missing.length; i += 50) {
    const batch = missing.slice(i, i + 50);
    const out = await callApi(batch, lang);
    batch.forEach((t, j) => cache.set(key(lang, t), out[j]));
  }
  return texts.map(t => cache.get(key(lang, t)) ?? t);
}

const originals = new WeakMap<Text, string>();

/** Translates the visible text of `root` in place; `restore` puts the English back. */
export async function translateElement(root: HTMLElement, lang: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => (n.nodeValue?.trim() && !n.parentElement?.closest('script,style,code,pre,[translate="no"]') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  const sources = nodes.map(n => originals.get(n) ?? n.nodeValue ?? '');
  const out = await translate(sources.map(s => s.trim()), lang);
  nodes.forEach((n, i) => {
    if (!originals.has(n)) originals.set(n, n.nodeValue ?? '');
    n.nodeValue = sources[i].replace(sources[i].trim(), out[i]);
  });
  root.lang = lang;
}

export function restoreElement(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode as Text;
    const o = originals.get(n);
    if (o !== undefined) n.nodeValue = o;
  }
  root.removeAttribute('lang');
}
