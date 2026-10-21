import { useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'motion/react';
import { BadgeCheck, BookOpen, FilePen, HeartPulse, MessagesSquare, RotateCcw, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SmartLink } from '../../components/ui/SmartLink';
import { IconBadge } from '../../components/ui/IconBadge';
import { LabFlask } from '../../components/illustrations';
import { fadeUp, inView, stagger } from '../../lib/motion';

// Steps follow IPC's official "Monograph Development Process" diagram on
// /mandates/indian-pharmacopoeia/ip-review-process.
interface Step {
  title: string;
  points: string[];
  icon: LucideIcon;
  loop?: string;
}

const steps: Step[] = [
  {
    title: 'Public Health Need',
    icon: HeartPulse,
    points: ['Identification of need for new monograph by IPC or stakeholder.', 'Evaluation of monograph development as per inclusion criteria.'],
  },
  {
    title: 'Monograph Development',
    icon: FilePen,
    points: ['Drafting of monograph based on approved test methods and quality specifications.'],
  },
  {
    title: 'Public Comments',
    icon: MessagesSquare,
    points: ['Publishing draft monographs on IPC website for public and stakeholder’s comments.'],
  },
  {
    title: 'Monograph Review',
    icon: Users,
    points: ['Evaluation of comments and review of monographs in Expert Working Group for approval, or recommendation for further revision and comments.'],
    loop: 'Where further revision is required, the monograph returns to stakeholders and development.',
  },
  {
    title: 'Approval and Publication',
    icon: BadgeCheck,
    points: ['Approval of all the monographs by the Scientific Body of IPC.', 'Publication of approved monographs in the IP.'],
  },
  {
    title: 'Release of IP',
    icon: BookOpen,
    points: ['Release of the Indian Pharmacopoeia.'],
  },
];

const stakeholders = ['Manufacturers', 'Regulatory authorities', 'Drug testing laboratories', 'Healthcare professionals', 'Researchers and academicians'];

function StepCard({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { margin: '-45% 0px -45% 0px' });
  // Marked complete once the card reaches the upper half of the viewport (robust to fast scrolling).
  const seen = useInView(ref, { once: true, margin: '0px 0px -50% 0px' });
  return (
    <motion.li ref={ref} variants={fadeUp} className="relative pl-16 md:pl-20">
      {/* node on the timeline */}
      <span
        aria-hidden
        className={`absolute left-[1.05rem] top-6 flex size-6 items-center justify-center rounded-full border-2 transition-colors duration-500 md:left-[1.55rem] ${seen ? 'border-teal-600 bg-teal-600' : 'border-line-strong bg-white'}`}
      >
        <span className={`size-2 rounded-full transition-colors duration-500 ${seen ? 'bg-white' : 'bg-line-strong'}`} />
      </span>
      <div
        className={`group rounded-md border bg-white p-6 transition-[border-color,box-shadow,transform] duration-500 md:p-7 ${active ? 'border-teal-600/50 shadow-lift lg:-translate-y-0.5' : 'border-line'}`}
      >
        <div className="flex items-start gap-4">
          <IconBadge icon={step.icon} tone={active ? 'teal' : 'navy'} />
          <div className="min-w-0">
            <p className="tabular text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-saffron-700">Step {String(index + 1).padStart(2, '0')}</p>
            <h3 className="mt-1 text-h3">{step.title}</h3>
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-[0.9375rem] leading-relaxed text-slate">
          {step.points.map(p => (
            <li key={p} className="flex gap-2.5">
              <span aria-hidden className="mt-[0.6rem] h-px w-3 shrink-0 bg-teal-600" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        {step.loop && (
          <p className="mt-4 flex items-start gap-2 rounded-sm bg-paper px-3 py-2.5 text-[0.875rem] text-muted">
            <RotateCcw aria-hidden size={16} className="mt-0.5 shrink-0 text-saffron-700" />
            {step.loop}
          </p>
        )}
      </div>
    </motion.li>
  );
}

export function MonographProcess() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 65%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section aria-labelledby="process-title" className="relative overflow-hidden border-t border-line bg-white py-16 md:py-24">
      <div className="container-page relative grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <motion.div variants={stagger(0.08)} {...inView}>
              <motion.p variants={fadeUp} className="eyebrow"><span className="index">04</span><span className="rule" aria-hidden />How standards are made</motion.p>
              <motion.h2 variants={fadeUp} id="process-title" className="mt-4 text-h2">From public health need to the Indian Pharmacopoeia</motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-body leading-relaxed text-muted">
                Public review and comment are given special attention in developing Indian Pharmacopoeia standards. The principle of “openness, justice and fairness” is kept in mind during compiling and editing its contents.
              </motion.p>
            </motion.div>
            <LabFlask className="mx-auto mt-6 hidden w-64 lg:block xl:w-72" />
            <div className="mt-6">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Stakeholders taking part</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {stakeholders.map(s => (
                  <li key={s} className="rounded-full border border-line bg-paper px-3 py-1.5 text-[0.8125rem] font-medium text-ink">{s}</li>
                ))}
              </ul>
            </div>
            <SmartLink to="/mandates/indian-pharmacopoeia/ip-review-process" className="link-underline mt-6 inline-block text-[0.9375rem] font-semibold">
              IP review process
            </SmartLink>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          {/* timeline rail + scroll-linked fill */}
          <span aria-hidden className="absolute bottom-4 left-[1.7rem] top-4 w-px bg-line md:left-[2.2rem]" />
          <motion.span
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute bottom-4 left-[1.7rem] top-4 w-[2px] origin-top bg-gradient-to-b from-teal-600 via-teal-600 to-saffron md:left-[2.2rem]"
          />
          <motion.ol ref={listRef} variants={stagger(0.08)} {...inView} className="relative space-y-6">
            {steps.map((s, i) => <StepCard key={s.title} step={s} index={i} />)}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
