import { lazy, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { EditorialButton } from '../../components/ui/EditorialButton';
import { SmartLink } from '../../components/ui/SmartLink';
import { SplitWords } from '../../components/ui/SplitWords';
import { heroSlides, srcSets, type HeroSlide, type ResponsiveImage } from '../../config/hero';
import { markHeroReady } from '../../lib/boot';
import { ease } from '../../lib/motion';
import { institution } from '../../config/site';

const LabScene = lazy(() => import('../../components/three/LabScene').then(m => ({ default: m.LabScene })));

const SLIDE_MS = 8000;
const ACCENT_HEX: Record<HeroSlide['accent'], string> = {
  teal: '#14b3a5', saffron: '#f39a2b', sky: '#3aa5ea', coral: '#f26a55', violet: '#7b5cf0',
};

const copy: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.25, ease: ease.inOut } },
};
const line: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out } },
};

function Picture({ img, sizes, alt, eager, position, onLoad, className }: {
  img: ResponsiveImage; sizes: string; alt: string; eager?: boolean; position?: string; onLoad?: () => void; className?: string;
}) {
  const s = srcSets(img);
  return (
    <picture>
      <source type="image/avif" srcSet={s.avif} sizes={sizes} />
      <source type="image/webp" srcSet={s.webp} sizes={sizes} />
      <img
        src={s.fallback} width={img.width} height={img.height} alt={alt}
        loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding={eager ? 'sync' : 'async'}
        onLoad={onLoad} onError={onLoad}
        style={position ? { objectPosition: position } : undefined}
        className={className}
      />
    </picture>
  );
}

function preload(slide: HeroSlide) {
  const ext = document.createElement('canvas').toDataURL('image/avif').startsWith('data:image/avif') ? 'avif' : 'webp';
  const target = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) * 0.6;
  const w = slide.art.widths.find(x => x >= target) ?? slide.art.widths[slide.art.widths.length - 1];
  const i = new Image();
  i.decoding = 'async';
  i.src = `/images/${slide.art.stem}-${w}.${ext}`;
}

/**
 * Signature hero. Each slide sits on its own colour field; its art (a generated illustration) fills a giant
 * capsule — the page's motif — that enters from the right. A live 3D layer of glass molecules and capsules
 * floats behind and around it and follows the pointer. Leader art is always captioned "Digital illustration".
 */
