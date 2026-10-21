import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

/**
 * Card wrapper with a soft light that follows the pointer. Purely visual — the CSS variables
 * --mx/--my drive a radial gradient on an overlay; nothing changes for keyboard or touch users.
 */
export function Spotlight({ children, className = '', tone = 'rgb(22 122 120 / 0.10)' }: { children: ReactNode; className?: string; tone?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onPointerMove={onMove} className={`group/spot relative ${className}`} style={{ '--spot': tone } as CSSProperties}>
      <span
        aria-hidden
        className="decor pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: 'radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), var(--spot), transparent 70%)' }}
      />
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}

/** Gentle 3D tilt towards the pointer (mouse only, off for reduced motion). */
export function Tilt({ children, className = '', max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 150, damping: 18 });
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={e => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { px.set(0.5); py.set(0.5); }}
    >
      {children}
    </motion.div>
  );
}
