import { useEffect, useRef, type CSSProperties } from 'react';
import { MoleculeField } from './AnimatedBackdrop';

// Animated background textures for sections and interior pages. All decorative (aria-hidden), transform and
// opacity only, paused while offscreen, and switched off for reduced motion and high contrast (see index.css).

export type BackdropVariant = 'aurora' | 'molecules' | 'capsules' | 'hex' | 'dna';

const CAPSULES = Array.from({ length: 9 }, (_, i) => ({
  left: `${(i * 23 + 7) % 96}%`,
  top: `${(i * 37 + 11) % 88}%`,
  w: 46 + ((i * 13) % 40),
  rot: (i * 47) % 180,
  t: 16 + ((i * 5) % 14),
  d: -((i * 3) % 12),
}));

function Hexes() {
  return (
    <svg className="backdrop-hex absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500">
      <defs>
        <pattern id="hexgrid" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.1)">
          <path d="M28 0l28 16v32L28 64 0 48V16zM28 64l28 16v33M28 64L0 80v33" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </pattern>
        <radialGradient id="hexfade" cx="85%" cy="20%" r="70%">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hexmask"><rect width="800" height="500" fill="url(#hexfade)" /></mask>
      </defs>
      <rect width="800" height="500" fill="url(#hexgrid)" mask="url(#hexmask)" />
    </svg>
  );
}

function Dna() {
  const pts = Array.from({ length: 25 }, (_, i) => i * 40);
  const a = pts.map((x, i) => `${i ? 'L' : 'M'}${x} ${120 + Math.sin(i / 2) * 60}`).join(' ');
  const b = pts.map((x, i) => `${i ? 'L' : 'M'}${x} ${120 - Math.sin(i / 2) * 60}`).join(' ');
  return (
    <svg className="backdrop-dna absolute -right-20 bottom-6 h-60 w-[70rem] max-w-none" viewBox="0 0 960 240" fill="none">
      <path d={a} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="dna-strand" />
      <path d={b} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="dna-strand" style={{ animationDelay: '-3s' }} />
      {pts.map((x, i) => (
        <line key={x} x1={x} x2={x} y1={120 + Math.sin(i / 2) * 60} y2={120 - Math.sin(i / 2) * 60} stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      ))}
    </svg>
  );
}

export function SectionBackdrop({ variant, tone = 'var(--accent, #14b3a5)', className = '' }: { variant: BackdropVariant; tone?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { el?.classList.add('is-visible'); return; }
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-visible', e.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className={`section-backdrop decor pointer-events-none absolute inset-0 -z-0 overflow-hidden ${className}`} style={{ '--tone': tone, color: tone } as CSSProperties}>
      {variant === 'aurora' && (
        <>
          <span className="aurora-blob -left-32 top-[5%] size-[34rem]" style={{ background: 'color-mix(in srgb, var(--tone) 35%, #fff)' }} />
          <span className="aurora-blob -right-40 top-[35%] size-[30rem]" style={{ background: '#d6ecff', '--ax': '-8vw', '--t': '30s' } as CSSProperties} />
          <span className="aurora-blob bottom-[-8rem] left-[35%] size-[28rem]" style={{ background: '#ffe2cf', '--t': '24s' } as CSSProperties} />
        </>
      )}
      {variant === 'molecules' && <MoleculeField tone="text-current opacity-[0.35]" mask="edges" />}
      {variant === 'capsules' && CAPSULES.map((c, i) => (
        <span
          key={i}
          className="float-capsule"
          style={{ left: c.left, top: c.top, width: c.w, '--rot': `${c.rot}deg`, '--t': `${c.t}s`, '--d': `${c.d}s` } as CSSProperties}
        />
      ))}
      {variant === 'hex' && <Hexes />}
      {variant === 'dna' && <Dna />}
      <span className="backdrop-shimmer" />
    </div>
  );
}
