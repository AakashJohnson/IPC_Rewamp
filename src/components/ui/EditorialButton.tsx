import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SmartLink } from './SmartLink';
import { isExternal } from '../../lib/links';
import { useMagnetic } from '../../lib/magnetic';

type Variant = 'primary' | 'secondary' | 'light' | 'ghost';

const styles: Record<Variant, string> = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800 border border-navy-900 shadow-[0_10px_24px_-14px_rgb(11_34_64/0.7)]',
  secondary: 'bg-white text-navy-900 border border-line-strong hover:border-navy-900',
  light: 'bg-white text-navy-900 border border-white hover:bg-pearl',
  ghost: 'text-white border border-white/40 hover:border-white hover:bg-white/10',
};

interface Props {
  to?: string;
  href?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Gentle attraction towards a fine pointer. Off for touch and reduced motion. */
  magnetic?: boolean;
}

/** A deliberate call to action: a full pill with a directional arrow that nudges on hover and presses in. */
export function EditorialButton({ to, href, variant = 'primary', children, className = '', magnetic = false }: Props) {
  const Icon = isExternal(href) ? ArrowUpRight : ArrowRight;
  const ref = useMagnetic<HTMLSpanElement>(magnetic);
  return (
    <span ref={ref} className={`inline-flex ${magnetic ? 'magnetic' : ''}`}>
      <SmartLink
        to={to}
        href={href}
        className={`group inline-flex min-h-12 items-center gap-3 rounded-full py-3 pl-6 pr-5 text-[0.9375rem] font-semibold tracking-[0.005em] transition-[background-color,border-color,transform,box-shadow] duration-200 active:scale-[0.97] ${styles[variant]} ${className}`}
      >
        <span>{children}</span>
        <span aria-hidden className="inline-flex size-7 items-center justify-center rounded-full bg-current/10 transition-transform duration-300 ease-out group-hover:translate-x-1">
          <Icon size={17} strokeWidth={2} />
        </span>
      </SmartLink>
    </span>
  );
}