export function HeroCarousel() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const artBox = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const remaining = useRef({ index: 0, ms: SLIDE_MS });

  const count = heroSlides.length;
  const slide = heroSlides[index];
  // Hover never pauses: only the pause button, keyboard focus (WCAG 2.2.2), a hidden tab or scrolling away.
  const paused = userPaused || focused || hidden || offscreen;

  const { scrollYProgress } = useScroll({ target: stage, offset: ['start start', 'end start'] });
  const artY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '18%']);
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-12%']);

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => { remaining.current = { index, ms: SLIDE_MS }; }, [index]);
  useEffect(() => {
    if (paused) return;
    const ms = remaining.current.index === index ? remaining.current.ms : SLIDE_MS;
    const started = performance.now();
    timer.current = window.setTimeout(() => go(index + 1), ms);
    return () => {
      window.clearTimeout(timer.current);
      remaining.current = { index, ms: Math.max(0, ms - (performance.now() - started)) };
    };
  }, [paused, index, go]);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The 3D layer loads after the first paint, on screens wide enough to show it around the copy.
  useEffect(() => {
    const id = window.setTimeout(() => setWebgl(window.matchMedia('(min-width: 64rem)').matches), 900);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const next = heroSlides[(index + 1) % count];
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const id = ric(() => preload(next));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, [index, count]);

  // Pointer depth for the art and the giant word (CSS variables only).
  useEffect(() => {
    const el = stage.current;
    if (!el || reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    const onLeave = () => { el.style.setProperty('--px', '0'); el.style.setProperty('--py', '0'); };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => { cancelAnimationFrame(frame); el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); };
  }, [reduce]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
  };

  const ctrl = 'inline-flex size-12 items-center justify-center rounded-full bg-white text-navy-900 shadow-hair transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-navy-900 hover:text-white active:scale-95';

  return (
    <section
      ref={stage}
      aria-roledescription="carousel"
      aria-label="Highlights from the Commission"
      data-paused={paused}
      data-user-paused={userPaused}
      style={{ '--slide-ms': `${SLIDE_MS}ms` } as CSSProperties}
      // The whole hero, controls included, fits in one screen below the 108px header.
      className="hero-stage relative isolate h-[calc(100svh-6.75rem)] min-h-[38rem] max-h-[50rem] overflow-hidden lg:min-h-[34rem] lg:max-h-[46rem]"
      onFocus={() => setFocused(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}
    >
      {/* Colour field of the current slide; fields cross-fade into one another. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.accent}
          aria-hidden
          className={`field field-${slide.accent} grain absolute inset-0 -z-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.9, ease: ease.inOut } }}
          exit={{ opacity: 0, transition: { duration: 0.9 } }}
        />
      </AnimatePresence>

      {/* Giant outlined word on a deep layer. */}
      <div aria-hidden className="hero-layer decor pointer-events-none absolute -left-4 bottom-[-0.12em] z-0 hidden select-none lg:block" style={{ '--depth': -26 } as CSSProperties}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={slide.word}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 1, ease: ease.out } }}
            exit={{ opacity: 0, x: 60, transition: { duration: 0.4 } }}
            className="block whitespace-nowrap font-display text-[clamp(9rem,17vw,17rem)] font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_var(--hero-stroke)]"
            style={{ '--hero-stroke': 'color-mix(in srgb, var(--field-ink, #0b2240) 22%, transparent)' } as CSSProperties}
          >
            {slide.word}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className={`field-${slide.accent} relative h-full transition-colors duration-700`} style={{ color: 'var(--field-ink)' }}>
        <div className="container-page relative grid h-full grid-rows-[auto_1fr] gap-4 pb-28 pt-4 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-4 lg:pb-24 lg:pt-6">
          {/* Art: the giant capsule. On phones it sits on top, cropped by the screen edge. */}
          <motion.div style={{ y: artY }} className="relative z-[2] order-1 -mr-4 h-[26svh] max-h-[15rem] sm:-mr-8 sm:h-[30svh] lg:order-2 lg:col-span-6 lg:col-start-7 lg:-mr-[max(2.5rem,calc((100vw-82.5rem)/2+2.5rem))] lg:h-full lg:max-h-[38rem]">
            {/* Orbit ring: the path the 3D capsules travel, drawn faintly around the picture. */}
            <svg aria-hidden className="orbit-ring decor pointer-events-none absolute inset-0 hidden size-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ color: 'var(--accent)' }}>
              <rect x="7" y="3" width="96" height="94" rx="40" ry="47" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.35" strokeDasharray="1.2 2.2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div ref={artBox} className="hero-layer absolute inset-0 md:inset-[6%_4%_6%_4%] lg:inset-[9%_0_9%_14%]" style={{ '--depth': 14 } as CSSProperties}>
              <AnimatePresence initial={false}>
                <motion.figure
                  key={slide.id}
                  className="absolute inset-0 overflow-hidden rounded-l-[999px] bg-white/30 shadow-float"
                  initial={{ clipPath: 'inset(0% 0% 0% 100% round 999px 0 0 999px)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0% round 999px 0 0 999px)', transition: { duration: 1.1, ease: ease.inOut } }}
                  exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.5 } }}
                >
                  <div className="scene-drift absolute inset-0">
                    <Picture
                      img={slide.art}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      alt={slide.art.alt}
                      eager={index === 0}
                      position={slide.art.position}
                      onLoad={index === 0 ? markHeroReady : undefined}
                      className="hero-scene-img size-full object-cover"
                    />
                  </div>
                  <span aria-hidden className="light-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  {slide.person && (
                    <figcaption className="frost absolute bottom-5 left-[24%] max-w-[min(24rem,66%)] lg:left-[22%] rounded-[var(--radius-lg)] px-4 py-3 shadow-lift sm:bottom-8">
                      <span className="block font-display text-[1.0625rem] font-semibold leading-tight text-ink">{slide.person.name}</span>
                      <span className="mt-1 hidden text-[0.8125rem] leading-snug text-slate sm:block">{slide.person.role}</span>
                      <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-navy-900/[0.07] px-2 py-0.5 text-[0.75rem] font-semibold text-slate">Digital illustration</span>
                    </figcaption>
                  )}
                </motion.figure>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div style={{ y: copyY }} className="relative z-10 order-2 self-start lg:order-1 lg:col-span-6 lg:self-center">
            <h1 className="sr-only items-center gap-2 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 text-[0.875rem] font-semibold sm:not-sr-only sm:inline-flex">
              <img src="/images/official/ipc-emblem-32.png" width={32} height={32} alt="" className="size-7 rounded-full bg-white p-0.5" />
              {institution.nameEn}
              <span className="sr-only">, {institution.ministryEn}, {institution.governmentEn}</span>
            </h1>
            <div
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}: ${slide.label}`}
              aria-live={paused ? 'polite' : 'off'}
              aria-atomic="true"
              className="sm:mt-4"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={slide.id} variants={copy} initial="hidden" animate="visible" exit="exit">
                  <motion.p variants={line} className="eyebrow"><span className="rule" aria-hidden /><span>{slide.context}</span></motion.p>
                  <h2 className="mt-3 max-w-[16ch] text-[clamp(1.875rem,1.1rem+2.8vw,3.75rem)] font-semibold leading-[1] tracking-[-0.04em]">
                    <SplitWords text={slide.title} delay={0.35} inView={false} />
                  </h2>
                  {slide.quote ? (
                    <motion.figure variants={line} className="mt-4 max-w-[34rem]">
                      <blockquote className="text-[1rem] font-medium leading-snug sm:text-[1.1875rem]"><p className="line-clamp-3">“{slide.quote.text}”</p></blockquote>
                      <figcaption className="mt-2 text-[0.875rem]"><cite className="font-semibold not-italic">{slide.quote.cite}</cite><span className="hidden sm:inline">. {slide.body}</span></figcaption>
                    </motion.figure>
                  ) : (
                    <motion.p variants={line} className="mt-4 line-clamp-3 max-w-[34rem] text-[0.9375rem] leading-relaxed sm:text-[1.0625rem]">{slide.body}</motion.p>
                  )}
                  {slide.facts && (
                    <motion.dl variants={line} className="mt-4 hidden flex-wrap gap-2 sm:flex">
                      {slide.facts.map(f => (
                        <div key={f.label} className="flex items-baseline gap-2 rounded-full bg-white/70 px-4 py-2">
                          <dd className="tabular font-display text-[1.375rem] font-semibold leading-none" style={{ color: 'var(--accent-ink)' }}>{f.value}</dd>
                          <dt className="text-[0.875rem] font-medium">{f.label}</dt>
                        </div>
                      ))}
                    </motion.dl>
                  )}
                  <motion.div variants={line} className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-6">
                    <EditorialButton to={slide.cta.to} href={slide.cta.href} magnetic>{slide.cta.label}</EditorialButton>
                    {slide.secondary && (
                      <SmartLink to={slide.secondary.to} href={slide.secondary.href} className="group inline-flex min-h-11 items-center text-[0.9375rem] font-semibold">
                        <span className="link-sweep">{slide.secondary.label}</span>
                      </SmartLink>
                    )}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live 3D layer in orbit mode: capsules and molecules travel a band around the picture, and the
          canvas is masked over the picture itself, so they frame it without ever covering it. */}
      {webgl && (
        <Suspense fallback={null}>
          <LabScene accent={ACCENT_HEX[slide.accent]} orbit={artBox} className="absolute inset-0 z-[3]" count={12} />
        </Suspense>
      )}

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-4 z-20 sm:bottom-6" onKeyDown={onKeyDown}>
        <div className="container-page flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
          <div className="flex items-center gap-2">
            <button type="button" className={ctrl} onClick={() => go(index - 1)}><ChevronLeft aria-hidden size={20} /><span className="sr-only">Previous slide</span></button>
            <button type="button" className={ctrl} onClick={() => go(index + 1)}><ChevronRight aria-hidden size={20} /><span className="sr-only">Next slide</span></button>
            <button type="button" className={ctrl} onClick={() => setUserPaused(p => !p)} aria-pressed={userPaused}>
              {userPaused ? <Play aria-hidden size={17} /> : <Pause aria-hidden size={17} />}
              <span className="sr-only">{userPaused ? 'Start automatic slide rotation' : 'Stop automatic slide rotation'}</span>
            </button>
          </div>
          <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:overflow-visible" aria-label="Choose a slide">
            {heroSlides.map((s, i) => {
              const current = i === index;
              return (
                <li key={s.id} className={`field-${s.accent} shrink-0`} style={{ background: 'none' }}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={current ? 'true' : undefined}
                    className={`relative flex min-h-11 items-center gap-2 overflow-hidden rounded-full px-4 text-[0.8125rem] font-semibold transition-[background-color,color,transform] duration-200 active:scale-95 ${current ? 'bg-navy-900 text-white' : 'chip-glass text-ink'}`}
                  >
                    <span aria-hidden className="size-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    {s.label}
                    {current && <span aria-hidden key={`${s.id}-${index}`} className="hero-progress absolute inset-x-0 bottom-0 h-[3px]" style={{ background: 'var(--accent)' }} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
