import { motion, useReducedMotion } from 'motion/react';
import { Bubbles, DrawPath, FadeIn, Loop, Svg } from './primitives';
import { C } from './palette';

interface P { className?: string }

/** Erlenmeyer flask with a gently moving liquid surface and rising bubbles. */
export function LabFlask({ className }: P) {
  const reduce = useReducedMotion();
  return (
    <Svg viewBox="0 0 220 220" className={className}>
      <FadeIn delay={0}>
        <circle cx="110" cy="122" r="88" fill={C.tealWash} />
      </FadeIn>
      {/* liquid */}
      <FadeIn delay={0.5}>
        <path d="M58 168 L80 128 H140 L162 168 Q163 178 152 178 H68 Q57 178 58 168 Z" fill={C.tealSoft} />
        {reduce ? (
          <path d="M80 128 Q95 122 110 128 T140 128" stroke={C.teal} strokeWidth="1.6" />
        ) : (
          <motion.path
            stroke={C.teal}
            strokeWidth="1.6"
            d="M80 128 Q95 122 110 128 T140 128"
            initial={{ d: 'M80 128 Q95 122 110 128 T140 128' }}
            animate={{ d: ['M80 128 Q95 122 110 128 T140 128', 'M80 128 Q95 134 110 128 T140 128', 'M80 128 Q95 122 110 128 T140 128'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <Bubbles top={110} points={[[100, 168, 3], [118, 172, 2.2], [130, 160, 2.6], [90, 158, 1.8]]} />
      </FadeIn>
      {/* glass */}
      <DrawPath d="M92 40 V92 L52 168 Q49 184 66 184 H154 Q171 184 168 168 L128 92 V40" />
      <DrawPath d="M86 40 H134" delay={0.2} />
      <DrawPath d="M88 30 H132 V40 H88 Z" delay={0.3} stroke={C.saffron} />
      {/* graduations */}
      {[118, 134, 150].map((y, i) => (
        <DrawPath key={y} d={`M${101 - (y - 92) * 0.36} ${y} h12`} delay={0.6 + i * 0.1} strokeWidth={1.2} />
      ))}
      {/* floating molecule */}
      <Loop animate={{ y: [0, -6, 0] }} duration={5}>
        <DrawPath d="M168 54 L182 46 L196 54 L196 70 L182 78 L168 70 Z" delay={0.8} stroke={C.teal} />
        <circle cx="182" cy="46" r="3.2" fill={C.saffron} />
        <circle cx="168" cy="70" r="3" fill={C.teal} />
      </Loop>
      <Loop animate={{ y: [0, 5, 0] }} duration={6} delay={1}>
        <circle cx="34" cy="70" r="5" stroke={C.teal} strokeWidth="1.4" />
        <circle cx="48" cy="56" r="3" fill={C.saffron} />
        <path d="M37 66 L46 58" stroke={C.ink} strokeWidth="1.2" />
      </Loop>
    </Svg>
  );
}

/** Benzene-style ring with substituents; slowly rotates. */
export function Molecule({ className }: P) {
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [100 + 34 * Math.cos(a), 100 + 34 * Math.sin(a)] as const;
  });
  const outer = hex.map(([x, y]) => [100 + (x - 100) * 1.9, 100 + (y - 100) * 1.9] as const);
  return (
    <Svg viewBox="0 0 200 200" className={className}>
      <Loop animate={{ rotate: [0, 360] }} duration={60} origin="center">
        <DrawPath d={`M${hex.map(p => p.join(' ')).join(' L')} Z`} />
        <DrawPath d="M100 78 a22 22 0 1 0 0.01 0" strokeDasharray="3 5" stroke={C.teal} delay={0.3} />
        {hex.map((p, i) => (i % 2 === 0 ? <DrawPath key={i} d={`M${p[0]} ${p[1]} L${outer[i][0]} ${outer[i][1]}`} delay={0.4 + i * 0.05} /> : null))}
        <FadeIn delay={0.8}>
          {outer.map((p, i) => (i % 2 === 0 ? (
            <circle key={i} cx={p[0]} cy={p[1]} r={i === 0 ? 7 : 5.5} fill={i === 0 ? C.saffron : C.teal} />
          ) : null))}
          {hex.map((p, i) => <circle key={`h${i}`} cx={p[0]} cy={p[1]} r="3" fill={C.white} stroke={C.line} strokeWidth="1.4" />)}
        </FadeIn>
      </Loop>
    </Svg>
  );
}

/** Three reference-substance vials with labels and liquid levels. */
export function ReferenceVials({ className }: P) {
  const vials = [
    { x: 46, h: 96, level: 0.55, cap: C.saffron },
    { x: 96, h: 112, level: 0.7, cap: C.teal },
    { x: 146, h: 96, level: 0.45, cap: C.ink },
  ];
  return (
    <Svg viewBox="0 0 220 200" className={className}>
      <FadeIn delay={0}><ellipse cx="110" cy="176" rx="92" ry="10" fill={C.tealWash} /></FadeIn>
      {vials.map((v, i) => {
        const top = 172 - v.h;
        const liquidTop = 172 - v.h * v.level;
        return (
          <g key={v.x}>
            <FadeIn delay={0.5 + i * 0.1}>
              <rect x={v.x + 2} y={liquidTop} width="24" height={170 - liquidTop} rx="4" fill={C.tealSoft} />
              <rect x={v.x - 1} y={top - 16} width="30" height="16" rx="3" fill={v.cap} />
              <rect x={v.x + 3} y={top + 22} width="22" height="22" rx="2" fill={C.white} stroke={C.line} strokeWidth="1" />
              <path d={`M${v.x + 7} ${top + 30} h14 M${v.x + 7} ${top + 36} h9`} stroke={C.ink} strokeWidth="1" />
            </FadeIn>
            <DrawPath d={`M${v.x} ${top} V${168} Q${v.x} 174 ${v.x + 6} 174 H${v.x + 22} Q${v.x + 28} 174 ${v.x + 28} 168 V${top}`} delay={i * 0.15} />
          </g>
        );
      })}
      <Loop animate={{ y: [0, -5, 0] }} duration={4.5}>
        <circle cx="196" cy="48" r="4" fill={C.saffron} />
        <circle cx="24" cy="62" r="3" fill={C.teal} />
      </Loop>
    </Svg>
  );
}

/** Laboratory microscope. */
export function Microscope({ className }: P) {
  return (
    <Svg viewBox="0 0 220 220" className={className}>
      <FadeIn delay={0}><circle cx="110" cy="118" r="86" fill={C.tealWash} /></FadeIn>
      <DrawPath d="M60 186 H164" strokeWidth={2} />
      <DrawPath d="M84 186 Q84 160 112 156 H132" delay={0.2} />
      <DrawPath d="M132 186 V120 Q132 104 118 98" delay={0.3} />
      <DrawPath d="M88 38 L120 96 L108 103 L76 45 Z" delay={0.4} />
      <DrawPath d="M80 30 L96 22 L102 34 L86 42 Z" delay={0.5} stroke={C.saffron} />
      <DrawPath d="M112 112 L102 130 M126 112 L136 130" delay={0.6} />
      <DrawPath d="M88 134 H150" delay={0.7} strokeWidth={2} stroke={C.teal} />
      <FadeIn delay={0.9}>
        <circle cx="146" cy="74" r="10" fill={C.white} stroke={C.line} strokeWidth="1.4" />
        <circle cx="146" cy="74" r="4" fill={C.teal} />
      </FadeIn>
      <Loop animate={{ opacity: [0.3, 1, 0.3] }} duration={2.4}>
        <path d="M119 138 V150" stroke={C.saffron} strokeWidth="2" />
      </Loop>
    </Svg>
  );
}

/** HPLC chromatogram: peaks draw across a calibrated baseline. */
export function Chromatogram({ className, light = false }: P & { light?: boolean }) {
  const stroke = light ? 'rgba(255,255,255,0.75)' : C.teal;
  const axis = light ? 'rgba(255,255,255,0.35)' : C.ink;
  const peaks = 'M10 150 L60 150 Q70 150 74 120 Q78 40 84 120 Q88 150 98 150 L150 150 Q160 150 164 100 Q169 20 176 100 Q180 150 190 150 L236 150 Q244 150 248 132 Q252 92 256 132 Q260 150 268 150 L330 150 Q338 150 342 70 Q347 4 352 70 Q356 150 366 150 L430 150';
  return (
    <Svg viewBox="0 0 440 170" className={className}>
      <DrawPath d="M10 158 H430" stroke={axis} strokeWidth={1} duration={0.8} />
      {[60, 140, 220, 300, 380].map((x, i) => <DrawPath key={x} d={`M${x} 158 v6`} stroke={axis} strokeWidth={1} delay={0.2 + i * 0.05} />)}
      <DrawPath d={peaks} stroke={stroke} strokeWidth={2} duration={2.2} delay={0.3} />
      <FadeIn delay={1.8}>
        {[[84, 34], [176, 22], [256, 88], [352, 10]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y + 8} r="3.5" fill={light ? '#e3b47a' : C.saffron} />
        ))}
      </FadeIn>
    </Svg>
  );
}
