import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Printer } from 'lucide-react';
import { focusPageTitle } from '../../lib/focus';
import { Breadcrumbs } from './Breadcrumbs';
import { ConcentricArcs } from '../textures/ConcentricArcs';
import { GlowOrbs, MoleculeField } from '../effects/AnimatedBackdrop';
import { illustrationFor } from '../illustrations/map';
import { ease } from '../../lib/motion';
import type { Crumb } from '../../lib/types';

interface Props {
  title: string;
  crumbs?: Crumb[];
  eyebrow?: string;
  meta?: ReactNode;
  lead?: ReactNode;
  printable?: boolean;
}

/** Title band shared by every interior page: section illustration, ambient texture, scroll parallax. */
export function PageHeader({ title, crumbs = [], eyebrow, meta, lead, printable = true }: Props) {
  const h1 = useRef<HTMLHeadingElement>(null);
  const band = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const Illustration = illustrationFor(decodeURIComponent(pathname));
  const { scrollYProgress } = useScroll({ target: band, offset: ['start start', 'end start'] });
  const artY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 70]);
  const artRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -6]);
  const ringsRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 40]);

  useEffect(() => focusPageTitle(h1.current), [title]);

  return (
    <header ref={band} className="texture-paper relative overflow-hidden border-b border-line">
      <div aria-hidden className="decor texture-grid fade-mask-r absolute inset-0" />
      <GlowOrbs className="opacity-80" />
      <MoleculeField className="opacity-70" />
      <motion.div style={{ rotate: ringsRotate }} className="decor pointer-events-none absolute -right-32 -top-48 hidden w-[640px] text-navy-900/[0.07] md:block">
        <ConcentricArcs />
      </motion.div>

      <div className="container-page relative grid items-center gap-6 pb-10 pt-6 md:pb-14 md:pt-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Breadcrumbs crumbs={crumbs} current={title} />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: ease.out }}
            className="mt-8 max-w-4xl md:mt-12"
          >
            {eyebrow && (
              <p className="eyebrow">
                <motion.span
                  className="rule origin-left"
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: ease.out }}
                />
                <span>{eyebrow}</span>
              </p>
            )}
            <h1 ref={h1} tabIndex={-1} className="mt-3 text-h1 outline-none">{title}</h1>
            {lead && <div className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{lead}</div>}
          </motion.div>
          {(meta || printable) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-meta text-muted"
            >
              {meta}
              {printable && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex items-center gap-1.5 rounded-xs text-muted hover:text-ink"
                >
                  <Printer aria-hidden size={14} /> Print this page
                </button>
              )}
            </motion.div>
          )}
        </div>
        <motion.div
          style={{ y: artY, rotate: artRotate }}
          className="decor pointer-events-none relative hidden justify-self-end lg:col-span-4 lg:block"
        >
          <span aria-hidden className="absolute inset-6 rounded-full border border-dashed border-teal-600/25 animate-spin-slow" />
          <Illustration className="relative w-[17rem] drop-shadow-[0_18px_30px_rgba(16,38,63,0.08)] xl:w-[19rem]" />
        </motion.div>
      </div>
    </header>
  );
}
