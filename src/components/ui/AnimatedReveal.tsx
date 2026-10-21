import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { fadeUp, inView, stagger } from '../../lib/motion';

interface Props {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'ul' | 'ol' | 'li' | 'article';
  /** Stagger direct motion children instead of revealing as one block */
  group?: boolean;
  gap?: number;
  delay?: number;
}

/** Low-distance fade/slide reveal, once, as content scrolls into view. Honors reduced motion via MotionConfig. */
export function AnimatedReveal({ children, className, as = 'div', group = false, gap = 0.06, delay = 0 }: Props) {
  const Component = motion[as];
  return (
    <Component className={className} variants={group ? stagger(gap, delay) : fadeUp} {...inView}>
      {children}
    </Component>
  );
}

/** A child item for an AnimatedReveal group. */
export function RevealItem({ children, className, as = 'div' }: Omit<Props, 'group' | 'gap' | 'delay'>) {
  const Component = motion[as];
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
