import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SmartLink } from '../../components/ui/SmartLink';
import { EditorialButton } from '../../components/ui/EditorialButton';
import { ConcentricArcs } from '../../components/textures/ConcentricArcs';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { DotMatrix } from '../../components/effects/AnimatedBackdrop';
import { Tilt } from '../../components/effects/Interactive';
import { CountUp } from '../../components/effects/CountUp';
import { Chromatogram, Molecule } from '../../components/illustrations';
import { ip2026, ipOnline, shop } from '../../config/site';

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

export function PublicationsFeature() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -36]);

  return (
    <section ref={ref} aria-labelledby="ip-title" className="on-dark relative overflow-hidden bg-navy-900 py-16 text-white md:py-24">
      <div aria-hidden className="decor texture-grid-dark absolute inset-0 opacity-70" />
      <DotMatrix />
      <div className="decor pointer-events-none absolute inset-x-0 bottom-0 opacity-40">
        <Chromatogram light className="h-40 w-full md:h-56" />
      </div>
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="relative order-2 lg:order-1 lg:col-span-5">
          <ConcentricArcs className="decor absolute left-1/2 top-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 text-white/[0.07]" />
          <motion.figure style={{ y }} className="relative mx-auto max-w-[22rem] lg:max-w-none">
            <div className="decor absolute -left-8 -top-10 z-10 hidden w-24 rounded-full bg-white p-2 shadow-lift lg:block"><Molecule className="w-full" /></div>
            <Tilt max={6}>
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8%)' }}
              whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="border border-white/15 bg-white p-3 sm:p-4"
            >
              <img
                src="/images/official/ip-2026-volumes-900.webp"
                srcSet="/images/official/ip-2026-volumes-480.webp 480w, /images/official/ip-2026-volumes-900.webp 900w"
                sizes="(min-width: 1024px) 30vw, 22rem"
                width={900}
                height={1094}
                loading="lazy"
                decoding="async"
                alt="Indian Pharmacopoeia 2026, four volumes"
                className="block h-auto w-full"
              />
            </motion.div>
            </Tilt>
          </motion.figure>
        </div>

        <motion.div variants={stagger(0.08)} {...inView} className="order-1 lg:order-2 lg:col-span-7">
          <motion.p variants={fadeUp} className="eyebrow"><span className="index">03</span><span className="rule" aria-hidden />Flagship publication</motion.p>
          <motion.h2 id="ip-title" variants={fadeUp} className="mt-4 text-h2 !text-white">Indian Pharmacopoeia 2026</motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-white/80">
            {ip2026.legal} The tenth edition was released on {ip2026.released} at {ip2026.venue}.
          </motion.p>

          <motion.dl variants={fadeUp} className="mt-9 grid grid-cols-3 border-y border-white/15">
            {figures.map((f, i) => (
              <div key={f.label} className={`py-5 ${i ? 'border-l border-white/15 pl-4 sm:pl-6' : 'pr-4'}`}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <CountUp value={f.value} suffix={f.suffix} className="tabular block font-serif text-[2rem] font-semibold leading-none text-white sm:text-[2.75rem]" />
                  <span aria-hidden className="mt-2 block text-[0.8125rem] leading-snug text-white/65">{f.label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
          <motion.p variants={fadeUp} className="mt-3 text-[0.75rem] text-white/50">
            Figures as announced at the release of IP 2026. <SmartLink to={ip2026.releaseNews} className="underline underline-offset-2 hover:text-white">Read the announcement</SmartLink>
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <EditorialButton href={shop.orderIp} variant="light">Order Indian Pharmacopoeia</EditorialButton>
            <EditorialButton href={ipOnline} variant="ghost">Subscribe to IP Online</EditorialButton>
          </motion.div>

          <motion.ul variants={fadeUp} className="mt-10 grid gap-x-8 sm:grid-cols-2">
            {links.map(l => (
              <li key={l.label} className="border-t border-white/12">
                <SmartLink to={l.to} href={l.href} file={l.file} badge className="group flex items-start justify-between gap-3 py-3 text-[0.9375rem] text-white/85 hover:text-white">
                  <span>{l.label}</span>
                  {l.to
                    ? <ArrowRight aria-hidden size={16} className="mt-1 shrink-0 opacity-60 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
                    : !l.file && <ArrowUpRight aria-hidden size={16} className="mt-1 shrink-0 opacity-60 group-hover:opacity-100" />}
                </SmartLink>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Companion publications */}
      <div className="container-page relative mt-16">
        <div className="grid gap-px overflow-hidden rounded-sm border border-white/12 bg-white/12 md:grid-cols-2">
          {[
            { img: '/images/official/nfi-2026-200.webp', w: 200, h: 180, title: 'National Formulary of India 2026', text: 'The 7th edition of the National Formulary of India, for the guidance of medical and pharmaceutical professionals.', to: '/mandates/nfi' },
            { img: '/images/official/iprs-114.webp', w: 114, h: 126, title: 'IP Reference Substances', text: 'Official reference standards issued by IPC, to be used in cases of arbitration.', to: '/mandates/national-formulary-of-india-nfi' },
          ].map(c => (
            <SmartLink key={c.title} to={c.to} className="group flex items-center gap-5 bg-navy-900 p-5 transition-colors hover:bg-navy-800 sm:p-6">
              <span className="flex size-20 shrink-0 items-center justify-center rounded-xs bg-white p-2">
                <img src={c.img} width={c.w} height={c.h} alt="" loading="lazy" className="max-h-full w-auto" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-white">{c.title}</span>
                <span className="mt-1 block text-[0.875rem] leading-snug text-white/70">{c.text}</span>
              </span>
              <ArrowRight aria-hidden size={18} className="shrink-0 text-white/60 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
