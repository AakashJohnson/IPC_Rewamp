import { useEffect, useRef, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { SkipLink } from './SkipLink';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { markNavigated } from '../../lib/focus';
import { finishBoot } from '../../lib/boot';
import { ScrollProgress } from '../effects/ScrollProgress';
import { startPointerLayer } from '../../lib/pointer';
import { ease } from '../../lib/motion';

/** Cursor halo and the shared pointer loop (spotlight, tilt, glare). Inert on touch and reduced motion. */
function PointerLayer() {
  const halo = useRef<HTMLDivElement>(null);
  useEffect(() => startPointerLayer(halo.current), []);
  return <div ref={halo} aria-hidden className="cursor-halo no-print" data-on="false" />;
}

/** Marks sections that are on screen, so CSS can pause decorative loops everywhere else. */
function MotionGovernor() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      for (const e of entries) e.target.classList.toggle('in-view', e.isIntersecting);
    }, { rootMargin: '100px 0px' });
    // Wait a tick for the route's content to render.
    const t = window.setTimeout(() => {
      document.querySelectorAll('main section, main .page-canvas, main header, footer[role="contentinfo"]').forEach(el => {
        el.classList.add('motion-gated');
        io.observe(el);
      });
    }, 150);
    return () => { window.clearTimeout(t); io.disconnect(); };
  }, [pathname]);
  return null;
}

function RouteChangeTracker() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    markNavigated();
  }, [pathname]);
  return null;
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
            document.getElementById('main')?.focus({ preventScroll: true });
          }}
          className="no-print fixed bottom-5 right-5 z-30 flex size-12 items-center justify-center rounded-full bg-navy-900 text-white shadow-lift transition-transform hover:-translate-y-1 active:scale-95"
        >
          <ArrowUp aria-hidden size={18} />
          <span className="sr-only">Back to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  // Runs once after the first commit; route changes never show the full-screen loader again.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => finishBoot(pathname), []);
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-[50vh] outline-none">
        {/* A short fade on every route change (opacity only, so fixed-position children keep working); the full-screen loader only ever runs on first load. */}
        <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4, ease: ease.out } }}>
          <Outlet />
        </motion.div>
      </main>
      <SiteFooter />
      <BackToTop />
      <PointerLayer />
      <MotionGovernor />
      <RouteChangeTracker />
      <ScrollRestoration getKey={location => location.pathname} />
    </>
  );
}
