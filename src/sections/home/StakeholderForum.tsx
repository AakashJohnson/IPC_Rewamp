import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartLink } from '../../components/ui/SmartLink';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { DocumentStack, FormPen, MagnifierDoc } from '../../components/illustrations';
import { Spotlight } from '../../components/effects/Interactive';

const ART = [FormPen, MagnifierDoc, DocumentStack];

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
    <section aria-labelledby="forum-title" className="border-t border-line bg-paper py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          id="forum-title"
          index="07"
          eyebrow="Pharmacopoeial Forum"
          title="Contribute to the standards"
          intro="Industry, academia and regulators take part in developing Indian Pharmacopoeia monographs."
          action={{ label: 'Monographs inclusion–exclusion criteria', to: '/mandates/indian-pharmacopoeia/monographs-inclusion-exclusion-criteria' }}
        />
        <motion.ol variants={stagger(0.09)} {...inView} className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-3">
          {actions.map((a, i) => {
            const Art = ART[i];
            return (
            <motion.li key={a.letter} variants={fadeUp}>
              <Spotlight className="h-full">
              <SmartLink
                to={a.to}
                className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-line-strong bg-white p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-navy-900 hover:shadow-lift"
              >
                <Art className="pointer-events-none absolute right-3 top-3 w-28 opacity-90 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-2" />
                <span className="relative flex size-10 items-center justify-center rounded-full border border-navy-900 font-serif text-[1.125rem] font-semibold text-navy-900">
                  {a.letter}
                </span>
                <span className="relative mt-6 block pr-24 text-h3 font-semibold text-ink">{a.title}</span>
                <span className="relative mt-3 block flex-1 text-[0.9375rem] leading-relaxed text-muted">{a.text}</span>
                <span className="relative mt-7 inline-flex items-center gap-2 border-t border-line pt-5 text-[0.9375rem] font-semibold text-teal-700">
                  {a.cta} <ArrowRight aria-hidden size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </SmartLink>
              </Spotlight>
            </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
