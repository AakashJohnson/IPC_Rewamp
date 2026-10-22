import { NavLink } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import type { SideNavModel } from '../../lib/nav';
import { SmartLink } from './SmartLink';
import type { LinkItem } from '../../lib/types';

function Item({ item, nested = false }: { item: LinkItem; nested?: boolean }) {
  const base = `group flex items-start gap-2 border-l py-1.5 leading-snug transition-colors ${nested ? 'pl-6 text-[0.875rem]' : 'pl-4 text-[0.9375rem]'}`;
  if (item.to) {
    return (
      <NavLink
        to={item.to}
        end
        className={({ isActive }) =>
          `${base} rounded-r-full ${isActive ? 'border-[color:var(--accent,var(--color-teal-600))] bg-white font-semibold text-ink shadow-hair' : 'border-line text-slate hover:border-line-strong hover:bg-white/70 hover:text-ink'}`
        }
      >
        {item.label}
      </NavLink>
    );
  }
  return (
    <SmartLink href={item.href} file={item.file} badge className={`${base} border-line text-muted hover:text-ink`}>
      {item.label}
      {!item.file && <ArrowUpRight aria-hidden size={13} className="mt-1 shrink-0 opacity-60" />}
    </SmartLink>
  );
}

/** Sticky section navigation for interior pages. */
export function SideNav({ model, label = 'In this section' }: { model: SideNavModel; label?: string }) {
  return (
    <nav aria-label={label} className="no-print">
      <p className="text-[0.875rem] font-semibold" style={{ color: 'var(--accent-ink, var(--color-teal-700))' }}>{label}</p>
      <p className="mt-2 text-[1.0625rem] font-semibold text-ink">
        {model.heading.to ? <SmartLink to={model.heading.to} className="hover:text-teal-700">{model.heading.label}</SmartLink> : model.heading.label}
      </p>
      <ul className="mt-4 space-y-0.5">
        {model.items.map(item => (
          <li key={`${item.label}-${item.to ?? item.href}`}>
            <Item item={item} />
            {item.children && item.children.length > 0 && (
              <ul className="space-y-0.5">
                {item.children.map(c => (
                  <li key={`${c.label}-${c.to ?? c.href}`}>
                    <Item item={c} nested />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
