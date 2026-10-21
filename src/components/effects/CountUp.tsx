import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

interface Props {
  value: number;
  /** Starting value of the count (e.g. a nearby year) */
  from?: number;
  /** Text after the number, e.g. "th" */
  suffix?: string;
  duration?: number;
  /** Indian digit grouping (3,340 / 1,23,456) */
  locale?: string;
  /** Disable digit grouping (for years) */
  grouping?: boolean;
  className?: string;
}

/** Counts up to an official figure once it scrolls into view. Screen readers get the final value only. */
export function CountUp({ value, from = 0, suffix = '', duration = 1.6, locale = 'en-IN', grouping = true, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : from);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value, from, duration]);

  const fmt = (n: number) => (grouping ? n.toLocaleString(locale) : String(n));
  const text = fmt(reduce ? value : display) + suffix;
  return (
    <span ref={ref} className={className}>
      <span aria-hidden>{text}</span>
      <span className="sr-only">{fmt(value) + suffix}</span>
    </span>
  );
}
