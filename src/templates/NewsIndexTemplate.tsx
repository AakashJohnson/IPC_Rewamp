import { Suspense, use, useId, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Search, X } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { NewsRow } from '../components/ui/NewsRow';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { SmartLink } from '../components/ui/SmartLink';
import { loadNews } from '../lib/content';
import { stagger } from '../lib/motion';
import { usePageSetup } from '../lib/page-context';
import type { NewsItem, SimplePage } from '../lib/types';

const PAGE_SIZE = 15;
const TOPICS = ['Recruitment', 'Training & Internships', 'Events', 'Publications & Standards', 'Notices & Tenders', 'Announcements'];

function NewsList({ archive }: { archive: boolean }) {
  const all = use(loadNews());
  const [params, setParams] = useSearchParams();
  const listTop = useRef<HTMLDivElement>(null);
  const searchId = useId();
  const yearId = useId();

  const q = params.get('q') ?? '';
  const topic = params.get('topic') ?? '';
  const year = params.get('year') ?? '';
  // Legacy CMS pagination (?start=20) maps onto pages.
  const legacyStart = Number(params.get('start') ?? 0);
  const page = Math.max(1, Number(params.get('page') ?? (legacyStart ? Math.floor(legacyStart / PAGE_SIZE) + 1 : 1)) || 1);

  const source = useMemo(() => all.filter(n => (archive ? n.archive : n.current)), [all, archive]);
  const years = useMemo(() => [...new Set(source.map(n => n.date?.slice(0, 4)).filter(Boolean) as string[])].sort().reverse(), [source]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const n of source) c[n.category] = (c[n.category] ?? 0) + 1;
    return c;
  }, [source]);

  const filtered = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return source.filter((n: NewsItem) =>
      (!topic || n.category === topic)
      && (!year || n.date?.startsWith(year))
      && terms.every(t => n.title.toLowerCase().includes(t)));
  }, [source, q, topic, year]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const update = (patch: Record<string, string>, keepPage = false) => {
    const next = new URLSearchParams(params);
    next.delete('start');
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    if (!keepPage) next.delete('page');
    setParams(next, { replace: !keepPage, preventScrollReset: true });
  };

  const goToPage = (p: number) => {
    update({ page: p > 1 ? String(p) : '' }, true);
    listTop.current?.scrollIntoView({ block: 'start' });
  };

  const hasFilters = !!(q || topic || year);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        {/* Phones: search + year side by side, topics as a scrolling chip row. Desktop: a sticky sidebar. */}
        <div className="grid grid-cols-[1fr_8.5rem] gap-x-3 gap-y-5 lg:sticky lg:top-24 lg:block lg:space-y-7">
          <div className="relative">
            <label htmlFor={searchId} className="text-meta font-semibold text-ink">Search headlines</label>
            <Search aria-hidden size={17} className="pointer-events-none absolute bottom-3.5 left-3 text-muted" />
            <input
              id={searchId}
              type="search"
              defaultValue={q}
              onChange={e => update({ q: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-sm border border-line-strong bg-white pl-10 pr-3 text-ink focus:border-teal-600 focus:outline-none"
            />
          </div>
          <fieldset className="order-3 col-span-2 min-w-0">
            <legend className="text-meta font-semibold text-ink">Topic</legend>
            <p className="mt-0.5 hidden text-[0.75rem] text-muted lg:block">Grouped by keywords in each headline.</p>
            <ul className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:mt-3 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
              {[['', 'All topics', source.length] as const, ...TOPICS.filter(t => counts[t]).map(t => [t, t, counts[t]] as const)].map(([value, label, count]) => (
                <li key={label} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={topic === value}
                    onClick={() => update({ topic: value })}
                    className={`flex h-9 items-center gap-2 whitespace-nowrap rounded-sm border px-3 text-[0.875rem] transition-colors lg:h-auto lg:w-full lg:justify-between lg:gap-3 lg:whitespace-normal lg:rounded-xs lg:border-0 lg:border-l-2 lg:py-2 lg:text-left lg:text-[0.9375rem] ${topic === value ? 'border-navy-900 bg-navy-900 font-semibold text-white lg:border-teal-600 lg:bg-white lg:text-ink' : 'border-line-strong bg-white text-slate hover:text-ink lg:border-transparent lg:bg-transparent lg:text-muted lg:hover:bg-white/70'}`}
                  >
                    <span>{label}</span>
                    <span className="tabular text-meta">{count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>
          <div className="order-2 lg:order-none">
            <label htmlFor={yearId} className="text-meta font-semibold text-ink">Year</label>
            <select
              id={yearId}
              value={year}
              onChange={e => update({ year: e.target.value })}
              className="mt-1.5 block h-11 w-full rounded-sm border border-line-strong bg-white px-3 text-ink focus:border-teal-600 focus:outline-none"
            >
              <option value="">All years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <SmartLink to={archive ? '/news-highlights' : '/news-archive'} className="group order-4 col-span-2 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-teal-700">
            {archive ? 'Current News & Highlights' : 'View the news archive'}
            <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-1" />
          </SmartLink>
        </div>
      </aside>

      <div className="min-w-0 lg:col-span-9" ref={listTop}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-strong pb-3">
          <p className="text-meta text-muted" aria-live="polite">
            <span className="tabular font-semibold text-ink">{filtered.length}</span> {filtered.length === 1 ? 'item' : 'items'}
            {topic && <> in <span className="font-semibold text-ink">{topic}</span></>}
            {year && <> from <span className="font-semibold text-ink">{year}</span></>}
          </p>
          {hasFilters && (
            <button type="button" onClick={() => { update({ q: '', topic: '', year: '' }); const el = document.getElementById(searchId) as HTMLInputElement | null; if (el) el.value = ''; }}
              className="inline-flex items-center gap-1.5 text-meta font-semibold text-teal-700 hover:text-teal-800">
              <X aria-hidden size={14} /> Clear filters
            </button>
          )}
        </div>
        {visible.length ? (
          <motion.ul key={`${q}|${topic}|${year}|${current}`} variants={stagger(0.035)} initial="hidden" animate="visible">
            {visible.map(n => <NewsRow key={n.route ?? n.href ?? n.title} item={n} />)}
          </motion.ul>
        ) : (
          <div className="mt-6"><EmptyState title="No news items match these filters" /></div>
        )}
        <Pagination page={current} pageCount={pageCount} onChange={goToPage} label="News pages" />
      </div>
    </div>
  );
}

export function NewsIndexTemplate({ page }: { page: SimplePage }) {
  const archive = page.kind === 'news-archive';
  const title = archive ? 'News Archive' : 'News & Highlights';
  usePageSetup(title, page.hiUrl);
  return (
    <>
      <PageHeader
        title={title}
        crumbs={archive ? [{ label: 'News & Highlights', href: '/news-highlights' }] : []}
        eyebrow="Official updates"
        lead={archive ? 'Earlier announcements, notices and highlights from the Indian Pharmacopoeia Commission.' : 'Announcements, notices, recruitment, training and events from the Indian Pharmacopoeia Commission.'}
        printable={false}
      />
      <div className="container-page py-12 md:py-16">
        <Suspense fallback={<p className="text-muted" aria-busy="true">Loading news…</p>}>
          <NewsList archive={archive} />
        </Suspense>
      </div>
    </>
  );
}
