import { useEffect, useRef } from 'react';

/**
 * Pulls an element a few pixels towards a nearby fine pointer by writing --mx/--my (see .magnetic).
 * No React state, so pointer movement never re-renders; inert on touch devices and for reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(enabled = true, strength = 0.22, max = 8) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const clamp = (v: number) => Math.max(-max, Math.min(max, v));
    const onMove = (e: globalThis.PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${clamp((e.clientX - (r.left + r.width / 2)) * strength)}px`);
        el.style.setProperty('--my', `${clamp((e.clientY - (r.top + r.height / 2)) * strength)}px`);
      });
    };
    const onLeave = () => { cancelAnimationFrame(frame); el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => { cancelAnimationFrame(frame); el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); };
  }, [enabled, strength, max]);
  return ref;
}
