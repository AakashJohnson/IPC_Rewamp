import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartLink } from '../../components/ui/SmartLink';
import { BookStack } from '../../components/illustrations';
import { inView, pop, stagger } from '../../lib/motion';
import { programmes } from '../../config/site';
import type { Accent } from '../../config/hero';
import { SectionBackdrop } from '../../components/effects/SectionBackdrop';

// Each programme is set as an "element" tile — a periodic-table motif for the Commission's mandate.
// Order and wording follow `programmes` in config/site.ts.
const ELEMENT: { symbol: string; accent: Accent }[] = [
  { symbol: 'Ip', accent: 'teal' },
  { symbol: 'Rs', accent: 'violet' },
  { symbol: 'Pv', accent: 'coral' },
  { symbol: 'Mv', accent: 'sky' },
  { symbol: 'Nf', accent: 'saffron' },
  { symbol: 'Hz', accent: 'teal' },
];

export function ScientificProgrammes() {
  return (
    <section aria-labelledby="programmes-title" className="has-backdrop field field-violet grain relative overflow-hidden py-20 md:py-28">
      <SectionBackdrop variant="hex" />
      <div className="container-page">
        <SectionHeading
          id="programmes-title"
          eyebrow="Mandate"
          title="Programmes & scientific functions"
          intro="The work of the Commission, as set out in its objectives — from drug standards to the safety monitoring of medicines and medical devices."
        />
        <motion.ul variants={stagger(0.07)} {...inView} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map((p, i) => {
            const el = ELEMENT[i];
            const lead = i === 0;
            return (
              <motion.li key={p.title} variants={pop} className={`accent-${el.accent} ${lead ? 'sm:col-span-2 lg:row-span-2' : ''} ${i === programmes.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                <SmartLink
                  to={p.to}
                  className="tex-card edge-glow tilt spotlight group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] bg-white/85 p-6 sm:p-7"
                >
                  <span aria-hidden className="glare" />
                  <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full opacity-25 blur-2xl transition-transform duration-700 group-hover:scale-125" style={{ background: 'var(--accent)' }} />
                  <span className="relative flex items-start justify-between gap-4">
                    <span
                      aria-hidden
                      className={`flex items-center justify-center rounded-[var(--radius-md)] bg-white font-display font-semibold shadow-hair ring-2 transition-transform duration-300 group-hover:-rotate-3 ${lead ? 'size-24 text-[2.75rem]' : 'size-16 text-[1.75rem]'}`}
                      style={{ color: 'var(--accent-ink)', '--tw-ring-color': 'var(--accent)' } as CSSProperties}
                    >
                      {el.symbol}
                    </span>
                    <span className="text-right text-[0.875rem] font-semibold" style={{ color: 'var(--accent-ink)' }}>{p.subtitle}</span>
                  </span>
                  <span className={`relative mt-6 block font-display font-semibold leading-tight text-ink ${lead ? 'text-[2rem]' : 'text-[1.375rem]'}`}>
                    <span className="link-sweep">{p.title}</span>
                  </span>
                  <span className={`relative mt-3 block leading-relaxed text-slate ${lead ? 'text-[1.0625rem]' : 'flex-1 text-[0.9375rem]'}`}>{p.text}</span>
                  {lead && <BookStack className="relative mx-auto mt-auto hidden w-64 pt-6 lg:block" />}
                  <span className="relative mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink">
                    Learn more <ArrowRight aria-hidden size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </SmartLink>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
