import { Suspense, use } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { PageCanvas } from '../components/ui/PageCanvas';
import { RichContent } from '../components/ui/RichContent';
import { EmptyState } from '../components/ui/EmptyState';
import { SmartLink } from '../components/ui/SmartLink';
import { NewsRow } from '../components/ui/NewsRow';
import { SourceNote } from './shared';
import { loadNews } from '../lib/content';
import { formatDate } from '../lib/format';
import { ease, stagger } from '../lib/motion';
import { usePageSetup } from '../lib/page-context';
import type { BodyPage } from '../lib/types';

function Related({ page }: { page: BodyPage }) {
  const news = use(loadNews());
  const index = news.findIndex(n => n.route === page.route);
  const newer = index > 0 ? news[index - 1] : undefined;
  const older = index >= 0 && index < news.length - 1 ? news[index + 1] : undefined;
  const related = news.filter(n => n.route !== page.route && n.category === page.category).slice(0, 4);

  return (
    <>
      {(newer || older) && (
        <nav aria-label="Adjacent news" className="mt-12 grid gap-3 sm:grid-cols-2">
          {older ? (
            <SmartLink to={older.route} href={older.href} className="group bg-white p-5 hover:bg-teal-50/60">
              <span className="flex items-center gap-2 text-meta font-semibold uppercase tracking-[0.1em] text-muted">
                <ArrowLeft aria-hidden size={14} className="transition-transform group-hover:-translate-x-1" /> Previous
              </span>
              <span className="mt-2 line-clamp-2 block font-medium leading-snug text-ink">{older.title}</span>
            </SmartLink>
          ) : <span className="hidden bg-white sm:block" />}
          {newer ? (
            <SmartLink to={newer.route} href={newer.href} className="group bg-white p-5 text-right hover:bg-teal-50/60">
              <span className="flex items-center justify-end gap-2 text-meta font-semibold uppercase tracking-[0.1em] text-muted">
                Next <ArrowRight aria-hidden size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 line-clamp-2 block font-medium leading-snug text-ink">{newer.title}</span>
            </SmartLink>
          ) : <span className="hidden bg-white sm:block" />}
        </nav>
      )}
      {related.length > 0 && (
        <section aria-labelledby="related-news" className="mt-14">
          <h2 id="related-news" className="text-h3">More in {page.category}</h2>
          <motion.ul variants={stagger(0.05)} initial="hidden" animate="visible" className="mt-4 border-t border-line">
            {related.map(n => <NewsRow key={n.route ?? n.href} item={n} compact />)}
          </motion.ul>
        </section>
      )}
    </>
  );
}

export function NewsArticleTemplate({ page }: { page: BodyPage }) {
  usePageSetup(page.title, page.hiUrl);
  return (
    <>
      <PageHeader
        title={page.title}
        crumbs={[{ label: 'News & Highlights', href: '/news-highlights' }]}
        eyebrow={`News & Highlights${page.category ? ` · ${page.category}` : ''}`}
        meta={page.date ? <span>Published <time dateTime={page.date}>{formatDate(page.date)}</time></span> : null}
      />
      <PageCanvas>
      <div className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-12">
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: ease.out }}
          className="page-sheet min-w-0 lg:col-span-8"
        >
          {page.bodyHtml ? (
            <RichContent html={page.bodyHtml} />
          ) : (
            <EmptyState title="This announcement has no further details">
              The official website lists this announcement by title only.
            </EmptyState>
          )}
          <Suspense fallback={null}>
            <Related page={page} />
          </Suspense>
          <SourceNote official={page.official} updated={page.updated} />
        </motion.article>
        <aside className="side-card no-print self-start lg:sticky lg:top-32 lg:col-span-4 lg:col-start-9 xl:col-span-3 xl:col-start-10">
          <div className="lg:sticky lg:top-24">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Official updates</p>
            <ul className="mt-3 space-y-2.5 text-[0.9375rem]">
              <li><SmartLink to="/news-highlights" className="link-underline">All News & Highlights</SmartLink></li>
              <li><SmartLink to="/news-archive" className="link-underline">News archive</SmartLink></li>
              <li><SmartLink to="/orders-circulars-notices" className="link-underline">Orders, Circulars & Notices</SmartLink></li>
              <li><SmartLink to="/careers" className="link-underline">Careers</SmartLink></li>
              <li><SmartLink to="/tenders" className="link-underline">Tenders</SmartLink></li>
            </ul>
          </div>
        </aside>
      </div>
      </PageCanvas>
    </>
  );
}
