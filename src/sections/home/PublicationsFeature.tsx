import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SmartLink } from '../../components/ui/SmartLink';
import { EditorialButton } from '../../components/ui/EditorialButton';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { Tilt } from '../../components/effects/Interactive';
import { CountUp } from '../../components/effects/CountUp';
import { srcSets } from '../../config/hero';
import { ip2026, ipOnline, shop } from '../../config/site';
import { SplitWords } from '../../components/ui/SplitWords';
import { SectionBackdrop } from '../../components/effects/SectionBackdrop';

const figures = [
  { value: 10, suffix: 'th', label: 'Edition of India’s official book of drug standards' },
  { value: Number(ip2026.newMonographs), label: 'New monographs incorporated' },
  { value: Number(ip2026.totalMonographs.replace(/,/g, '')), label: 'Monographs in total' },
];

const links = [
  { label: 'Indian Pharmacopoeia 2026 — Amendment Lists', to: ip2026.amendments },
  { label: 'Introduction Pages, IP 2026', href: ip2026.introductionPdf, file: 'pdf' },
  { label: 'Notice on release of the 10th edition', href: ip2026.releaseNoticePdf, file: 'pdf' },
  { label: 'Proforma Invoice of IP Publication', to: ip2026.proforma },
  { label: 'Distribution Network for IP', to: '/mandates/indian-pharmacopoeia/distribution-network-for-ip' },
  { label: 'Earlier editions and addenda', to: '/mandates/indian-pharmacopoeia' },
];

const companions = [
  { img: '/images/official/nfi-2026-200.webp', w: 200, h: 180, title: 'National Formulary of India 2026', text: 'The 7th edition of the National Formulary of India, for the guidance of medical and pharmaceutical professionals.', to: '/mandates/nfi', accent: 'accent-saffron' },
  { img: '/images/official/iprs-114.webp', w: 114, h: 126, title: 'IP Reference Substances', text: 'Official reference standards issued by IPC, to be used in cases of arbitration.', to: '/mandates/national-formulary-of-india-nfi', accent: 'accent-violet' },
];

const volumes = srcSets({ stem: 'official/ip-2026-volumes', widths: [640, 1000], width: 900, height: 1094 });

