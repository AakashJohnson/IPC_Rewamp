import type { LucideIcon } from 'lucide-react';

type Tone = 'teal' | 'saffron' | 'navy' | 'green' | 'light';
type Size = 'sm' | 'md' | 'lg';

const tones: Record<Tone, string> = {
  teal: 'from-teal-50 to-white text-teal-700 ring-teal-600/20 group-hover:ring-teal-600/45',
  saffron: 'from-[#fbf1e4] to-white text-saffron-700 ring-saffron/25 group-hover:ring-saffron/55',
  navy: 'from-navy-100 to-white text-navy-800 ring-navy-800/15 group-hover:ring-navy-800/40',
  green: 'from-[#e7f2ec] to-white text-green-700 ring-green/25 group-hover:ring-green/50',
  light: 'from-white/15 to-white/5 text-white ring-white/25 group-hover:ring-white/50',
};

const sizes: Record<Size, { box: string; icon: number; dot: string }> = {
  sm: { box: 'size-9 rounded-sm', icon: 17, dot: 'size-1.5 -right-0.5 -top-0.5' },
  md: { box: 'size-12 rounded-md', icon: 22, dot: 'size-2 -right-0.5 -top-0.5' },
  lg: { box: 'size-16 rounded-md', icon: 30, dot: 'size-2.5 -right-1 -top-1' },
};

/**
 * Two-tone icon tile: gradient ground, hairline ring and a small accent node.
 * Reacts to a parent `group` hover (ring strengthens, icon lifts and turns slightly).
 */
export function IconBadge({ icon: Icon, tone = 'teal', size = 'md', className = '' }: { icon: LucideIcon; tone?: Tone; size?: Size; className?: string }) {
  const s = sizes[size];
  return (
    <span aria-hidden className={`relative inline-flex shrink-0 items-center justify-center bg-gradient-to-br ring-1 transition-[box-shadow,transform] duration-300 ${tones[tone]} ${s.box} ${className}`}>
      <Icon size={s.icon} strokeWidth={1.6} className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:-rotate-6" />
      <span className={`absolute rounded-full ${s.dot} ${tone === 'saffron' ? 'bg-teal-600' : 'bg-saffron'}`} />
    </span>
  );
}
