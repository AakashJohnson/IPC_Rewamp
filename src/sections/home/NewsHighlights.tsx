import { useMemo, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartLink } from '../../components/ui/SmartLink';
import { formatDate, dateBlock } from '../../lib/format';
import { isRecent, TOPIC_ACCENT } from '../../lib/news';
import { topicIcon } from '../../lib/icons';
import { ease } from '../../lib/motion';
import home from '../../content/home.json';
import type { NewsItem } from '../../lib/types';
import { SectionBackdrop } from '../../components/effects/SectionBackdrop';

const items = home.latestNews as NewsItem[];

const desk = [
  { label: 'Orders, Circulars & Notices', to: '/orders-circulars-notices' },
  { label: 'Careers', to: '/careers' },
  { label: 'Tenders', to: '/tenders' },
  { label: 'PvPI News & Events', to: '/mandates/pvpi/news-events' },
  { label: 'Press Release', to: '/about-us/media-new/press-release' },
  { label: 'News Archive', to: '/news-archive' },
];

function Topic({ item }: { item: NewsItem }) {
  const Icon = topicIcon(item.category);
  return (
    <span className={`${TOPIC_ACCENT[item.category] ?? 'accent-teal'} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.8125rem] font-semibold`} style={{ background: 'var(--accent-wash)', color: 'var(--accent-ink)' }}>
      <Icon aria-hidden size={14} strokeWidth={2} />
      {item.category}
    </span>
  );
}

/** Latest official announcements: one featured notice set large, the rest as a dated register. */
export function NewsHighlights() {
  const topics = useMemo(() => [...new Set(items.map(i => i.category))], []);
  const [topic, setTopic] = useState('');
  const shown = items.filter(i => !topic || i.category === topic).slice(0, 6);
  const [lead, ...rest] = shown;
  const d = lead ? dateBlock(lead.date) : null;

  return (
    <section aria-labelledby="news-title" className="has-backdrop surface-aurora relative py-20 md:py-28">
      <SectionBackdrop variant="capsules" />
      <span aria-hidden className="aurora-blob -left-40 top-0 size-[36rem] bg-[#ffd9cf]" />
      <span aria-hidden className="aurora-blob right-[-12rem] top-[30%] size-[34rem] bg-[#d6ecff]" style={{ '--ax': '-10vw', '--t': '30s' } as CSSProperties} />
      <span aria-hidden className="aurora-blob bottom-[-10rem] left-[35%] size-[30rem] bg-[#e7defd]" style={{ '--t': '24s' } as CSSProperties} />
      <div className="container-page">
        <SectionHeading
          id="news-title"
          eyebrow="Official updates"
          title="Latest announcements"
          intro="Recruitment, training, publications and notices, each dated and linked to the official notice."
          action={{ label: 'All news & highlights', to: '/news-highlights' }}
        />

        <div role="group" aria-label="Filter announcements by topic" className="mt-10 flex flex-wrap gap-2">
          {['', ...topics].map(t => (
            <button
              key={t || 'all'}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className={`min-h-11 shrink-0 rounded-full px-4 text-[0.875rem] font-semibold transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 active:scale-[0.97] ${topic === t ? 'bg-navy-900 text-white' : 'chip-glass text-ink'}`}
            >
              {t || 'All topics'}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">{shown.length} announcements shown</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: ease.out } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="grid gap-8 lg:col-span-8 lg:grid-cols-8 lg:gap-10"
            >
              {lead && (
                <SmartLink
                  to={lead.route}
                  href={lead.href}
                  className={`field ${(TOPIC_ACCENT[lead.category] ?? 'accent-teal').replace('accent-', 'field-')} grain tilt group relative flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-8 lg:col-span-4`}
                >
                  <span aria-hidden className="glare" />
                  <span aria-hidden className="capsule absolute -right-20 bottom-28 h-20 w-52 rotate-[-28deg] opacity-90 transition-transform duration-700 group-hover:rotate-[-14deg] group-hover:translate-x-[-1.5rem]" style={{ background: 'linear-gradient(90deg, var(--accent) 0 50%, #fff 50% 100%)' }} />
                  <span className="relative">
                    <span className="flex flex-wrap items-center gap-2">
                      <Topic item={lead} />
                      {isRecent(lead) && <span className="rounded-full bg-white px-2.5 py-1 text-[0.8125rem] font-semibold text-ink">New</span>}
                    </span>
                    <span className="mt-6 block max-w-[22ch] font-display text-[1.5rem] font-semibold leading-[1.15] [overflow-wrap:anywhere] sm:text-[1.625rem]">{lead.title}</span>
                  </span>
                  <span className="relative mt-10 flex items-end justify-between gap-4">
                    {d && (
                      <time dateTime={lead.date} className="tabular leading-none">
                        <span className="block font-display text-[4.5rem] font-semibold tracking-[-0.04em]">{d.day}</span>
                        <span className="mt-1 block text-[1rem] font-semibold">{d.month} {d.year}</span>
                      </time>
                    )}
                    <span aria-hidden className="flex size-14 items-center justify-center rounded-full bg-navy-900 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45">
                      <ArrowRight size={20} />
                    </span>
                  </span>
                </SmartLink>
              )}
              <ul className="lg:col-span-4">
                {rest.map(n => (
                  <li key={n.route ?? n.href} className="mb-2">
                    <SmartLink to={n.route} href={n.href} className="tex-card edge-glow group block rounded-[var(--radius-lg)] bg-white/80 p-4 shadow-hair transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lift">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <Topic item={n} />
                        <time dateTime={n.date} className="tabular text-[0.875rem] text-muted">{formatDate(n.date)}</time>
                      </span>
                      <span className="mt-2 line-clamp-3 block font-medium leading-snug text-ink [overflow-wrap:anywhere]">
                        <span className="link-sweep">{n.title}</span>
                      </span>
                    </SmartLink>
                  </li>
                ))}
                {shown.length === 0 && <li className="py-6 text-slate">No announcements in this topic yet.</li>}
              </ul>
            </motion.div>
          </AnimatePresence>

          <aside aria-labelledby="desk-title" className="lg:col-span-4">
            <div className="field field-violet grain spotlight overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-8">
              <h3 id="desk-title" className="text-[1.375rem] font-semibold">Notices & documents</h3>
              <ul className="mt-5 space-y-2">
                {desk.map(item => (
                  <li key={item.to}>
                    <SmartLink to={item.to} className="chip-glass group flex min-h-12 items-center justify-between gap-3 rounded-full px-4 font-semibold transition-[background-color,transform] duration-200 hover:translate-x-1 hover:bg-white">
                      <span>{item.label}</span>
                      <ArrowRight aria-hidden size={17} className="shrink-0 transition-transform group-hover:translate-x-1" />
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
