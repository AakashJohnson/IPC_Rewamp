// Ambient, decorative backgrounds. All motion is CSS transform/opacity keyframes (cheap to composite)
// and is switched off by the global prefers-reduced-motion rule. Everything here is aria-hidden.

interface Cluster {
  x: number;
  y: number;
  scale: number;
  anim: 'drift-a' | 'drift-b' | 'drift-c';
  duration: number;
  nodes: [number, number][];
  bonds: [number, number][];
}

const RING: [number, number][] = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i - Math.PI / 2;
  return [Math.round(Math.cos(a) * 22), Math.round(Math.sin(a) * 22)];
});

const CLUSTERS: Cluster[] = [
  { x: 6, y: 18, scale: 1.1, anim: 'drift-a', duration: 26, nodes: [...RING, [0, -52], [44, -64]], bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [6, 7]] },
  { x: 30, y: 78, scale: 0.8, anim: 'drift-b', duration: 32, nodes: [[0, 0], [34, -18], [68, 0], [68, 38], [102, -18]], bonds: [[0, 1], [1, 2], [2, 3], [2, 4]] },
  { x: 52, y: 12, scale: 0.7, anim: 'drift-c', duration: 28, nodes: [...RING, [38, 22]], bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 6]] },
  { x: 74, y: 64, scale: 1.2, anim: 'drift-a', duration: 36, nodes: [...RING, [-40, 26], [-40, 66], [40, 26]], bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [4, 6], [6, 7], [2, 8]] },
  { x: 90, y: 22, scale: 0.9, anim: 'drift-b', duration: 30, nodes: [[0, 0], [30, 20], [60, 0], [90, 20]], bonds: [[0, 1], [1, 2], [2, 3]] },
  { x: 16, y: 56, scale: 0.6, anim: 'drift-c', duration: 24, nodes: [[0, 0], [26, 14], [26, 44], [52, 0]], bonds: [[0, 1], [1, 2], [1, 3]] },
];

const FIELD_MASKS = {
  // Keeps reading areas (left-aligned copy) clear; molecules drift around the right and edges.
  right: 'linear-gradient(to right, transparent 30%, #000 72%)',
  edges: 'radial-gradient(ellipse at center, transparent 35%, #000 80%)',
  none: 'none',
};

/** Slowly drifting molecular structures. `tone` sets their colour. */
export function MoleculeField({ className = '', tone = 'text-navy-900/[0.08]', accent = true, mask = 'right' }: { className?: string; tone?: string; accent?: boolean; mask?: keyof typeof FIELD_MASKS }) {
  return (
    <div aria-hidden className={`decor pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ maskImage: FIELD_MASKS[mask], WebkitMaskImage: FIELD_MASKS[mask] }}>
      {CLUSTERS.map((c, i) => (
        <svg
          key={i}
          className={`absolute ${tone}`}
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: 180 * c.scale,
            height: 180 * c.scale,
            animation: `${c.anim} ${c.duration}s ease-in-out ${-i * 3}s infinite`,
          }}
          viewBox="-90 -90 180 180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          {c.bonds.map(([a, b], j) => (
            <line key={j} x1={c.nodes[a][0]} y1={c.nodes[a][1]} x2={c.nodes[b][0]} y2={c.nodes[b][1]} />
          ))}
          {c.nodes.map(([x, y], j) => (
            <circle
              key={j}
              cx={x}
              cy={y}
              r={j === 0 ? 4.5 : 3.2}
              fill={accent && j === c.nodes.length - 1 ? 'var(--color-saffron)' : accent && j === 0 ? 'var(--color-teal-600)' : 'currentColor'}
              stroke="none"
              opacity={accent && (j === 0 || j === c.nodes.length - 1) ? 0.55 : 1}
            />
          ))}
        </svg>
      ))}
    </div>
  );
}