export function PublicationsFeature() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);

  return (
    <section ref={ref} aria-labelledby="ip-title" className="has-backdrop field field-teal grain relative overflow-hidden py-20 md:py-28">
      <SectionBackdrop variant="dna" />
      {/* Generated scene of the volumes on a lab shelf, as a wide backdrop band behind the official photograph. */}
      <picture aria-hidden className="decor pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] lg:block">
        <source type="image/avif" srcSet="/images/generated/ip-volumes-1280.avif 1280w, /images/generated/ip-volumes-1920.avif 1920w" sizes="52vw" />
        <img src="/images/generated/ip-volumes-1280.webp" srcSet="/images/generated/ip-volumes-1280.webp 1280w, /images/generated/ip-volumes-1920.webp 1920w" sizes="52vw" width={1280} height={720} alt="" loading="lazy" decoding="async" className="size-full object-cover object-[70%_50%] opacity-70 [mask-image:linear-gradient(90deg,#000_45%,transparent)]" />
      </picture>
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="relative order-2 lg:order-1 lg:col-span-5">
          <motion.figure style={{ y }} className="relative mx-auto max-w-[22rem] lg:max-w-none">
            <Tilt max={6}>
              <motion.div
                initial={{ opacity: 0, clipPath: 'inset(10% 10% 10% 10% round 24px)' }}
                whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 18px)' }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[var(--radius-lg)] bg-white p-4 shadow-float"
              >
                <picture>
                  <source type="image/avif" srcSet={volumes.avif} sizes="(min-width: 1024px) 32vw, 22rem" />
                  <source type="image/webp" srcSet={volumes.webp} sizes="(min-width: 1024px) 32vw, 22rem" />
                  <img src={volumes.fallback} width={900} height={1094} loading="lazy" decoding="async" alt="Indian Pharmacopoeia 2026, four volumes" className="block h-auto w-full" />
                </picture>
              </motion.div>
            </Tilt>
          </motion.figure>
        </div>

        <motion.div variants={stagger(0.08)} {...inView} className="order-1 lg:order-2 lg:col-span-7">
          <motion.p variants={fadeUp} className="eyebrow"><span className="rule" aria-hidden />Flagship publication</motion.p>
          <h2 id="ip-title" className="mt-4 text-[clamp(2.5rem,1.6rem+3vw,4.25rem)] font-semibold leading-[1] tracking-[-0.04em]"><SplitWords text="Indian Pharmacopoeia 2026" /></h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-[1.125rem] leading-relaxed text-ink/85">
            {ip2026.legal} The tenth edition was released on {ip2026.released} at {ip2026.venue}.
          </motion.p>

          <motion.dl variants={fadeUp} className="mt-9 grid grid-cols-3 gap-3">
            {figures.map(f => (
              <div key={f.label} className="tex-card edge-glow rounded-[var(--radius-xl)] bg-white/80 p-4 sm:p-5">
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <CountUp value={f.value} suffix={f.suffix} className="tabular block font-display text-[1.875rem] font-semibold leading-none text-teal-700 sm:text-[2.75rem]" />
                  <span aria-hidden className="mt-2 block text-[0.8125rem] leading-snug text-ink/85">{f.label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
          <motion.p variants={fadeUp} className="mt-3 text-[0.875rem]">
            Figures as announced at the release of IP 2026. <SmartLink to={ip2026.releaseNews} className="link-underline">Read the announcement</SmartLink>
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <EditorialButton href={shop.orderIp} magnetic>Order Indian Pharmacopoeia</EditorialButton>
            <EditorialButton href={ipOnline} variant="secondary">Subscribe to IP Online</EditorialButton>
          </motion.div>

          <motion.ul variants={fadeUp} className="mt-10 grid gap-2 sm:grid-cols-2">
            {links.map(l => (
              <li key={l.label}>
                <SmartLink to={l.to} href={l.href} file={l.file} badge className="group flex min-h-12 items-start justify-between gap-3 chip-glass rounded-[var(--radius-lg)] px-4 py-3 text-[0.9375rem] font-semibold text-ink transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-white">
                  <span className="link-sweep">{l.label}</span>
                  {l.to
                    ? <ArrowRight aria-hidden size={16} className="mt-1 shrink-0 text-teal-700 transition-transform group-hover:translate-x-1" />
                    : !l.file && <ArrowUpRight aria-hidden size={16} className="mt-1 shrink-0 text-teal-700" />}
                </SmartLink>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <div className="container-page relative mt-16 grid gap-5 md:grid-cols-2">
        {companions.map(c => (
          <SmartLink key={c.title} to={c.to} className={`${c.accent} tex-card edge-glow tilt group relative flex items-center gap-5 overflow-hidden rounded-[var(--radius-xl)] bg-white p-5 shadow-hair sm:p-6`}>
            <span aria-hidden className="glare" />
            <span className="flex size-20 shrink-0 items-center justify-center rounded-[var(--radius-md)] p-2" style={{ background: 'var(--accent-wash)' }}>
              <img src={c.img} width={c.w} height={c.h} alt="" loading="lazy" className="max-h-full w-auto" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[1.1875rem] font-semibold text-ink"><span className="link-sweep">{c.title}</span></span>
              <span className="mt-1 block text-[0.9375rem] leading-snug text-ink/85">{c.text}</span>
            </span>
            <ArrowRight aria-hidden size={20} className="shrink-0 transition-transform group-hover:translate-x-1" style={{ color: 'var(--accent-ink)' }} />
          </SmartLink>
        ))}
      </div>
    </section>
  );
}
