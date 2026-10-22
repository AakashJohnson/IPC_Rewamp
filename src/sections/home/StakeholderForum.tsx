import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartLink } from '../../components/ui/SmartLink';
import { inView, pop, stagger } from '../../lib/motion';
import { DocumentStack, FormPen, MagnifierDoc } from '../../components/illustrations';
import { SectionBackdrop } from '../../components/effects/SectionBackdrop';

const ART = [FormPen, MagnifierDoc, DocumentStack];
const ACCENTS = ['accent-saffron', 'accent-violet', 'accent-sky'];

// Wording follows the Pharmacopoeial Forum and stakeholder comment pages on www.ipc.gov.in.
const actions = [
  {
    letter: 'A',
    title: 'Monograph Submission',
    text: 'Request the inclusion of a monograph in the Indian Pharmacopoeia using the Monograph Inclusion Request Form.',
    cta: 'Submit a request',
    to: '/monograph-inclusion-request-form/submissions',
  },
  {
    letter: 'B',
    title: 'Draft New General Chapters / Monographs',
    text: 'For public review and comments. Stakeholders may provide comments within 45 days of upload to lab.ipc@gov.in.',
    cta: 'Review drafts',
    to: '/mandates/indian-pharmacopoeia/monographs/monographs-under-preparation',
  },
  {
    letter: 'C',
    title: 'Amendments Proposed to IP 2026',
    text: 'Draft revisions and amendments for comment. Comments are invited within 45 days of upload of the revision.',
    cta: 'Review amendments',
    to: '/mandates/indian-pharmacopoeia/monographs/monographs-for-comments',
  },
];

export function StakeholderForum() {
  return (
    <section aria-labelledby="forum-title" className="has-backdrop surface-aurora relative py-20 md:py-28">
      <SectionBackdrop variant="capsules" />
      <span aria-hidden className="aurora-blob -left-32 top-20 size-[32rem] bg-[#ffe1bd]" />
      <span aria-hidden className="aurora-blob -right-32 bottom-0 size-[34rem] bg-[#e5dcff]" style={{ '--ax': '-8vw', '--t': '30s' } as CSSProperties} />
      <div className="container-page">
        <SectionHeading
          id="forum-title"
          eyebrow="Pharmacopoeial Forum"
          title="Contribute to the standards"
          intro="Industry, academia and regulators take part in developing Indian Pharmacopoeia monographs."
          action={{ label: 'Monographs inclusion–exclusion criteria', to: '/mandates/indian-pharmacopoeia/monographs-inclusion-exclusion-criteria' }}
        />
        <motion.ol variants={stagger(0.09)} {...inView} className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-3">
          {actions.map((a, i) => {
            const Art = ART[i];
            return (
            <motion.li key={a.letter} variants={pop} className={ACCENTS[i]}>
              <SmartLink
                to={a.to}
                className={`field ${ACCENTS[i].replace('accent-', 'field-')} grain tilt spotlight group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[var(--radius-xl)] p-7`}
              >
                <span aria-hidden className="glare" />
                <Art className="pointer-events-none absolute right-3 top-3 w-32 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-3 group-hover:scale-110" />
                <span className="relative flex size-11 items-center justify-center rounded-full font-display text-[1.25rem] font-semibold text-white" style={{ background: 'var(--accent-ink)' }}>
                  {a.letter}
                </span>
                <span className="relative mt-6 block pr-24 font-display text-[1.375rem] font-semibold leading-tight sm:text-[1.625rem]">{a.title}</span>
                <span className="relative mt-3 block flex-1 text-[1rem] leading-relaxed">{a.text}</span>
                <span className="relative mt-7 inline-flex items-center gap-2 pt-1 text-[0.9375rem] font-semibold" style={{ color: 'var(--accent-ink)' }}>
                  <span className="link-sweep">{a.cta}</span> <ArrowRight aria-hidden size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </SmartLink>
            </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
