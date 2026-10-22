import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Printer } from 'lucide-react';
import { focusPageTitle } from '../../lib/focus';
import { Breadcrumbs } from './Breadcrumbs';
import { SplitWords } from './SplitWords';
import { ease } from '../../lib/motion';
import type { Crumb } from '../../lib/types';

// Each top-level area of the site keeps one colour field and one generated picture of its world, so interior
// pages feel related to their section. Pictures are illustrative (see README, "Asset provenance").
const AREAS = {
  mandates: { field: 'field-teal', art: 'generated/ip-volumes', position: '68% 50%' },
  about: { field: 'field-sky', art: 'generated/story-development', position: '60% 40%', ratio: 'tall' },
  news: { field: 'field-coral', art: 'generated/story-need', position: '60% 40%', ratio: 'tall' },
  notices: { field: 'field-saffron', art: 'generated/iprs-vials', position: '72% 50%' },
  other: { field: 'field-violet', art: 'generated/story-review', position: '55% 40%', ratio: 'tall' },
} as const;

function areaFor(pathname: string) {
  const top = pathname.split('/')[1] ?? '';
  if (top === 'mandates' || top === 'pharmacopoeial-harmonization') return AREAS.mandates;
  if (top === 'about-us') return AREAS.about;
  if (/^news|press/.test(top)) return AREAS.news;
  if (/careers|tenders|orders|rti/.test(top)) return AREAS.notices;
  return AREAS.other;
}

interface Props {
  title: string;
  crumbs?: Crumb[];
  eyebrow?: string;
  meta?: ReactNode;
  lead?: ReactNode;
  printable?: boolean;
}

/** Title band shared by every interior page: a colour field, the title rising in, and a capsule-shaped picture. */
export function PageHeader({ title, crumbs = [], eyebrow, meta, lead, printable = true }: Props) {
  const h1 = useRef<HTMLHeadingElement>(null);
  const band = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const area = areaFor(decodeURIComponent(pathname));
  const wide = !('ratio' in area);
  const { scrollYProgress } = useScroll({ target: band, offset: ['start start', 'end start'] });
  const artY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '22%']);

  useEffect(() => focusPageTitle(h1.current), [title]);

  return (
    <header ref={band} className={`field ${area.field} grain relative overflow-hidden`}>
      <motion.figure
        aria-hidden
        style={{ y: artY }}
        initial={{ clipPath: 'inset(0% 0% 0% 100% round 999px)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px)' }}
        transition={{ duration: 1.1, ease: ease.inOut, delay: 0.1 }}
        className="decor pointer-events-none absolute right-[-6rem] top-[11%] hidden h-[78%] w-[42%] overflow-hidden rounded-full bg-white/30 shadow-float lg:block"
      >
        <picture>
          <source type="image/avif" srcSet={`/images/${area.art}-${wide ? 768 : 640}.avif ${wide ? 768 : 640}w, /images/${area.art}-${wide ? 1280 : 1080}.avif ${wide ? 1280 : 1080}w`} sizes="42vw" />
          <img
            src={`/images/${area.art}-${wide ? 768 : 640}.webp`}
            srcSet={`/images/${area.art}-${wide ? 768 : 640}.webp ${wide ? 768 : 640}w, /images/${area.art}-${wide ? 1280 : 1080}.webp ${wide ? 1280 : 1080}w`}
            sizes="42vw"
            alt=""
            width={wide ? 1280 : 1080}
            height={wide ? 720 : 810}
            decoding="async"
            onError={e => { e.currentTarget.style.display = 'none'; }}
            style={{ objectPosition: area.position }}
            className="hero-scene-img scene-drift size-full object-cover"
          />
        </picture>
      </motion.figure>

      <div className="container-page relative pb-10 pt-6 md:pb-14 md:pt-8">
        <div className="lg:max-w-[56%]">
          <Breadcrumbs crumbs={crumbs} current={title} />
          <div className="mt-8 md:mt-10">
            {eyebrow && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: ease.out }} className="eyebrow">
                <span className="rule" aria-hidden />
                <span>{eyebrow}</span>
              </motion.p>
            )}
            <h1 ref={h1} tabIndex={-1} className="mt-3 text-[clamp(2.25rem,1.5rem+2.6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] outline-none">
              <SplitWords text={title} delay={0.1} inView={false} />
            </h1>
            {lead && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.35, ease: ease.out }} className="mt-4 max-w-3xl text-lg leading-relaxed">
                {lead}
              </motion.div>
            )}
          </div>
          {(meta || printable) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-6 flex flex-wrap items-center gap-2 text-[0.875rem]"
            >
              {meta && <span className="inline-flex items-center gap-x-4 rounded-full bg-white/70 px-4 py-2">{meta}</span>}
              {printable && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white/70 px-4 font-semibold transition-colors hover:bg-white"
                >
                  <Printer aria-hidden size={15} /> Print this page
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
