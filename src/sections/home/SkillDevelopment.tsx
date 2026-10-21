import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartLink } from '../../components/ui/SmartLink';
import { NewsRow } from '../../components/ui/NewsRow';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { Microscope, TrainingCap } from '../../components/illustrations';
import { MoleculeField } from '../../components/effects/AnimatedBackdrop';
import { iconFor } from '../../lib/icons';
import { IconBadge } from '../../components/ui/IconBadge';
import home from '../../content/home.json';
import type { NewsItem } from '../../lib/types';

const programmes = [
  { label: 'Skill Development — training periods and fees', to: '/mandates/skill-development' },
  { label: 'Application Form for Training / Project Work', to: '/training-form' },
  { label: 'PvPI Training and Education', to: '/mandates/pvpi/training-and-education' },
  { label: 'MvPI Internship Programme', to: '/mandates/materiovigilance-programme-of-india-mvpi/mvpi-internship-programme' },
  { label: 'Quality Assurance — Training & Skill Development', to: '/about-us/departments/quality-assurance/training-skill-development' },
  { label: 'Analytical Support for skill development & drug discovery', to: '/about-us/about-ipc/indian-pharmacopoeia-laboratory-ipl/analytical-support-for-skill-development-drug-discovery' },
];

const trainingNews = (home.latestNews as NewsItem[]).filter(n => n.category === 'Training & Internships').slice(0, 3);

const photos = [
  { src: '/images/official/training-1-256.webp', w: 256, h: 171 },
  { src: '/images/official/training-2-240.webp', w: 240, h: 160 },
  { src: '/images/official/training-3-240.webp', w: 240, h: 160 },
];

export function SkillDevelopment() {
  return (
    <section aria-labelledby="training-title" className="relative overflow-hidden border-t border-line bg-paper-2/60 py-16 md:py-24">
      <MoleculeField tone="text-navy-900/[0.06]" />
      <div className="container-page relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            id="training-title"
            index="08"
            eyebrow="Capacity building"
            title="Training & skill development"
            intro="To organize educational programs and research activities for spreading and establishing awareness on the need and scope of quality standards for drugs and related articles."
            align="stack"
          />
          <div className="relative mt-8 flex items-end justify-center gap-2">
            <TrainingCap className="w-48 md:w-56" />
            <Microscope className="-ml-6 w-36 md:w-44" />
          </div>
          <motion.div variants={stagger(0.08)} {...inView} className="mt-6 grid grid-cols-3 gap-3">
            {photos.map((p, i) => (
              <motion.div key={p.src} variants={fadeUp} className={`overflow-hidden rounded-sm border border-line bg-white p-1.5 ${i === 1 ? 'translate-y-5' : ''}`}>
                <img src={p.src} width={p.w} height={p.h} alt="Participants at an IPC training programme" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] !text-muted">Programmes & applications</h3>
          <motion.ul variants={stagger(0.05)} {...inView} className="mt-4 border-t border-line-strong">
            {programmes.map(p => (
              <motion.li key={p.to} variants={fadeUp} className="border-b border-line">
                <SmartLink to={p.to} className="group flex items-center gap-4 py-3.5 text-[1rem] font-medium text-ink hover:text-teal-800">
                  <IconBadge icon={iconFor(p.label)} size="sm" />
                  <span className="flex-1">{p.label}</span>
                  <ArrowRight aria-hidden size={17} className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-teal-700" />
                </SmartLink>
              </motion.li>
            ))}
          </motion.ul>

          {trainingNews.length > 0 && (
            <>
              <h3 className="mt-12 text-[0.75rem] font-semibold uppercase tracking-[0.12em] !text-muted">Latest training announcements</h3>
              <motion.ul variants={stagger(0.05)} {...inView} className="mt-2">
                {trainingNews.map(n => <NewsRow key={n.route ?? n.href} item={n} compact />)}
              </motion.ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
