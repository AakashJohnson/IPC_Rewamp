import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SectionBackdrop, type BackdropVariant } from '../effects/SectionBackdrop';
import { SmartLink } from './SmartLink';
import { groupOf } from '../../lib/nav';
import { iconFor } from '../../lib/icons';
import { inView, pop, stagger } from '../../lib/motion';
import type { NavNode } from '../../lib/types';

// Interior-page surface: an aurora ground with an animated texture chosen by site area, the page content on
// top, and an "Explore" band at the foot so short pages never end abruptly. Area accents match PageHeader.
const AREAS: { test: (top: string) => boolean; accent: string; tone: string; variant: BackdropVariant }[] = [
  { test: t => t === 'mandates' || t === 'pharmacopoeial-harmonization', accent: 'accent-teal', tone: '#14b3a5', variant: 'hex' },
  { test: t => t === 'about-us', accent: 'accent-sky', tone: '#3aa5ea', variant: 'molecules' },
  { test: t => /^news|press/.test(t), accent: 'accent-coral', tone: '#f26a55', variant: 'capsules' },
  { test: t => /careers|tenders|orders|rti/.test(t), accent: 'accent-saffron', tone: '#f39a2b', variant: 'dna' },
];
const OTHER = { accent: 'accent-violet', tone: '#7b5cf0', variant: 'capsules' as BackdropVariant };

function areaFor(pathname: string) {
  const top = pathname.split('/')[1] ?? '';
  return AREAS.find(a => a.test(top)) ?? OTHER;
}

/** Reveals blocks of official CMS content as they scroll into view (one observer, class toggles only). */
function useProseReveal(root: React.RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const blocks = [...el.querySelectorAll<HTMLElement>('.ipc-prose > *')];
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    blocks.forEach(b => {
      const r = b.getBoundingClientRect();
      if (r.top < window.innerHeight) return; // already on screen: never hide it
      b.classList.add('reveal-block');
      io.observe(b);
    });
    return () => io.disconnect();
  }, [root, key]);
}

function exploreLinks(pathname: string): NavNode[] {
  const g = groupOf(pathname);
  if (!g) return [];
  const pool = g.columns ? g.columns.flatMap(c => c.items) : g.children ?? [];
  return pool.filter(n => n.to !== pathname && (n.to || n.href)).slice(0, 6);
}

export function PageCanvas({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const route = decodeURIComponent(pathname);
  const area = areaFor(route);
  const ref = useRef<HTMLDivElement>(null);
  useProseReveal(ref, route);
  const group = groupOf(route);
  const links = exploreLinks(route);

  return (
    <div ref={ref} className={`page-canvas ${area.accent} has-backdrop surface-aurora relative overflow-hidden`}>
      <SectionBackdrop variant={area.variant} tone={area.tone} />
      <SectionBackdrop variant="aurora" tone={area.tone} />
      {children}
      {links.length > 0 && (
        <section aria-labelledby="explore-title" className="container-page pb-16 md:pb-20">
          <div className="field grain relative overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-8" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${area.tone} 22%, #fff), #fff 60%, color-mix(in srgb, ${area.tone} 14%, #fff))` }}>
            <h2 id="explore-title" className="text-[1.5rem] font-semibold">Explore {group?.label}</h2>
            <motion.ul variants={stagger(0.05)} {...inView} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {links.map(n => {
                const Icon = iconFor(n.label);
                return (
                  <motion.li key={`${n.label}-${n.to ?? n.href}`} variants={pop}>
                    <SmartLink to={n.to} href={n.href} file={n.file} className="tex-card edge-glow tilt group relative flex h-full items-center gap-3 overflow-hidden rounded-[var(--radius-lg)] bg-white p-4 shadow-hair">
                      <span aria-hidden className="glare" />
                      <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:-rotate-12" style={{ background: area.tone }}>
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1 font-semibold leading-snug text-ink">{n.label}</span>
                      {n.to ? <ArrowRight aria-hidden size={17} className="shrink-0 transition-transform group-hover:translate-x-1" /> : <ArrowUpRight aria-hidden size={17} className="shrink-0" />}
                    </SmartLink>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </section>
      )}
    </div>
  );
}
