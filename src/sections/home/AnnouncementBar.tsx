import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SmartLink } from '../../components/ui/SmartLink';
import { formatDate } from '../../lib/format';
import { fadeUp, stagger } from '../../lib/motion';
import home from '../../content/home.json';
import type { NewsItem } from '../../lib/types';
import { topicIcon } from '../../lib/icons';
import { IconBadge } from '../../components/ui/IconBadge';

const latest = (home.latestNews as NewsItem[]).slice(0, 3);

/** The three most recent official updates — static, fully keyboard reachable, no marquee. */
export function AnnouncementBar() {
  return (
    <section aria-labelledby="official-updates" className="border-b border-line bg-white">
      <div className="container-page grid gap-4 py-6 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="flex items-center justify-between gap-4 lg:col-span-2 lg:block">
          <h2 id="official-updates" className="flex items-center gap-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] !text-navy-900">
            <span aria-hidden className="relative flex size-2"><span className="animate-ping-soft absolute inline-flex size-full rounded-full bg-saffron" /><span className="relative inline-flex size-2 rounded-full bg-saffron" /></span>
            Official updates
          </h2>
          <SmartLink to="/news-highlights" className="group inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-teal-700 lg:mt-2">
            View all <ArrowRight aria-hidden size={15} className="transition-transform group-hover:translate-x-1" />
          </SmartLink>
        </div>
        <motion.ol variants={stagger(0.08, 0.9)} initial="hidden" animate="visible" className="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3 lg:col-span-10">
          {latest.map(n => (
            <motion.li key={n.route ?? n.href} variants={fadeUp} className="bg-white">
              <SmartLink to={n.route} href={n.href} className="group flex h-full gap-3 p-4 transition-colors hover:bg-teal-50/60">
                <IconBadge icon={topicIcon(n.category)} size="sm" />
                <span className="flex min-w-0 flex-col gap-1">
                  <time dateTime={n.date} className="tabular text-meta font-semibold text-muted">{formatDate(n.date)}</time>
                  <span className="line-clamp-2 text-[0.9375rem] font-medium leading-snug text-ink group-hover:text-teal-800">{n.title}</span>
                </span>
              </SmartLink>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
