import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ComponentType } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { SmartLink } from '../../components/ui/SmartLink';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { BookStack, FormPen } from '../../components/illustrations';
import { srcSets, type Accent, type ResponsiveImage } from '../../config/hero';
import { ip2026 } from '../../config/site';
import { SectionBackdrop } from '../../components/effects/SectionBackdrop';

const LabScene = lazy(() => import('../../components/three/LabScene').then(m => ({ default: m.LabScene })));

// Stages follow IPC's official "Monograph Development Process" on /mandates/indian-pharmacopoeia/ip-review-process.
// Pictures: stages 1, 2 and 4 are generated illustrations (no text or logos); stage 6 is the official photograph
// of the IP 2026 release; stages 3 and 5 are set in type over a live, code-rendered 3D scene.

type Media =
  | { kind: 'photo'; img: ResponsiveImage; alt: string; caption?: string }
  | { kind: 'type'; big: string; label: string; detail: string; art: ComponentType<{ className?: string }>; variant: 'molecules' | 'capsules' };

interface Stage {
  title: string;
  points: string[];
  accent: Accent;
  hex: string;
  media: Media;
  loop?: string;
}

const gen = (stem: string): ResponsiveImage => ({ stem: `generated/${stem}`, widths: [640, 1080, 1440], width: 1440, height: 1080 });

const stages: Stage[] = [
  {
    title: 'Public health need',
    accent: 'coral', hex: '#f26a55',
    points: ['Identification of need for new monograph by IPC or stakeholder.', 'Evaluation of monograph development as per inclusion criteria.'],
    media: { kind: 'photo', img: gen('story-need'), alt: 'A pharmacist takes a box of medicine from pharmacy shelves (illustrative image)' },
  },
  {
    title: 'Monograph development',
    accent: 'sky', hex: '#3aa5ea',
    points: ['Drafting of monograph based on approved test methods and quality specifications.'],
    media: { kind: 'photo', img: gen('story-development'), alt: 'A scientist pipettes samples beside an analytical instrument (illustrative image)' },
  },
  {
    title: 'Public comments',
    accent: 'saffron', hex: '#f39a2b',
    points: ['Publishing draft monographs on IPC website for public and stakeholder’s comments.'],
    media: { kind: 'type', big: '45 days', label: 'for stakeholders to comment on a draft, from the date it is uploaded', detail: 'Comments go to lab.ipc@gov.in', art: FormPen, variant: 'capsules' },
  },
  {
    title: 'Monograph review',
    accent: 'violet', hex: '#7b5cf0',
    points: ['Evaluation of comments and review of monographs in Expert Working Group for approval, or recommendation for further revision and comments.'],
    loop: 'Where further revision is required, the monograph returns to stakeholders and development.',
    media: { kind: 'photo', img: gen('story-review'), alt: 'An expert group reviews documents around a conference table (illustrative image)' },
  },
  {
    title: 'Approval and publication',
    accent: 'teal', hex: '#14b3a5',
    points: ['Approval of all the monographs by the Scientific Body of IPC.', 'Publication of approved monographs in the IP.'],
    media: { kind: 'type', big: 'Approved', label: 'by the Scientific Body of IPC, then published in the Indian Pharmacopoeia', detail: 'Every monograph, before publication', art: BookStack, variant: 'molecules' },
  },
  {
    title: 'Release of the IP',
    accent: 'sky', hex: '#3aa5ea',
    points: ['Release of the Indian Pharmacopoeia.', `The latest edition, IP 2026, was released on ${ip2026.released} at ${ip2026.venue}.`],
    media: {
      kind: 'photo',
      img: { stem: 'official/ip-2026-release-photo', widths: [640, 1100], width: 5260, height: 2170 },
      alt: 'Union Health Minister Shri J. P. Nadda and officials hold copies of the Indian Pharmacopoeia 2026 at its release, Dr. Ambedkar International Centre, New Delhi',
      caption: `Official photograph: release of IP 2026, ${ip2026.released}`,
    },
  },
];

const stakeholders = ['Manufacturers', 'Regulatory authorities', 'Drug testing laboratories', 'Healthcare professionals', 'Researchers and academicians'];

function useStacking() {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 64rem)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64rem)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide && !reduce;
}

