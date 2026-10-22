import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { SmartLink } from './SmartLink';
import { SplitWords } from './SplitWords';

interface Props {
  index?: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  action?: { label: string; to?: string; href?: string };
  id?: string;
  dark?: boolean;
  align?: 'split' | 'stack';
}

/** Section opener: context line, a large display heading whose words rise in, then intro and one link. */
export function SectionHeading({ eyebrow, title, intro, action, id, dark = false, align = 'split' }: Props) {
  return (
    <div className={`${dark ? 'on-dark' : ''} ${align === 'split' ? 'grid gap-6 lg:grid-cols-12 lg:items-end' : 'max-w-3xl'}`}>
      <div className={align === 'split' ? 'lg:col-span-7' : ''}>
        <motion.p variants={fadeUp} {...inView} className="eyebrow">
          <span className="rule" aria-hidden />
          <span>{eyebrow}</span>
        </motion.p>
        <h2 id={id} className={`mt-4 text-[clamp(2.25rem,1.5rem+2.6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${dark ? '!text-white' : ''}`}>
          <SplitWords text={title} />
        </h2>
      </div>
      {(intro || action) && (
        <motion.div variants={stagger(0.08, 0.2)} {...inView} className={align === 'split' ? 'lg:col-span-5 lg:pb-2' : 'mt-5'}>
          {intro && <motion.p variants={fadeUp} className={`max-w-xl text-[1.0625rem] leading-relaxed ${dark ? 'text-white/85' : ''}`}>{intro}</motion.p>}
          {action && (
            <motion.span variants={fadeUp} className="block">
              <SmartLink
                to={action.to}
                href={action.href}
                className="group mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/80 py-2 pl-4 pr-3 text-[0.9375rem] font-semibold shadow-hair transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.97]"
                style={{ color: 'var(--accent-ink, var(--color-teal-700))' }}
              >
                {action.label}
                <span aria-hidden className="inline-flex size-7 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1" style={{ background: 'var(--accent-ink, var(--color-teal-700))' }}>
                  <ArrowRight size={15} />
                </span>
              </SmartLink>
            </motion.span>
          )}
        </motion.div>
      )}
    </div>
  );
}
