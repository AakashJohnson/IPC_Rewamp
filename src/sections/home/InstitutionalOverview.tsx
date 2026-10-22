import { useRef, type CSSProperties } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Building2, Landmark, ShieldCheck, UserRound } from 'lucide-react';
import { EditorialButton } from '../../components/ui/EditorialButton';
import { SmartLink } from '../../components/ui/SmartLink';
import { fadeUp, inView, pop, stagger } from '../../lib/motion';
import { about, missionVision } from '../../config/site';
import { SplitWords } from '../../components/ui/SplitWords';
import { SectionBackdrop } from '../../components/effects/SectionBackdrop';

// Facts from /about-us/about-ipc (Formation of IPC).
const facts = [
  { term: 'Status', detail: 'Autonomous Body, fully financed by the Central Government', icon: ShieldCheck },
  { term: 'Administrative control', detail: 'Ministry of Health and Family Welfare', icon: Landmark },
  { term: 'Chairperson', detail: 'Secretary, Ministry of Health and Family Welfare', icon: Building2 },
  { term: 'Chief Scientific & Executive Officer', detail: 'Secretary-cum-Scientific Director', icon: UserRound },
];

/** The Commission at a glance: a statement, the headquarters photograph, the governing facts, mission and vision. */
export function InstitutionalOverview() {
  const photo = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: photo, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <section aria-labelledby="about-title" className="has-backdrop surface-aurora relative py-20 md:py-28">
      <SectionBackdrop variant="molecules" />
      <span aria-hidden className="aurora-blob -right-40 top-10 size-[34rem] bg-[#cfe6ff]" />
      <span aria-hidden className="aurora-blob -left-40 bottom-0 size-[30rem] bg-[#fde3c8]" style={{ '--ax': '6vw', '--ay': '-8vh', '--t': '28s' } as CSSProperties} />
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <motion.div variants={stagger(0.08)} {...inView} className="lg:col-span-6">
            <motion.p variants={fadeUp} className="eyebrow accent-sky"><span className="rule" aria-hidden />About the Commission</motion.p>
            <h2 id="about-title" className="mt-4 text-[clamp(2.25rem,1.5rem+2.6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]"><SplitWords text="An autonomous institution" /></h2>
            <motion.p variants={fadeUp} className="mt-6 text-[1.25rem] leading-relaxed text-ink">{about.lead}</motion.p>
            <motion.p variants={fadeUp} className="mt-5 text-body leading-relaxed text-ink/85">{about.standards} {about.authority}</motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <EditorialButton to="/about-us" magnetic>About IPC</EditorialButton>
              <SmartLink to="/about-us/about-ipc" className="group inline-flex min-h-11 items-center font-semibold text-navy-900"><span className="link-sweep">Formation of IPC</span></SmartLink>
            </motion.div>
          </motion.div>

          <div ref={photo} className="lg:col-span-6">
            <figure>
              <div className="img-reveal accent-sky relative aspect-[2/1] overflow-hidden rounded-full bg-paper-2 shadow-float">
                <motion.img
                  src="/images/official/ipc-headquarters-640.webp"
                  width={640}
                  height={307}
                  loading="lazy"
                  decoding="async"
                  alt="The Indian Pharmacopoeia Commission building at Sector-23, Raj Nagar, Ghaziabad"
                  style={{ y: imgY }}
                  className="absolute inset-[-6%_0] h-[112%] w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 inline-flex rounded-full bg-white px-4 py-1.5 text-[0.875rem] font-medium text-ink shadow-hair">Official photograph: IPC headquarters, Sector-23, Raj Nagar, Ghaziabad</figcaption>
            </figure>
          </div>
        </div>

        <motion.dl variants={stagger(0.07)} {...inView} className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(f => {
            const Icon = f.icon;
            return (
              <motion.div key={f.term} variants={pop} className="tex-card edge-glow tilt relative overflow-hidden rounded-[var(--radius-xl)] bg-white p-6 shadow-hair">
                <span aria-hidden className="glare" />
                <dt className="flex items-center gap-2.5 text-[0.9375rem] font-semibold text-sky-700">
                  <Icon aria-hidden size={18} strokeWidth={1.8} />
                  {f.term}
                </dt>
                <dd className="mt-2 text-[1rem] leading-snug text-ink">{f.detail}</dd>
              </motion.div>
            );
          })}
        </motion.dl>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[
            { label: 'Mission', text: missionVision.mission, accent: 'accent-teal' },
            { label: 'Vision', text: missionVision.vision, accent: 'accent-saffron' },
          ].map(b => (
            <motion.figure key={b.label} variants={fadeUp} {...inView} className={`field ${b.accent.replace('accent-', 'field-')} grain spotlight overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-8`}>
              <figcaption className="font-display text-[1.5rem] font-semibold" style={{ color: 'var(--accent-ink)' }}>{b.label}</figcaption>
              <blockquote className="mt-3 text-[1.125rem] leading-relaxed"><p>{b.text}</p></blockquote>
            </motion.figure>
          ))}
        </div>
        <p className="mt-4 text-[0.875rem] text-muted">
          From <SmartLink to={missionVision.source} className="link-underline">Mission, Vision and Objectives of IPC</SmartLink>
        </p>
      </div>
    </section>
  );
}