function StageMedia({ stage, live }: { stage: Stage; live: boolean }) {
  const [failed, setFailed] = useState(false);
  const m = stage.media;
  if (m.kind === 'photo' && !failed) {
    const s = srcSets(m.img);
    return (
      <figure className="img-reveal relative h-full min-h-56 overflow-hidden rounded-[var(--radius-lg)] bg-white/40">
        <picture>
          <source type="image/avif" srcSet={s.avif} sizes="(min-width: 1024px) 40vw, 100vw" />
          <source type="image/webp" srcSet={s.webp} sizes="(min-width: 1024px) 40vw, 100vw" />
          <img src={s.fallback} width={m.img.width} height={m.img.height} alt={m.alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
        </picture>
        {m.caption && <figcaption className="frost absolute bottom-3 left-3 right-3 rounded-full px-4 py-2 text-[0.8125rem] font-semibold text-ink sm:right-auto">{m.caption}</figcaption>}
      </figure>
    );
  }
  if (m.kind !== 'type') return <div className="h-full min-h-56 rounded-[var(--radius-lg)] bg-white/40" />;
  const Art = m.art;
  return (
    <div className="relative flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-white/55 p-6 sm:p-8">
      {live && (
        <Suspense fallback={null}>
          <LabScene accent={stage.hex} variant={m.variant} count={6} className="absolute inset-0" />
        </Suspense>
      )}
      <Art className="absolute right-5 top-5 hidden w-36 opacity-90 sm:block lg:w-44" />
      <p className="relative font-display text-[clamp(3rem,2rem+3.5vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]" style={{ color: 'var(--accent-ink)' }}>{m.big}</p>
      <p className="relative mt-3 max-w-sm text-[1.125rem] font-medium leading-snug">{m.label}</p>
      <p className="relative mt-4 inline-flex w-fit rounded-full bg-white px-4 py-2 text-[0.9375rem] font-semibold shadow-hair">{m.detail}</p>
    </div>
  );
}

function Card({ stage, index, total, progress, stacking, live }: {
  stage: Stage; index: number; total: number; progress: MotionValue<number>; stacking: boolean; live: boolean;
}) {
  // Earlier cards shrink a little as later ones arrive, so the deck reads as a physical stack.
  const target = 1 - (total - 1 - index) * 0.035;
  const scale = useTransform(progress, [index / total, 1], [1, target]);
  const tilt = useTransform(progress, [index / total, (index + 1) / total], [0, index === total - 1 ? 0 : 3]);
  return (
    <li className="deck-li pb-6 lg:pb-[12vh] last:pb-0" style={{ '--i': index } as CSSProperties}>
      <motion.article
        aria-labelledby={`stage-${index}`}
        style={stacking ? { scale, rotateX: tilt, transformPerspective: 1200 } : undefined}
        className={`deck-card field field-${stage.accent} grain origin-top overflow-hidden rounded-[var(--radius-xl)] shadow-[0_-12px_40px_-24px_rgb(11_34_64/0.45)]`}
      >
        <header className="flex h-[var(--peek)] items-center gap-4 px-5 sm:px-7">
          <span aria-hidden className="tabular flex size-10 shrink-0 items-center justify-center rounded-full bg-white font-display text-[1.125rem] font-bold" style={{ color: 'var(--accent-ink)' }}>
            {index + 1}
          </span>
          <h3 id={`stage-${index}`} className="min-w-0 flex-1 truncate font-display text-[1.25rem] font-semibold sm:text-[1.5rem]">{stage.title}</h3>
          <span className="hidden shrink-0 rounded-full bg-white/70 px-3 py-1 text-[0.8125rem] font-semibold sm:inline">Stage {index + 1} of {total}</span>
        </header>
        <div className="grid gap-5 px-5 pb-5 sm:px-7 sm:pb-7 lg:h-[var(--deck-body)] lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-5">
            <ul className="space-y-3 text-[1.0625rem] leading-relaxed">
              {stage.points.map(p => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden className="mt-[0.55rem] h-2.5 w-4 shrink-0 rounded-full" style={{ background: 'var(--accent)' }} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {stage.loop && (
              <p className="mt-5 flex items-start gap-2.5 rounded-[var(--radius-md)] bg-white/70 px-4 py-3 text-[0.9375rem]">
                <RotateCcw aria-hidden size={17} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-ink)' }} />
                {stage.loop}
              </p>
            )}
          </div>
          <div className="h-56 sm:h-72 lg:col-span-7 lg:h-full">
            <StageMedia stage={stage} live={live} />
          </div>
        </div>
      </motion.article>
    </li>
  );
}

/** "How standards are made": a deck of colour cards that stack on wide screens, with a stage rail beside it. */
export function StandardsStory() {
  const stacking = useStacking();
  const deck = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: deck, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', v => setActive(Math.min(stages.length - 1, Math.floor(v * stages.length))));
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [live, setLive] = useState(false);
  useEffect(() => { setLive(window.matchMedia('(min-width: 48rem)').matches); }, []);

  return (
    <section
      aria-labelledby="process-title"
      className="has-backdrop surface-aurora relative py-20 md:py-28"
      // Peek height of each stacked card and the body height that keeps a whole card on screen (see .deck-card).
      style={{ '--peek': '3.75rem', '--deck-body': 'min(24rem, calc(100svh - 6rem - 5 * min(3.75rem, 5.5svh) - 3.75rem - 2rem))' } as CSSProperties}
    >
      <SectionBackdrop variant="molecules" />
      <span aria-hidden className="aurora-blob left-[-10%] top-[10%] size-[40rem] bg-[#ffd3c6]" style={{ '--ax': '10vw', '--ay': '8vh' } as CSSProperties} />
      <span aria-hidden className="aurora-blob right-[-10%] top-[40%] size-[36rem] bg-[#cfe3ff]" style={{ '--ax': '-8vw', '--ay': '-6vh', '--t': '32s' } as CSSProperties} />
      <span aria-hidden className="aurora-blob bottom-[0%] left-[30%] size-[34rem] bg-[#d9f5ef]" style={{ '--t': '22s' } as CSSProperties} />

      <div className="container-page">
        <SectionHeading
          id="process-title"
          eyebrow="Monograph development process"
          title="How a standard is made"
          intro="Public review and comment are given special attention in developing Indian Pharmacopoeia standards. The principle of “openness, justice and fairness” is kept in mind during compiling and editing its contents."
          action={{ label: 'IP review process', to: '/mandates/indian-pharmacopoeia/ip-review-process' }}
        />
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <p className="mr-1 text-[0.9375rem] font-semibold text-ink">Stakeholders taking part</p>
          {stakeholders.map(s => <span key={s} className="chip-glass rounded-full px-3.5 py-1.5 text-[0.875rem] text-ink">{s}</span>)}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Stage rail */}
          <nav aria-label="Stages" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <ol className="relative space-y-1 pl-6">
                <span aria-hidden className="absolute bottom-2 left-[0.55rem] top-2 w-[3px] rounded-full bg-navy-900/10" />
                <motion.span aria-hidden className="absolute left-[0.55rem] top-2 w-[3px] rounded-full bg-navy-900" style={{ height: fill }} />
                {stages.map((s, i) => (
                  <li key={s.title} className={`field-${s.accent}`} style={{ background: 'none' }}>
                    <a
                      href={`#stage-${i}`}
                      onClick={e => { e.preventDefault(); document.getElementById(`stage-${i}`)?.closest('li')?.scrollIntoView({ behavior: stacking ? 'smooth' : 'auto', block: 'start' }); }}
                      aria-current={i === active ? 'step' : undefined}
                      className={`relative flex min-h-11 items-center gap-3 rounded-full px-3 text-[0.9375rem] font-semibold transition-colors duration-300 ${i === active ? 'bg-white text-ink shadow-hair' : 'text-slate hover:text-ink'}`}
                    >
                      <span aria-hidden className={`absolute -left-[1.1rem] size-3 rounded-full ring-4 ring-pearl transition-transform duration-300 ${i <= active ? 'scale-125' : ''}`} style={{ background: i <= active ? 'var(--accent)' : '#c3cfdc' }} />
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <ol ref={deck} className="deck lg:col-span-9">
            {stages.map((s, i) => <Card key={s.title} stage={s} index={i} total={stages.length} progress={scrollYProgress} stacking={stacking} live={live} />)}
          </ol>
        </div>

        <p className="mt-10 text-[1rem]">
          Want to take part?{' '}
          <SmartLink to="/mandates/indian-pharmacopoeia/monographs/monographs-under-preparation" className="group inline-flex items-center gap-1.5 font-semibold text-teal-700">
            <span className="link-sweep">Review draft monographs open for comment</span>
            <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-1" />
          </SmartLink>
        </p>
      </div>
    </section>
  );
}
