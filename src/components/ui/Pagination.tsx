import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  label?: string;
}

function pagesToShow(page: number, count: number): (number | 'gap')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = new Set([1, count, page - 1, page, page + 1].filter(p => p >= 1 && p <= count));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

export function Pagination({ page, pageCount, onChange, label = 'Pagination' }: Props) {
  if (pageCount <= 1) return null;
  const btn = 'inline-flex size-9 items-center justify-center rounded-xs border text-[0.9375rem] transition-colors sm:size-10';
  return (
    <nav aria-label={label} className="mt-10 flex flex-wrap items-center justify-between gap-4">
      <p className="text-meta text-muted">
        Page <span className="tabular font-semibold text-ink">{page}</span> of <span className="tabular">{pageCount}</span>
      </p>
      <ul className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        <li>
          <button type="button" className={`${btn} border-line bg-white text-ink hover:border-navy-900 disabled:opacity-40`} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
            <ChevronLeft aria-hidden size={18} />
          </button>
        </li>
        {pagesToShow(page, pageCount).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-muted">…</li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`${btn} tabular ${p === page ? 'border-navy-900 bg-navy-900 font-semibold text-white' : 'border-line bg-white text-ink hover:border-navy-900'}`}
              >
                <span className="sr-only">Page </span>{p}
              </button>
            </li>
          ),
        )}
        <li>
          <button type="button" className={`${btn} border-line bg-white text-ink hover:border-navy-900 disabled:opacity-40`} disabled={page === pageCount} onClick={() => onChange(page + 1)} aria-label="Next page">
            <ChevronRight aria-hidden size={18} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
