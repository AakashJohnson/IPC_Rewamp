import type { ReactNode, SVGProps } from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import { C } from './palette';

// Line-art illustration system. Colours come from the design tokens so the drawings follow the
// theme (including high-contrast mode). Strokes draw themselves in once when scrolled into view;
// ambient loops (bubbles, orbits, pulses) only run when the visitor has not asked for reduced motion.

const draw: Transition = { duration: 1.1, ease: [0.65, 0, 0.35, 1] };

interface SvgProps {
  viewBox: string;
  className?: string;
  children: ReactNode;
  title?: string;
}

/** Decorative by default; pass a title only when the drawing carries meaning on its own. */
export function Svg({ viewBox, className = '', children, title }: SvgProps) {
  return (
    <motion.svg
      viewBox={viewBox}
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true, focusable: 'false' })}
    >
      {children}
    </motion.svg>
  );
}

type PathProps = Omit<SVGProps<SVGPathElement>, 'ref' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> & {
  delay?: number;
  duration?: number;
};

/** A stroke that draws itself when its parent Svg enters the viewport. */
export function DrawPath({ delay = 0, duration, stroke = C.line, strokeWidth = 1.6, ...rest }: PathProps) {
  const reduce = useReducedMotion();
  return (
    <motion.path
      stroke={stroke}
      strokeWidth={strokeWidth}
      variants={reduce ? undefined : {
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 1, transition: { ...draw, duration: duration ?? draw.duration, delay } },
      }}
      {...(rest as object)}
    />
  );
}

/** A filled shape that fades/scales in after the line work. */
export function FadeIn({ children, delay = 0.4 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.g
      variants={reduce ? undefined : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6, delay } },
      }}
    >
      {children}
    </motion.g>
  );
}

/** Repeating ambient motion (disabled for reduced motion). */
export function Loop({ children, animate, duration = 4, delay = 0, origin }: {
  children: ReactNode;
  animate: Record<string, number[] | string[]>;
  duration?: number;
  delay?: number;
  origin?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <g>{children}</g>;
  return (
    <motion.g
      style={origin ? { transformOrigin: origin, transformBox: 'fill-box' } : undefined}
      animate={animate}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.g>
  );
}

/** Rising bubbles for liquids. */
export function Bubbles({ points, top }: { points: [number, number, number][]; top: number }) {
  const reduce = useReducedMotion();
  return (
    <g>
      {points.map(([x, y, r], i) =>
        reduce ? (
          <circle key={i} cx={x} cy={y} r={r} stroke={C.teal} strokeWidth={1.2} fill={C.white} />
        ) : (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            stroke={C.teal}
            strokeWidth={1.2}
            fill={C.white}
            initial={{ cy: y, opacity: 0 }}
            animate={{ cy: [y, top], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3 + i * 0.7, delay: i * 0.9, repeat: Infinity, ease: 'easeOut' }}
          />
        ),
      )}
    </g>
  );
}
