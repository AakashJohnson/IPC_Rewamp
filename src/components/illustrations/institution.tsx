import { motion, useReducedMotion } from 'motion/react';
import { DrawPath, FadeIn, Loop, Svg } from './primitives';
import { C } from './palette';

interface P { className?: string }

/** Institutional building: pediment, columns, steps. */
export function Institution({ className }: P) {
  const cols = [62, 88, 114, 140, 166];
  return (
    <Svg viewBox="0 0 230 200" className={className}>
      <FadeIn delay={0}><rect x="30" y="40" width="170" height="150" rx="85" fill={C.tealWash} /></FadeIn>
      <DrawPath d="M40 76 L115 34 L190 76 Z" />
      <DrawPath d="M46 86 H184" delay={0.15} />
      {cols.map((x, i) => (
        <DrawPath key={x} d={`M${x} 92 V156`} delay={0.25 + i * 0.07} strokeWidth={2} />
      ))}
      <DrawPath d="M42 160 H188 M34 170 H196 M26 180 H204" delay={0.6} />
      <FadeIn delay={0.9}>
        <circle cx="115" cy="62" r="8" fill={C.white} stroke={C.teal} strokeWidth="1.6" />
        <circle cx="115" cy="62" r="2.5" fill={C.saffron} />
      </FadeIn>
      <Loop animate={{ y: [0, -4, 0] }} duration={5}>
        <path d="M196 30 l4 -8 l4 8 l-4 8 z" fill={C.saffron} />
        <circle cx="32" cy="44" r="3" fill={C.teal} />
      </Loop>
    </Svg>
  );
}

/** The four volumes of the Indian Pharmacopoeia in a slipcase. */
export function BookStack({ className }: P) {
  const books = [
    { x: 54, w: 30, h: 112, tone: C.white },
    { x: 86, w: 34, h: 120, tone: C.tealSoft },
    { x: 122, w: 30, h: 112, tone: C.white },
    { x: 154, w: 24, h: 104, tone: C.tealSoft },
  ];
  return (
    <Svg viewBox="0 0 230 210" className={className}>
      <FadeIn delay={0}><circle cx="115" cy="112" r="92" fill={C.tealWash} /></FadeIn>
      {books.map((b, i) => (
        <g key={b.x}>
          <FadeIn delay={0.3 + i * 0.08}>
            <rect x={b.x} y={170 - b.h} width={b.w} height={b.h} rx="3" fill={b.tone} />
            <path d={`M${b.x + 6} ${186 - b.h} h${b.w - 12} M${b.x + 6} ${192 - b.h} h${b.w - 12}`} stroke={C.saffron} strokeWidth="1.4" />
          </FadeIn>
          <DrawPath d={`M${b.x} ${170} V${173 - b.h} Q${b.x} ${170 - b.h} ${b.x + 3} ${170 - b.h} H${b.x + b.w - 3} Q${b.x + b.w} ${170 - b.h} ${b.x + b.w} ${173 - b.h} V170`} delay={i * 0.12} />
          <DrawPath d={`M${b.x + b.w / 2} ${210 - b.h} V${150}`} delay={0.5 + i * 0.1} strokeWidth={1} stroke={C.ink} />
        </g>
      ))}
      {/* slipcase */}
      <FadeIn delay={0.6}><rect x="46" y="140" width="140" height="40" rx="3" fill={C.white} /></FadeIn>
      <DrawPath d="M46 140 H186 V180 H46 Z" delay={0.5} />
      <FadeIn delay={1}>
        <text x="116" y="166" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="2" fill={C.ink} fontFamily="var(--font-serif)">IP 2026</text>
      </FadeIn>
      <Loop animate={{ rotate: [0, 8, 0] }} duration={6} origin="center">
        <path d="M196 54 l6 -12 l6 12 l-6 12 z" fill={C.saffron} />
      </Loop>
      <Loop animate={{ y: [0, -6, 0] }} duration={5} delay={0.6}>
        <circle cx="30" cy="84" r="4" fill={C.teal} />
      </Loop>
    </Svg>
  );
}

