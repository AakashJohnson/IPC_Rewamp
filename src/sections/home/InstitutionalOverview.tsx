import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Building2, Landmark, ShieldCheck, UserRound } from 'lucide-react';
import { IconBadge } from '../../components/ui/IconBadge';
import { ContourLines } from '../../components/effects/AnimatedBackdrop';
import { Institution } from '../../components/illustrations';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { EditorialButton } from '../../components/ui/EditorialButton';
import { SmartLink } from '../../components/ui/SmartLink';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { about, missionVision } from '../../config/site';

// Facts from /about-us/about-ipc (Formation of IPC).
const facts = [
  { term: 'Status', detail: 'Autonomous Body, fully financed by the Central Government', icon: ShieldCheck },
  { term: 'Administrative control', detail: 'Ministry of Health and Family Welfare', icon: Landmark },
  { term: 'Chairperson', detail: 'Secretary, Ministry of Health and Family Welfare', icon: Building2 },
  { term: 'Chief Scientific & Executive Officer', detail: 'Secretary-cum-Scientific Director', icon: UserRound },
];

export function InstitutionalOverview() {
  const photo = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: photo, offset: ['start end', 'end start'] });
  const artY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  return (
    <section aria-labelledby="about-title" className="relative overflow-hidden border-y border-line bg-white py-16 md:py-24">
      <ContourLines tone="text-teal-700/[0.06]" />
      <div className="container-page relative">
        <SectionHeading id="about-title" index="02" eyebrow="About the Commission" title="An autonomous institution for the standards of drugs" align="stack" />

        <div className="mt-10 grid gap-12 md:mt-14 lg:grid-cols-12 lg:gap-10">
          <motion.div variants={stagger(0.08)} {...inView} className="lg:col-span-6">
            <motion.p variants={fadeUp} className="text-[1.1875rem] leading-relaxed text-ink">{about.lead}</motion.p>
            <motion.p variants={fadeUp} className="mt-5 leading-relaxed text-slate">{about.authority} {about.iprs}</motion.p>
            <motion.dl variants={fadeUp} className="mt-8 divide-y divide-line border-y border-line">
              {facts.map(f => (
                <div key={f.term} className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 py-3.5 sm:grid-cols-[auto_12rem_1fr]">
                  <IconBadge icon={f.icon} size="sm" tone="navy" className="row-span-2 sm:row-span-1" />
                  <dt className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted">{f.term}</dt>
                  <dd className="text-[0.9375rem] text-ink">{f.detail}</dd>
                </div>
              ))}
            </motion.dl>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <EditorialButton to="/about-us">About IPC</EditorialButton>
              <EditorialButton to="/about-us/about-ipc" variant="secondary">Formation of IPC</EditorialButton>
            </motion.div>
          </motion.div>

          <div ref={photo} className="relative lg:col-span-6">
            <motion.div style={{ y: artY }} className="decor pointer-events-none absolute -left-10 -top-16 z-10 hidden w-44 lg:block">
              <div className="rounded-md border border-line bg-white p-3 shadow-lift"><Institution className="w-full" /></div>
            </motion.div>
            <motion.figure variants={fadeUp} {...inView} className="relative">
              <div className="overflow-hidden rounded-sm border border-line bg-paper">
                <motion.img
                  src="/images/official/ipc-headquarters-640.webp"
                  width={640}
                  height={307}
                  loading="lazy"
                  decoding="async"
                  alt="The Indian Pharmacopoeia Commission building at Sector-23, Raj Nagar, Ghaziabad"
                  initial={{ scale: 1.06 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="block w-full"
                />
              </div>
              <figcaption className="mt-3 text-meta text-muted">IPC, Sector-23, Raj Nagar, Ghaziabad</figcaption>
            </motion.figure>

            <motion.div variants={stagger(0.1)} {...inView} className="mt-8 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
              {[
                { label: 'Mission', text: missionVision.mission },
                { label: 'Vision', text: missionVision.vision },
              ].map(b => (
                <motion.blockquote key={b.label} variants={fadeUp} className="bg-paper p-6">
                  <p className="eyebrow"><span className="rule" aria-hidden />{b.label}</p>
                  <p className="mt-3 font-serif text-[1.0625rem] leading-relaxed text-ink">{b.text}</p>
                </motion.blockquote>
              ))}
            </motion.div>
            <p className="mt-3 text-meta text-muted">
              From <SmartLink to={missionVision.source} className="link-underline">Mission, Vision and Objectives of IPC</SmartLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
