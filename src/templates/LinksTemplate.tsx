import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { SmartLink } from '../components/ui/SmartLink';
import { SourceNote } from './shared';
import { hostOf } from '../lib/links';
import { fadeUp, stagger } from '../lib/motion';
import { usePageSetup } from '../lib/page-context';
import type { LinksPage } from '../lib/types';

export function LinksTemplate({ page }: { page: LinksPage }) {
  usePageSetup(page.title, page.hiUrl);
  const links = page.links.filter((l, i, arr) => arr.findIndex(x => (x.href ?? x.to) === (l.href ?? l.to)) === i);
  return (
    <>
      <PageHeader title={page.title} eyebrow="More" lead="Websites of related ministries, regulators and public institutions." printable={false} />
      <div className="container-page py-12 md:py-16">
        <p className="text-meta text-muted">These links open external websites in a new tab. IPC is not responsible for their content.</p>
        <motion.ul variants={stagger(0.03)} initial="hidden" animate="visible" className="mt-5 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {links.map(l => (
            <motion.li key={l.href ?? l.to} variants={fadeUp} className="bg-white">
              <SmartLink to={l.to} href={l.href} className="group flex h-full items-start justify-between gap-4 p-5 hover:bg-teal-50/60">
                <span>
                  <span className="block font-semibold leading-snug text-ink group-hover:text-teal-800">{l.label}</span>
                  {l.href && <span className="mt-1 block text-meta text-muted">{hostOf(l.href)}</span>}
                </span>
                <ArrowUpRight aria-hidden size={18} className="mt-0.5 shrink-0 text-muted group-hover:text-teal-700" />
              </SmartLink>
            </motion.li>
          ))}
        </motion.ul>
        <SourceNote official={page.official} />
      </div>
    </>
  );
}
