import { Fragment, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react';
import { BookOpen, CalendarCheck2, FlaskConical, Landmark, Scale } from 'lucide-react';
import { EditorialButton } from '../../components/ui/EditorialButton';
import { ConcentricArcs } from '../../components/textures/ConcentricArcs';
import { GlowOrbs, MoleculeField } from '../../components/effects/AnimatedBackdrop';
import { Tilt } from '../../components/effects/Interactive';
import { CountUp } from '../../components/effects/CountUp';
import { IconBadge } from '../../components/ui/IconBadge';
import { Molecule } from '../../components/illustrations';
import { ease } from '../../lib/motion';
import { about, institution, ip2026 } from '../../config/site';

const HEADLINE = ['Setting', 'the', 'standards', 'for', 'quality', 'medicines', 'in', 'India'];

// One coordinated sequence: eyebrow → headline words → copy → actions → plate → instrument rings.
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: ease.out } },
};
const words: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: '0.45em' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } },
};

const facts = [
  { term: 'Legal status', detail: 'Official book of standards for drugs under the Second Schedule of the Drugs and Cosmetics Act 1940', icon: Scale },
  { term: 'Latest edition', detail: `Indian Pharmacopoeia 2026, the ${ip2026.edition}`, icon: BookOpen },
  { term: 'Autonomous body', detail: 'Fully operational from 1 January 2009', icon: Landmark },
];

export function HeroSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // Parallax ranges collapse to zero movement for reduced motion.
  const range = (to: number) => (reduce ? [0, 0] : [0, to]);
  const textY = useTransform(scrollYProgress, [0, 1], range(-60));
  const plateY = useTransform(scrollYProgress, [0, 1], range(90));
  const ringsRotate = useTransform(scrollYProgress, [0, 1], range(60));
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="texture-paper relative overflow-hidden border-b border-line">
      <div aria-hidden className="decor texture-grid fade-mask-radial absolute inset-0" />
      <GlowOrbs />
      <MoleculeField />

      <div className="container-page relative grid items-center gap-12 pb-16 pt-10 md:pb-24 md:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-16">
        <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-7">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.p variants={rise} className="eyebrow">
              <span className="relative mr-1 flex size-2.5" aria-hidden>
                <span className="animate-ping-soft absolute inline-flex size-full rounded-full bg-teal-600" />
                <span className="relative inline-flex size-2.5 rounded-full bg-teal-600" />
              </span>
              <span>{institution.ministryEn} · {institution.governmentEn}</span>
            </motion.p>
            <motion.p variants={rise} lang="hi" className="mt-5 text-[1.0625rem] font-medium text-navy-800">
              {institution.nameHi}
            </motion.p>
            <motion.h1 id="hero-title" variants={words} className="mt-2 max-w-[15ch] text-display font-semibold tracking-[-0.025em] text-ink">
              {HEADLINE.map((w, i) => (
                <Fragment key={i}>
                  <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <motion.span
                      variants={word}
                      className={`inline-block ${w === 'quality' || w === 'medicines' ? 'bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent' : ''}`}
                    >
                      {w}
                    </motion.span>
                  </span>
                  {i < HEADLINE.length - 1 && ' '}
                </Fragment>
              ))}
            </motion.h1>
            <motion.p variants={rise} className="mt-6 max-w-[58ch] text-[1.125rem] leading-relaxed text-slate md:text-[1.1875rem]">
              {about.lead} {about.standards}
            </motion.p>
            <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
              <EditorialButton to="/mandates/indian-pharmacopoeia">Explore Indian Pharmacopoeia</EditorialButton>
              <EditorialButton to="/news-highlights" variant="secondary">Latest notices</EditorialButton>
            </motion.div>
            <motion.dl variants={rise} className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line/70 sm:grid-cols-3 md:mt-12">
              {facts.map(f => (
                <div key={f.term} className="group bg-white/80 p-4 backdrop-blur-[2px]">
                  <dt className="flex items-center gap-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal-700">
                    <IconBadge icon={f.icon} size="sm" />
                    {f.term}
                  </dt>
                  <dd className="mt-2 text-[0.875rem] leading-snug text-ink">{f.detail}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: plateY }} className="relative lg:col-span-5">
          <motion.div
            aria-hidden
            style={{ rotate: ringsRotate }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: ease.out, delay: 0.3 }}
            className="decor absolute left-1/2 top-1/2 w-[135%] -translate-x-1/2 -translate-y-1/2 text-navy-900/[0.09]"
          >
            <ConcentricArcs />
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: ease.out, delay: 0.45 }}
            className="relative mx-auto max-w-[15rem] sm:max-w-[22rem] lg:max-w-none lg:pl-6 xl:pl-10"
          >
            <Tilt max={7}>
              <div className="relative border border-line-strong bg-white p-3 shadow-lift sm:p-4">
                {['left-0 top-0', 'right-0 top-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map(pos => (
                  <span key={pos} aria-hidden className={`decor absolute size-4 ${pos} before:absolute before:left-[-9px] before:top-0 before:h-px before:w-3 before:bg-navy-900/50 after:absolute after:left-0 after:top-[-9px] after:h-3 after:w-px after:bg-navy-900/50`} />
                ))}
                <img
                  src="/images/official/ip-2026-volumes-900.webp"
                  srcSet="/images/official/ip-2026-volumes-480.webp 480w, /images/official/ip-2026-volumes-900.webp 900w, /images/official/ip-2026-volumes-1400.webp 1400w"
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 22rem, 15rem"
                  width={900}
                  height={1094}
                  alt="The four volumes of Indian Pharmacopoeia 2026 in their slipcase"
                  fetchPriority="high"
                  className="block h-auto w-full"
                />
              </div>
            </Tilt>

            {/* Floating fact cards — official figures from the IP 2026 release */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.1, ease: ease.out }}
              className="absolute -left-4 top-[18%] hidden sm:block lg:-left-10"
            >
              <div className="animate-float group flex items-center gap-3 rounded-md border border-line bg-white/95 p-3 pr-4 shadow-lift backdrop-blur">
                <IconBadge icon={FlaskConical} size="sm" />
                <p className="leading-tight">
                  <CountUp value={3340} className="tabular block text-[1.25rem] font-bold text-ink" />
                  <span className="text-[0.75rem] text-muted">monographs in IP 2026</span>
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.3, ease: ease.out }}
              className="absolute -right-3 bottom-[16%] hidden sm:block lg:-right-6"
            >
              <div className="animate-float-slow group flex items-center gap-3 rounded-md border border-line bg-white/95 p-3 pr-4 shadow-lift backdrop-blur">
                <IconBadge icon={CalendarCheck2} size="sm" tone="saffron" />
                <p className="leading-tight">
                  <span className="block text-[0.9375rem] font-bold text-ink">Released {ip2026.released}</span>
                  <span className="text-[0.75rem] text-muted">{ip2026.newMonographs} new monographs</span>
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5, ease: ease.out }}
              className="decor absolute -right-6 -top-8 hidden w-28 lg:block"
            >
              <Molecule className="w-full" />
            </motion.div>

            <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-meta text-muted">
              <span><span className="font-semibold text-ink">Indian Pharmacopoeia 2026</span> · {ip2026.edition}</span>
              <span className="tabular">Vol. I–IV</span>
            </figcaption>
          </motion.figure>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div aria-hidden className="decor absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted lg:flex">
        <span>Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-line-strong pt-1.5">
          <span className="block h-2 w-0.5 rounded-full bg-teal-600" style={{ animation: 'scroll-cue 1.8s ease-in-out infinite' }} />
        </span>
      </div>
    </section>
  );
}
