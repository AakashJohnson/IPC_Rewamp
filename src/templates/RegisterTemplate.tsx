import { useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DocumentRow } from '../components/ui/DocumentRow';
import { EmptyState } from '../components/ui/EmptyState';
import { SmartLink } from '../components/ui/SmartLink';
import { SourceNote, UpdatedMeta } from './shared';
import { stagger } from '../lib/motion';
import { usePageSetup } from '../lib/page-context';
import { groupOf, sideNavFor } from '../lib/nav';
import { SideNav } from '../components/ui/SideNav';
import type { RegisterPage } from '../lib/types';

type Sort = 'newest' | 'oldest' | 'title';

const TITLES: Record<string, string> = {
  '/careers': 'Careers',
  '/careers/careers_archive': 'Career Archives',
  '/tenders': 'Tenders',
};

/** Official document registers: careers, tenders, orders and circulars. */
export function RegisterTemplate({ page }: { page: RegisterPage }) {
  const title = TITLES[page.route] ?? page.title;
  usePageSetup(title, page.hiUrl);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('newest');
  const searchId = useId();
  const sortId = useId();
  const side = sideNavFor(page.route);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = term ? page.rows.filter(r => r.title.toLowerCase().includes(term)) : page.rows;
    return [...filtered].sort((a, b) =>
      sort === 'title' ? a.title.localeCompare(b.title)
        : sort === 'oldest' ? (a.date ?? '').localeCompare(b.date ?? '')
          : (b.date ?? '').localeCompare(a.date ?? ''));
  }, [page.rows, q, sort]);

  const isTenders = page.route === '/tenders';

  return (
    <>
      <PageHeader title={title} crumbs={page.crumbs.length > 1 ? page.crumbs : []} eyebrow={groupOf(page.route)?.label ?? 'Notices'} meta={<UpdatedMeta updated={page.updated} />} />
      <div className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
        <div className={side ? 'min-w-0 lg:order-2 lg:col-span-9' : 'min-w-0 lg:col-span-12'}>
          {page.rows.length > 0 ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                  <label htmlFor={searchId} className="text-meta font-semibold text-ink">Filter by title</label>
                  <Search aria-hidden size={17} className="pointer-events-none absolute bottom-3.5 left-3 text-muted" />
                  <input
                    id={searchId}
                    type="search"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-sm border border-line-strong bg-white pl-10 pr-3 text-ink focus:border-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={sortId} className="text-meta font-semibold text-ink">Sort</label>
                  <select
                    id={sortId}
                    value={sort}
                    onChange={e => setSort(e.target.value as Sort)}
                    className="mt-1.5 block h-11 rounded-sm border border-line-strong bg-white px-3 text-ink focus:border-teal-600 focus:outline-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title">Title (A–Z)</option>
                  </select>
                </div>
              </div>
              <p className="mt-6 text-meta text-muted" aria-live="polite">
                Showing <span className="tabular font-semibold text-ink">{rows.length}</span> of <span className="tabular">{page.rows.length}</span> documents
              </p>
              {rows.length > 0 ? (
                <motion.ul key={`${q}-${sort}`} variants={stagger(0.03)} initial="hidden" animate="visible" className="mt-3 overflow-hidden rounded-sm border border-line bg-white">
                  {rows.map((r, i) => <DocumentRow key={`${r.href}-${i}`} row={r} showExpiry={page.hasExpiry} />)}
                </motion.ul>
              ) : (
                <div className="mt-3"><EmptyState title="No documents match your filter" /></div>
              )}
            </>
          ) : (
            <EmptyState title={isTenders ? 'No tenders are currently listed' : 'No documents are currently listed'}>
              {isTenders
                ? 'The Commission has no tender notices listed at present. Government tenders are also published on the Central Public Procurement Portal.'
                : 'Please check again later.'}
              {isTenders && (
                <SmartLink href="https://eprocure.gov.in/cppp/" className="link-underline mt-3 inline-flex items-center gap-1">
                  Central Public Procurement Portal <ArrowUpRight aria-hidden size={14} />
                </SmartLink>
              )}
            </EmptyState>
          )}

          {page.links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3">
              {page.links.map(l => (
                <li key={l.label}>
                  <SmartLink to={l.to} href={l.href} className="group inline-flex items-center gap-2 rounded-sm border border-line-strong bg-white px-4 py-2.5 text-[0.9375rem] font-semibold text-navy-900 hover:border-navy-900">
                    {l.label} <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-1" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}
          <SourceNote official={page.official} updated={page.updated} />
        </div>
        {side && <aside className="lg:order-1 lg:col-span-3"><SideNav model={side} /></aside>}
      </div>
    </>
  );
}
