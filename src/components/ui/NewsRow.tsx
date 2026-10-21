import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SmartLink } from './SmartLink';
import { dateBlock, formatDate } from '../../lib/format';
import { fadeUp } from '../../lib/motion';
import type { NewsItem } from '../../lib/types';
import { isRecent } from '../../lib/news';
import { topicIcon } from '../../lib/icons';

interface Props {
  item: NewsItem;
  compact?: boolean;
}

export function NewsRow({ item, compact = false }: Props) {
  const d = dateBlock(item.date);
  const Icon = topicIcon(item.category);
  return (
    <motion.li variants={fadeUp} className="border-b border-line">
      <SmartLink
        to={item.route}
        href={item.href}
        className={`group grid grid-cols-[4.25rem_minmax(0,1fr)] gap-x-5 transition-colors hover:bg-white sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] ${compact ? 'py-4' : 'py-5'} sm:-mx-4 sm:px-4`}
      >
        {d ? (
          <time dateTime={item.date} className="tabular flex flex-col leading-none text-ink">
            <span className="text-[1.625rem] font-semibold tracking-tight sm:text-[1.875rem]">{d.day}</span>
            <span className="mt-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-muted">
              {d.month} {d.year}
            </span>
            <span className="sr-only">{formatDate(item.date)}</span>
          </time>
        ) : <span />}
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] font-semibold uppercase tracking-[0.1em]">
            <span className="inline-flex items-center gap-1.5 text-teal-700">
              <Icon aria-hidden size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
              {item.category}
            </span>
            {isRecent(item) && (
              <span className="rounded-xs bg-saffron/15 px-1.5 py-0.5 text-saffron-700">New</span>
            )}
          </span>
          <span className={`mt-1.5 block font-medium leading-snug text-ink [overflow-wrap:anywhere] group-hover:text-teal-800 ${compact ? 'text-[1rem]' : 'text-[1.0625rem]'}`}>
            {item.title}
          </span>
        </span>
        <ArrowRight
          aria-hidden
          size={18}
          className="mt-1 hidden text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-teal-700 sm:block"
        />
      </SmartLink>
    </motion.li>
  );
}
