import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SmartLink } from './SmartLink';
import { isExternal } from '../../lib/links';

type Variant = 'primary' | 'secondary' | 'light' | 'ghost';

const styles: Record<Variant, string> = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800 border border-navy-900',
  secondary: 'bg-white text-navy-900 border border-line-strong hover:border-navy-900',
  light: 'bg-white text-navy-900 border border-white hover:bg-paper',
  ghost: 'text-white border border-white/35 hover:border-white hover:bg-white/5',
};

interface Props {
  to?: string;
  href?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

/** A deliberate call to action: square-shouldered, with a directional arrow that nudges on hover. */
export function EditorialButton({ to, href, variant = 'primary', children, className = '' }: Props) {
  const Icon = isExternal(href) ? ArrowUpRight : ArrowRight;
  return (
    <SmartLink
      to={to}
      href={href}
      className={`group inline-flex min-h-12 items-center gap-3 rounded-sm px-5 py-3 text-[0.9375rem] font-semibold tracking-[0.005em] transition-colors duration-200 active:scale-[0.985] ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      <span aria-hidden className="inline-flex transition-transform duration-200 ease-out group-hover:translate-x-1">
        <Icon size={18} strokeWidth={1.75} />
      </span>
    </SmartLink>
  );
}
