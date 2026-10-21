/** Fine concentric measurement rings with tick marks — a nod to calibrated instruments. Decorative. */
export function ConcentricArcs({ className = '' }: { className?: string }) {
  const rings = [80, 130, 180, 230, 280];
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 600 600" className={className} fill="none" stroke="currentColor">
      {rings.map((r, i) => (
        <circle key={r} cx="300" cy="300" r={r} strokeWidth={i === rings.length - 1 ? 1.2 : 0.8} strokeDasharray={i === 2 ? '2 6' : undefined} />
      ))}
      {ticks.map(a => {
        const long = a % 30 === 0;
        const rad = (a * Math.PI) / 180;
        const r1 = 280, r2 = long ? 262 : 271;
        return (
          <line key={a} x1={300 + r1 * Math.cos(rad)} y1={300 + r1 * Math.sin(rad)} x2={300 + r2 * Math.cos(rad)} y2={300 + r2 * Math.sin(rad)} strokeWidth={long ? 1.1 : 0.7} />
        );
      })}
      <line x1="20" y1="300" x2="580" y2="300" strokeWidth="0.6" strokeDasharray="1 5" />
      <line x1="300" y1="20" x2="300" y2="580" strokeWidth="0.6" strokeDasharray="1 5" />
    </svg>
  );
}