/** Official documents with a seal — notices, circulars, registers. */
export function DocumentStack({ className }: P) {
  return (
    <Svg viewBox="0 0 220 210" className={className}>
      <FadeIn delay={0}><circle cx="110" cy="112" r="88" fill={C.tealWash} /></FadeIn>
      <FadeIn delay={0.2}><rect x="70" y="40" width="96" height="124" rx="4" fill={C.white} transform="rotate(8 118 102)" /></FadeIn>
      <DrawPath d="M70 40 h96 v124 h-96 Z" transform="rotate(8 118 102)" stroke={C.ink} strokeWidth={1.2} />
      <FadeIn delay={0.35}><rect x="52" y="48" width="96" height="128" rx="4" fill={C.white} /></FadeIn>
      <DrawPath d="M52 52 Q52 48 56 48 H128 L148 68 V172 Q148 176 144 176 H56 Q52 176 52 172 Z" delay={0.2} />
      <DrawPath d="M128 48 V68 H148" delay={0.4} />
      {[84, 98, 112, 126].map((y, i) => (
        <DrawPath key={y} d={`M66 ${y} H${i === 3 ? 108 : 134}`} delay={0.5 + i * 0.08} stroke={C.ink} strokeWidth={1.2} />
      ))}
      <DrawPath d="M66 68 H104" delay={0.45} stroke={C.teal} strokeWidth={2.4} />
      <Loop animate={{ rotate: [0, 6, 0] }} duration={5} origin="center">
        <circle cx="150" cy="162" r="20" fill={C.white} stroke={C.saffron} strokeWidth="2" />
        <circle cx="150" cy="162" r="13" stroke={C.saffron} strokeWidth="1" strokeDasharray="2 3" />
        <path d="M143 162 l5 5 l9 -10" stroke={C.saffron} strokeWidth="2" />
      </Loop>
    </Svg>
  );
}

