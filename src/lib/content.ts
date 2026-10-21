import { routeHash } from './route-hash';
import type { ManifestEntry, NewsItem, Page } from './types';

// Content is static JSON produced by scripts/content/build.mjs. Promises are cached so React's `use()`
// sees a stable promise per resource, and failed requests are evicted so a retry can succeed.

const cache = new Map<string, Promise<unknown>>();

async function fetchJson<T>(url: string): Promise<T | null> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  // Static hosts and the Vite dev server answer unknown paths with index.html.
  if (!(res.headers.get('content-type') || '').includes('json')) return null;
  return (await res.json()) as T;
}

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  let p = cache.get(key) as Promise<T> | undefined;
  if (!p) {
    p = load().catch(err => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, p);
  }
  return p;
}

export const loadPage = (route: string) =>
  cached(`page:${route}`, () => fetchJson<Page>(`/content/p/${routeHash(route)}.json`));

export const loadNews = () =>
  cached('news', async () => (await fetchJson<NewsItem[]>('/content/news.json')) ?? []);

export const loadManifest = () =>
  cached('manifest', async () => (await fetchJson<ManifestEntry[]>('/content/manifest.json')) ?? []);

export interface SearchEntry extends ManifestEntry {
  /** Leading text of the page body, used for matching and result snippets */
  x: string;
}

export const loadSearchIndex = () =>
  cached('search', async () => (await fetchJson<SearchEntry[]>('/content/search.json')) ?? []);
