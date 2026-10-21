import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import type { Crumb } from '../../lib/types';

export function Breadcrumbs({ crumbs, current }: { crumbs: Crumb[]; current: string }) {
  // The CMS ends the trail with the current page (sometimes under a slightly different label);
  // the page title is always rendered as the current location instead.
  const trail = crumbs.filter((c, i) => !(i === crumbs.length - 1 && (!c.href || c.label === current)));
  return (
    <nav aria-label="Breadcrumb" className="no-print">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-meta text-muted">
        <li className="flex items-center gap-1.5">
          <Link to="/" className="hover:text-ink hover:underline underline-offset-4">Home</Link>
        </li>
        {trail.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight aria-hidden size={13} className="text-line-strong" />
            {c.href ? (
              <Link to={c.href} className="hover:text-ink hover:underline underline-offset-4">{c.label}</Link>
            ) : (
              <span>{c.label}</span>
            )}
          </li>
        ))}
        <li className="flex min-w-0 items-center gap-1.5">
          <ChevronRight aria-hidden size={13} className="text-line-strong" />
          <span aria-current="page" className="line-clamp-1 font-medium text-ink">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
