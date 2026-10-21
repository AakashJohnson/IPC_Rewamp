import type { ReactNode } from 'react';
import { MagnifierDoc } from '../illustrations';

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-line-strong bg-white/70 px-6 py-10 text-center md:px-10">
      <MagnifierDoc className="mx-auto w-40" />
      <p className="mt-4 text-[1.0625rem] font-semibold text-ink">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-lg text-[0.9375rem] text-muted">{children}</div>}
    </div>
  );
}
