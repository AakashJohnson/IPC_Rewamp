import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { NewsRow } from '../../components/ui/NewsRow';
import { SmartLink } from '../../components/ui/SmartLink';
import { stagger } from '../../lib/motion';
import home from '../../content/home.json';
import type { NewsItem } from '../../lib/types';
import { iconFor } from '../../lib/icons';
import { IconBadge } from '../../components/ui/IconBadge';
import { DocumentStack } from '../../components/illustrations';

const items = home.latestNews as NewsItem[];

const desk = [
  { label: 'Orders, Circulars & Notices', to: '/orders-circulars-notices' },
  { label: 'Careers', to: '/careers' },
  { label: 'Tenders', to: '/tenders' },
  { label: 'PvPI News & Events', to: '/mandates/pvpi/news-events' },
  { label: 'Press Release', to: '/about-us/media-new/press-release' },
  { label: 'News Archive', to: '/news-archive' },
];

export function NewsHighlights() {
  const topics = useMemo(() => [...new Set(items.map(i => i.category))], []);
  const [topic, setTopic] = useState('');
  const shown = items.filter(i => !topic || i.category === topic).slice(0, 6);

  return (
    <section aria-labelledby="news-title" className="border-t border-line bg-white py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          id="news-title"
          index="06"
          eyebrow="Official updates"
          title="News & highlights"
          intro="Announcements, recruitment, training and events — dated and linked to the official notice."
          action={{ label: 'View all news', to: '/news-highlights' }}
        />
        <div className="mt-10 grid gap-12 md:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            <div role="group" aria-label="Filter latest news by topic" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {['', ...topics].map(t => (
                <button
                  key={t || 'all'}
                  type="button"
                  aria-pressed={topic === t}
                  onClick={() => setTopic(t)}
                  className={`h-9 shrink-0 rounded-sm border px-3.5 text-[0.8125rem] font-semibold transition-colors ${topic === t ? 'border-navy-900 bg-navy-900 text-white' : 'border-line-strong bg-white text-slate hover:border-navy-900 hover:text-ink'}`}
                >
                  {t || 'All'}
                </button>
              ))}
            </div>
            <motion.ul key={topic} variants={stagger(0.05)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-5 border-t border-line">
              {shown.map(n => <NewsRow key={n.route ?? n.href} item={n} />)}
            </motion.ul>
            <p className="sr-only" aria-live="polite">{shown.length} news items shown</p>
          </div>
          <aside className="lg:col-span-4">
            <div className="relative overflow-hidden rounded-md border border-line bg-paper p-6 md:p-7">
              <DocumentStack className="pointer-events-none absolute -right-8 -top-6 w-36 opacity-80" />
              <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] !text-muted">Notices & documents</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {desk.map(d => (
                  <li key={d.to}>
                    <SmartLink to={d.to} className="group flex items-center gap-3 py-3 font-medium text-ink hover:text-teal-800">
                      <IconBadge icon={iconFor(d.label)} size="sm" />
                      <span className="flex-1">{d.label}</span>
                      <ArrowRight aria-hidden size={16} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-teal-700" />
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
