import { Suspense, use, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchForm } from '../components/layout/SearchForm';
import { SmartLink } from '../components/ui/SmartLink';
import { EmptyState } from '../components/ui/EmptyState';
import { loadSearchIndex, type SearchEntry } from '../lib/content';
import { formatDate } from '../lib/format';
import { fadeUp, stagger } from '../lib/motion';
import { usePageSetup } from '../lib/page-context';

const KIND_LABEL: Record<string, string> = {
  news: 'News & Highlights',
  'gallery-album': 'Photo Gallery',
  'gallery-index': 'Photo Gallery',
  register: 'Documents',
  form: 'Online form',
  faq: 'Help',
  library: 'Library',
};

const FILTERS = [
  { id: '', label: 'All results' },
  { id: 'pages', label: 'Pages' },
  { id: 'news', label: 'News' },
  { id: 'gallery', label: 'Gallery' },
];

const filterOf = (k: string) => (k === 'news' ? 'news' : k.startsWith('gallery') ? 'gallery' : 'pages');

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i} className="rounded-xs bg-teal-100 px-0.5 text-ink">{part}</mark> : part));
}

function snippet(text: string, terms: string[]) {
  if (!text) return '';
  const lower = text.toLowerCase();
  const at = Math.min(...terms.map(t => lower.indexOf(t)).filter(i => i >= 0), Infinity);
  if (!Number.isFinite(at) || at < 80) return text.slice(0, 180) + (text.length > 180 ? '…' : '');
  return '…' + text.slice(at - 60, at + 140) + '…';
}

function score(e: SearchEntry, terms: string[]) {
  const title = e.t.toLowerCase();
  const body = e.x.toLowerCase();
  let s = 0;
  for (const t of terms) {
    if (title.includes(t)) s += title.startsWith(t) ? 12 : 8;
    else if (body.includes(t)) s += 2;
    else return 0; // every term must match somewhere
  }
  if (e.k !== 'news') s += 3; // section pages before individual announcements
  return s;
}

function Results({ q }: { q: string }) {
  const index = use(loadSearchIndex());
  const [filter, setFilter] = useState('');
  const [limit, setLimit] = useState(30);
  const terms = useMemo(() => q.toLowerCase().split(/\s+/).filter(t => t.length > 1), [q]);

  const results = useMemo(() => {
    if (!terms.length) return [];
    return index
      .map(e => ({ e, s: score(e, terms) }))
      .filter(r => r.s > 0)
      .sort((a, b) => b.s - a.s || (b.e.d ?? '').localeCompare(a.e.d ?? ''))
      .map(r => r.e);
  }, [index, terms]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { '': results.length };
    for (const r of results) c[filterOf(r.k)] = (c[filterOf(r.k)] ?? 0) + 1;
    return c;
  }, [results]);

  const shown = results.filter(r => !filter || filterOf(r.k) === filter);

  if (!terms.length) {
    return <EmptyState title="Enter a search term">Search across every page, notice, publication and photo album on the website.</EmptyState>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b border-line-strong pb-4" role="group" aria-label="Filter results">
        {FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => { setFilter(f.id); setLimit(30); }}
            className={`inline-flex h-10 items-center gap-2 rounded-sm border px-3.5 text-[0.875rem] font-semibold transition-colors ${filter === f.id ? 'border-navy-900 bg-navy-900 text-white' : 'border-line-strong bg-white text-ink hover:border-navy-900'}`}
          >
            {f.label} <span className="tabular opacity-70">{counts[f.id] ?? 0}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-meta text-muted" aria-live="polite">
        <span className="tabular font-semibold text-ink">{shown.length}</span> {shown.length === 1 ? 'result' : 'results'} for “{q}”
      </p>
      {shown.length ? (
        <>
          <motion.ul key={`${q}-${filter}`} variants={stagger(0.03)} initial="hidden" animate="visible" className="mt-2">
            {shown.slice(0, limit).map(r => (
              <motion.li key={r.r} variants={fadeUp} className="border-b border-line">
                <SmartLink to={r.r} className="group block py-5">
                  <span className="flex flex-wrap items-center gap-x-3 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal-700">
                    {KIND_LABEL[r.k] ?? 'Page'}
                    {r.d && <time dateTime={r.d} className="font-normal normal-case tracking-normal text-muted">{formatDate(r.d)}</time>}
                  </span>
                  <span className="mt-1.5 flex items-start justify-between gap-4">
                    <span className="text-[1.0625rem] font-semibold leading-snug text-ink group-hover:text-teal-800">{highlight(r.t, terms)}</span>
                    <ArrowRight aria-hidden size={18} className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-teal-700" />
                  </span>
                  {r.x && <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-muted">{highlight(snippet(r.x, terms), terms)}</span>}
                  <span className="mt-1 block truncate text-[0.75rem] text-muted">{r.r}</span>
                </SmartLink>
              </motion.li>
            ))}
          </motion.ul>
          {shown.length > limit && (
            <button type="button" onClick={() => setLimit(l => l + 30)} className="mt-8 inline-flex min-h-11 items-center rounded-sm border border-line-strong bg-white px-5 font-semibold text-navy-900 hover:border-navy-900">
              Show more results
            </button>
          )}
        </>
      ) : (
        <div className="mt-4">
          <EmptyState title="No results found">Try different or fewer words, or browse the <SmartLink to="/site-map" className="link-underline">site map</SmartLink>.</EmptyState>
        </div>
      )}
    </>
  );
}

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  usePageSetup(q ? `Search: ${q}` : 'Search');
  return (
    <>
      <PageHeader title="Search" eyebrow="Find information" printable={false} />
      <div className="container-page py-12 md:py-16">
        <div className="max-w-3xl">
          <SearchForm key={q} size="lg" />
        </div>
        <div className="mt-10 max-w-4xl">
          <Suspense fallback={<p className="text-muted" aria-busy="true">Searching…</p>}>
            <Results key={q} q={q} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
