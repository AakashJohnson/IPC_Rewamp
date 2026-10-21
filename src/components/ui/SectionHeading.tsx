import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { SmartLink } from './SmartLink';

interface Props {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: { label: string; to?: string; href?: string };
  id?: string;
  dark?: boolean;
  align?: 'split' | 'stack';
}

export function SectionHeading({ index, eyebrow, title, intro, action, id, dark = false, align = 'split' }: Props) {
  return (
    <motion.div
      variants={stagger(0.07)}
      {...inView}
      className={`${dark ? 'on-dark' : ''} ${align === 'split' ? 'grid gap-6 lg:grid-cols-12 lg:items-end' : 'max-w-3xl'}`}
    >
      <div className={align === 'split' ? 'lg:col-span-7' : ''}>
        <motion.p variants={fadeUp} className="eyebrow">
          {index && <span className="index">{index}</span>}
          <motion.span className="rule origin-left" aria-hidden variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }} />
          <span>{eyebrow}</span>
        </motion.p>
        <motion.h2 variants={fadeUp} id={id} className={`mt-4 text-h2 ${dark ? '!text-white' : ''}`}>
          {title}
        </motion.h2>
      </div>
      {(intro || action) && (
        <motion.div variants={fadeUp} className={align === 'split' ? 'lg:col-span-5 lg:pb-1.5' : 'mt-4'}>
          {intro && <p className={`max-w-xl text-body ${dark ? 'text-white/75' : 'text-muted'}`}>{intro}</p>}
          {action && (
            <SmartLink
              to={action.to}
              href={action.href}
              className={`group mt-3 inline-flex items-center gap-2 text-[0.9375rem] font-semibold ${dark ? 'text-white' : 'text-teal-700'}`}
            >
              <span className="border-b border-current/30 pb-0.5 transition-colors group-hover:border-current">{action.label}</span>
              <ArrowRight aria-hidden size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </SmartLink>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
