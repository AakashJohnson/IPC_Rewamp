import { useEffect, useRef, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { SkipLink } from './SkipLink';
import { InstitutionalHeader } from './InstitutionalHeader';
import { PrimaryNavigation } from './PrimaryNavigation';
import { SiteFooter } from './SiteFooter';
import { markNavigated } from '../../lib/focus';
import { ScrollProgress } from '../effects/ScrollProgress';

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
          className="no-print fixed bottom-5 right-5 z-30 flex size-11 items-center justify-center rounded-full border border-line-strong bg-white text-navy-900 shadow-lift hover:border-navy-900"
        >
          <ArrowUp aria-hidden size={18} />
          <span className="sr-only">Back to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function Layout() {
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <InstitutionalHeader />
      <PrimaryNavigation />
      <main id="main" tabIndex={-1} className="min-h-[50vh] outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      <BackToTop />
      <RouteChangeTracker />
      <ScrollRestoration getKey={location => location.pathname} />
    </>
  );
}