/** Pharmacovigilance: shield with a moving ECG pulse. */
export function PulseShield({ className }: P) {
  const reduce = useReducedMotion();
  const pulse = 'M58 116 H86 L96 92 L108 140 L120 80 L130 116 H162';
  return (
    <Svg viewBox="0 0 220 220" className={className}>
      <FadeIn delay={0}><circle cx="110" cy="112" r="88" fill={C.tealWash} /></FadeIn>
      <FadeIn delay={0.3}><path d="M110 30 L170 52 V106 Q170 156 110 186 Q50 156 50 106 V52 Z" fill={C.white} /></FadeIn>
      <DrawPath d="M110 30 L170 52 V106 Q170 156 110 186 Q50 156 50 106 V52 Z" />
      <DrawPath d="M110 44 L158 62 V106 Q158 146 110 172 Q62 146 62 106 V62 Z" delay={0.3} stroke={C.teal} strokeWidth={1} strokeDasharray="3 4" />
      <DrawPath d={pulse} delay={0.6} stroke={C.teal} strokeWidth={2.4} />
      {!reduce && (
        <motion.path
          d={pulse}
          stroke={C.saffron}
          strokeWidth="2.6"
          pathLength={1}
          strokeDasharray="0.12 0.88"
          animate={{ strokeDashoffset: [1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <Loop animate={{ y: [0, -6, 0] }} duration={4}>
        <g transform="rotate(-35 184 50)">
          <rect x="170" y="42" width="30" height="14" rx="7" fill={C.white} stroke={C.line} strokeWidth="1.4" />
          <path d="M185 42 V56" stroke={C.line} strokeWidth="1.4" />
          <rect x="170" y="42" width="15" height="14" rx="7" fill={C.saffron} opacity="0.8" />
        </g>
      </Loop>
    </Svg>
  );
}

/** Materiovigilance: a medical device (syringe) with monitoring signal. */
export function MedicalDevice({ className }: P) {
  return (
    <Svg viewBox="0 0 220 220" className={className}>
      <FadeIn delay={0}><circle cx="110" cy="112" r="88" fill={C.tealWash} /></FadeIn>
      <g transform="rotate(-38 110 110)">
        <FadeIn delay={0.3}>
          <rect x="62" y="98" width="86" height="24" rx="3" fill={C.white} />
          <rect x="62" y="100" width="44" height="20" rx="2" fill={C.tealSoft} />
        </FadeIn>
        <DrawPath d="M62 98 H148 V122 H62 Z" />
        <DrawPath d="M148 104 H160 V116 H148 M160 110 H196" delay={0.3} />
        <DrawPath d="M36 102 V118 M36 110 H62" delay={0.4} />
        {[76, 90, 104, 118, 132].map((x, i) => <DrawPath key={x} d={`M${x} 98 v8`} delay={0.5 + i * 0.05} strokeWidth={1.1} />)}
      </g>
      <Loop animate={{ opacity: [0.35, 1, 0.35] }} duration={2}>
        <circle cx="170" cy="58" r="14" stroke={C.saffron} strokeWidth="1.6" />
        <circle cx="170" cy="58" r="22" stroke={C.saffron} strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="170" cy="58" r="4" fill={C.saffron} />
      </Loop>
    </Svg>
  );
}

/** Globe with orbiting nodes — pharmacopoeial harmonization. */
export function Globe({ className }: P) {
  return (
    <Svg viewBox="0 0 220 220" className={className}>
      <FadeIn delay={0}><circle cx="110" cy="110" r="70" fill={C.tealWash} /></FadeIn>
      <DrawPath d="M110 40 a70 70 0 1 0 0.01 0" />
      <DrawPath d="M110 40 a30 70 0 1 0 0.01 0" delay={0.2} stroke={C.ink} strokeWidth={1.1} />
      <DrawPath d="M40 110 H180 M50 76 H170 M50 144 H170" delay={0.3} stroke={C.ink} strokeWidth={1.1} />
      <Loop animate={{ rotate: [0, 360] }} duration={40} origin="center">
        <ellipse cx="110" cy="110" rx="100" ry="36" stroke={C.teal} strokeWidth="1.2" strokeDasharray="4 5" transform="rotate(-20 110 110)" />
        {[[14, 132], [196, 82], [70, 152], [160, 70], [110, 74]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 6 : 4.5} fill={i % 2 ? C.teal : C.saffron} stroke={C.white} strokeWidth="2" />
        ))}
      </Loop>
    </Svg>
  );
}

/** Graduation cap over an open book — training and skill development. */
export function TrainingCap({ className }: P) {
  return (
    <Svg viewBox="0 0 220 210" className={className}>
      <FadeIn delay={0}><circle cx="110" cy="112" r="88" fill={C.tealWash} /></FadeIn>
      <FadeIn delay={0.3}>
        <path d="M110 150 Q80 134 46 140 V178 Q80 172 110 186 Q140 172 174 178 V140 Q140 134 110 150 Z" fill={C.white} />
      </FadeIn>
      <DrawPath d="M110 150 Q80 134 46 140 V178 Q80 172 110 186 Q140 172 174 178 V140 Q140 134 110 150 Z M110 150 V186" />
      <Loop animate={{ y: [0, -5, 0] }} duration={4.5}>
        <FadeIn delay={0.5}><path d="M110 46 L180 76 L110 106 L40 76 Z" fill={C.ink} /></FadeIn>
        <DrawPath d="M70 90 V114 Q110 132 150 114 V90" delay={0.6} />
        <DrawPath d="M180 76 V112" delay={0.8} stroke={C.saffron} strokeWidth={2} />
        <circle cx="180" cy="116" r="4" fill={C.saffron} />
      </Loop>
    </Svg>
  );
}

/** Magnifier over a document — search, help, empty states. */
export function MagnifierDoc({ className }: P) {
  return (
    <Svg viewBox="0 0 220 200" className={className}>
      <FadeIn delay={0}><circle cx="110" cy="104" r="84" fill={C.tealWash} /></FadeIn>
      <FadeIn delay={0.2}><rect x="50" y="34" width="90" height="120" rx="4" fill={C.white} /></FadeIn>
      <DrawPath d="M50 34 H140 V154 H50 Z" />
      {[58, 72, 86, 100].map((y, i) => <DrawPath key={y} d={`M64 ${y} H${i % 2 ? 110 : 126}`} delay={0.3 + i * 0.07} stroke={C.ink} strokeWidth={1.2} />)}
      <Loop animate={{ x: [0, -10, 0], y: [0, -6, 0] }} duration={5}>
        <FadeIn delay={0.6}><circle cx="142" cy="122" r="28" fill={C.white} fillOpacity="0.85" /></FadeIn>
        <DrawPath d="M142 94 a28 28 0 1 0 0.01 0" delay={0.5} stroke={C.teal} strokeWidth={3} />
        <DrawPath d="M162 142 L188 168" delay={0.8} strokeWidth={5} stroke={C.ink} />
        <path d="M128 112 a16 16 0 0 1 12 -8" stroke={C.saffron} strokeWidth="2" />
      </Loop>
    </Svg>
  );
}

/** Camera — media and photo gallery. */
export function Camera({ className }: P) {
  return (
    <Svg viewBox="0 0 220 200" className={className}>
      <FadeIn delay={0}><circle cx="110" cy="104" r="84" fill={C.tealWash} /></FadeIn>
      <FadeIn delay={0.3}><rect x="40" y="70" width="140" height="90" rx="10" fill={C.white} /></FadeIn>
      <DrawPath d="M50 70 H84 L94 54 H126 L136 70 H170 Q180 70 180 80 V150 Q180 160 170 160 H50 Q40 160 40 150 V80 Q40 70 50 70 Z" />
      <DrawPath d="M110 82 a32 32 0 1 0 0.01 0" delay={0.4} stroke={C.teal} strokeWidth={2} />
      <FadeIn delay={0.7}><circle cx="110" cy="114" r="18" fill={C.tealSoft} /></FadeIn>
      <Loop animate={{ opacity: [0.2, 1, 0.2] }} duration={3}>
        <circle cx="160" cy="86" r="5" fill={C.saffron} />
      </Loop>
      <Loop animate={{ rotate: [0, 20, 0] }} duration={6} origin="center">
        <path d="M186 40 l4 -9 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4 z" fill={C.saffron} />
      </Loop>
    </Svg>
  );
}

/** Pen writing on a form — online forms and submissions. */
export function FormPen({ className }: P) {
  return (
    <Svg viewBox="0 0 220 200" className={className}>
      <FadeIn delay={0}><circle cx="110" cy="104" r="84" fill={C.tealWash} /></FadeIn>
      <FadeIn delay={0.2}><rect x="52" y="30" width="100" height="136" rx="4" fill={C.white} /></FadeIn>
      <DrawPath d="M52 30 H152 V166 H52 Z" />
      {[56, 82, 108].map((y, i) => (
        <g key={y}>
          <DrawPath d={`M66 ${y} H110`} delay={0.3 + i * 0.1} stroke={C.ink} strokeWidth={1.1} />
          <DrawPath d={`M66 ${y + 10} H138 V${y + 20} H66 Z`} delay={0.4 + i * 0.1} stroke={C.teal} strokeWidth={1.1} />
        </g>
      ))}
      <Loop animate={{ x: [0, 14, 0], y: [0, 4, 0] }} duration={3.5}>
        <g transform="rotate(40 160 132)">
          <rect x="152" y="80" width="14" height="70" rx="3" fill={C.saffron} />
          <path d="M152 150 L159 166 L166 150 Z" fill={C.ink} />
        </g>
      </Loop>
    </Svg>
  );
}
