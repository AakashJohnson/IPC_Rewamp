/** A sparse, hand-placed connected-node motif (benzene ring + chain). Decorative. */
export function MolecularNetwork({ className = '' }: { className?: string }) {
  // Hexagon centred at (120,120), r=48, then a chain of bonds to the right.
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [120 + 48 * Math.cos(a), 120 + 48 * Math.sin(a)] as const;
  });
  const chain: (readonly [number, number])[] = [hex[1], [204, 72], [254, 100], [304, 72], [354, 100], [354, 156], [404, 184]];
  const branch: (readonly [number, number])[] = [[304, 72], [304, 20]];
  const lines = [
    ...hex.map((p, i) => [p, hex[(i + 1) % 6]] as const),
    ...chain.slice(1).map((p, i) => [chain[i], p] as const),
    [branch[0], branch[1]] as const,
  ];
  const nodes = [...hex, ...chain.slice(1), branch[1]];
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 440 240" className={className} fill="none" stroke="currentColor">
      {lines.map(([a, b], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} strokeWidth="1" />
      ))}
      {/* inner ring for aromaticity */}
      <circle cx="120" cy="120" r="28" strokeWidth="0.8" strokeDasharray="3 4" />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 3} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}
