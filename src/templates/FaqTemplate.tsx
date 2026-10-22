import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { PageCanvas } from '../components/ui/PageCanvas';
import { AccordionItem } from '../components/ui/Accordion';
import { RichContent } from '../components/ui/RichContent';
import { SmartLink } from '../components/ui/SmartLink';
import { SourceNote } from './shared';
import { usePageSetup } from '../lib/page-context';
import type { FaqPage } from '../lib/types';

export function FaqTemplate({ page }: { page: FaqPage }) {
  usePageSetup(page.title, page.hiUrl);
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const allOpen = open.size === page.items.length;

  const toggle = (i: number) => setOpen(s => {
    const next = new Set(s);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    return next;
  });

  return (
    <>
      <PageHeader title={page.title} eyebrow="Help" />
      <PageCanvas>
      <div className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-12">
        <div className="page-sheet min-w-0 lg:col-span-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-meta text-muted"><span className="tabular font-semibold text-ink">{page.items.length}</span> questions</p>
            <button
              type="button"
              onClick={() => setOpen(allOpen ? new Set() : new Set(page.items.map((_, i) => i)))}
              className="text-meta font-semibold text-teal-700 hover:text-teal-800"
            >
              {allOpen ? 'Collapse all' : 'Expand all'}
            </button>
          </div>
          {page.items.map((item, i) => (
            <AccordionItem key={item.q} index={i + 1} title={item.q} open={open.has(i)} onToggle={() => toggle(i)}>
              <RichContent html={item.a} />
            </AccordionItem>
          ))}
          <SourceNote official={page.official} updated={page.updated} />
        </div>
        <aside className="lg:col-span-3 lg:col-start-10">
          <div className="field field-sky grain spotlight overflow-hidden rounded-[var(--radius-xl)] p-6 lg:sticky lg:top-32">
            <p className="font-semibold text-ink">Still have a question?</p>
            <p className="mt-2 text-[0.9375rem] text-muted">Write to the Commission or send your feedback.</p>
            <ul className="mt-4 space-y-2 text-[0.9375rem]">
              <li><SmartLink to="/about-us/contact-us" className="link-underline">Contact Us</SmartLink></li>
              <li><SmartLink to="/feedback-form" className="link-underline">Feedback Form</SmartLink></li>
              <li><SmartLink to="/help" className="link-underline">Help</SmartLink></li>
            </ul>
          </div>
        </aside>
      </div>
      </PageCanvas>
    </>
  );
}
