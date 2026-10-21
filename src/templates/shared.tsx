import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SmartLink } from '../components/ui/SmartLink';
import { formatDate } from '../lib/format';
import { fadeUp, inView, stagger } from '../lib/motion';
import type { NavNode } from '../lib/types';
import { iconFor } from '../lib/icons';
import { IconBadge } from '../components/ui/IconBadge';
import { Spotlight } from '../components/effects/Interactive';

/** Provenance line at the end of every content page. */
export function SourceNote({ official, updated }: { official: string; updated?: string }) {
  return (
    <div className="no-print mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-meta text-muted">
      {updated && <span>Last updated on the official website: <time dateTime={updated}>{formatDate(updated)}</time></span>}
      <a href={official} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink">
        View on www.ipc.gov.in <ArrowUpRight aria-hidden size={13} />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

/** Grid of child destinations for section landing pages. */
export function ChildLinks({ nodes, heading = 'In this section' }: { nodes: NavNode[]; heading?: string }) {
  if (!nodes.length) return null;
  return (
    <section aria-labelledby="child-links" className="mt-2">
      <h2 id="child-links" className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">{heading}</h2>
      <motion.ul variants={stagger(0.04)} {...inView} className="mt-4 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
        {nodes.map((n, i) => (
          <motion.li
            key={`${n.label}-${n.to ?? n.href}`}
            variants={fadeUp}
            className={`bg-white ${i === nodes.length - 1 && nodes.length % 2 ? "sm:col-span-2" : ""}`}
          >
            <Spotlight className="h-full">
            <SmartLink
              to={n.to}
              href={n.href}
              file={n.file}
              badge
              className="group flex h-full items-start gap-4 p-5"
            >
              <IconBadge icon={iconFor(n.label)} size="sm" />
              <span className="flex-1">
                <span className="block font-semibold leading-snug text-ink group-hover:text-teal-800">{n.label}</span>
                {n.children?.length ? <span className="mt-1 block text-meta text-muted">{n.children.length} {n.children.length === 1 ? 'page' : 'pages'}</span> : null}
              </span>
              {n.to ? (
                <ArrowRight aria-hidden size={18} className="mt-0.5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-teal-700" />
              ) : (
                <ArrowUpRight aria-hidden size={18} className="mt-0.5 shrink-0 text-muted group-hover:text-teal-700" />
              )}
            </SmartLink>
            </Spotlight>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

export function UpdatedMeta({ updated }: { updated?: string }) {
  return updated ? <span>Last updated <time dateTime={updated}>{formatDate(updated)}</time></span> : null;
}
