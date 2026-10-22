import { FileText, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Spotlight } from '../effects/Interactive';
import { motion } from 'motion/react';
import { SmartLink } from './SmartLink';
import { FILE_LABEL, formatDate, formatSize } from '../../lib/format';
import { fadeUp } from '../../lib/motion';
import type { RegisterRow } from '../../lib/types';

interface Props {
  row: RegisterRow;
  index?: number;
  showExpiry?: boolean;
}

/** A downloadable official document: title, type, size and dates in one comfortable click target. */
export function DocumentRow({ row, index, showExpiry }: Props) {
  const isDoc = !!row.file && !row.internal;
  return (
    <motion.li variants={fadeUp}>
      <Spotlight>
      <SmartLink
        to={row.internal ? row.href : undefined}
        href={row.internal ? undefined : row.href}
        className="tilt group relative grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 overflow-hidden tex-card edge-glow rounded-[var(--radius-lg)] bg-pearl px-4 py-4 shadow-hair hover:bg-white md:px-5"
      >
        <span aria-hidden className="relative mt-0.5 flex h-12 w-10 flex-col items-center justify-center rounded-xs border border-line bg-gradient-to-b from-white to-paper text-teal-700 transition-[transform,border-color] duration-300 [clip-path:polygon(0_0,72%_0,100%_22%,100%_100%,0_100%)] group-hover:-translate-y-0.5 group-hover:border-teal-600/40">
          <span className="absolute right-0 top-0 size-[11px] border-b border-l border-line bg-paper-2" />
          {index !== undefined ? <span className="tabular text-[0.75rem] font-semibold text-muted">{String(index).padStart(2, '0')}</span> : <FileText size={16} strokeWidth={1.6} />}
          {isDoc && <span className="mt-0.5 rounded-[2px] bg-saffron-700 px-1 text-[0.5625rem] font-bold leading-[1.4] tracking-wide text-white">{(FILE_LABEL[row.file!] ?? row.file ?? '').toUpperCase()}</span>}
        </span>
        <span className="min-w-0">
          <span className="block font-medium leading-snug text-ink [overflow-wrap:anywhere] group-hover:text-teal-800">{row.title}</span>
          <span className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-meta text-muted">
            {row.date && <span className="rounded-full bg-white px-2.5 py-0.5 shadow-hair">Published <time dateTime={row.date}>{formatDate(row.date)}</time></span>}
            {showExpiry && row.expiry && <span>Closes <time dateTime={row.expiry}>{formatDate(row.expiry)}</time></span>}
            {isDoc && <span className="font-semibold tracking-wide text-ink/70">{FILE_LABEL[row.file!] ?? row.file}</span>}
            {row.sizeKB ? <span>{formatSize(row.sizeKB)}</span> : null}
          </span>
        </span>
        <span aria-hidden className="mt-1.5 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-teal-700">
          {row.internal ? <ArrowRight size={18} /> : <ArrowUpRight size={18} />}
        </span>
      </SmartLink>
      </Spotlight>
    </motion.li>
  );
}
