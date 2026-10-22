import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Earth, FilePen, FileText, FlaskConical, MonitorSmartphone, ScrollText, type LucideIcon } from 'lucide-react';
import { SmartLink } from '../../components/ui/SmartLink';
import { SearchForm } from '../../components/layout/SearchForm';
import { inView, pop, stagger } from '../../lib/motion';
import { SplitWords } from '../../components/ui/SplitWords';
import { ipOnline, shop } from '../../config/site';
import type { Accent } from '../../config/hero';
import { SectionBackdrop } from '../../components/effects/SectionBackdrop';

interface Service {
  title: string;
  text: string;
  icon: LucideIcon;
  accent: Accent;
  to?: string;
  href?: string;
}

// Every destination is an existing IPC page or official service.
const services: Service[] = [
  { title: 'Purchase Indian Pharmacopoeia', text: 'Order IP and other IPC publications from the official online store.', icon: BookOpen, accent: 'teal', href: shop.orderIp },
  { title: 'IP Online', text: 'Subscribe to the online edition of the Indian Pharmacopoeia.', icon: MonitorSmartphone, accent: 'sky', href: ipOnline },
  { title: 'Reference Substances & Impurities', text: 'Lists, availability and supply order forms for IPRS and impurity standards.', icon: FlaskConical, accent: 'violet', to: '/mandates/national-formulary-of-india-nfi' },
  { title: 'Draft Monographs & Comments', text: 'Draft monographs and revision proposals open for stakeholder comments.', icon: FilePen, accent: 'saffron', to: '/mandates/indian-pharmacopoeia/monographs' },
  { title: 'Guidance Documents', text: 'Guidance documents published by IPC for stakeholders.', icon: FileText, accent: 'coral', to: '/mandates/indian-pharmacopoeia/guidance-documents-for-stakeholders' },
  { title: 'Pharmacopoeial Harmonization', text: 'Pharmacopoeial Discussion Group work plan, procedures and updates.', icon: Earth, accent: 'sky', to: '/pharmacopoeial-harmonization' },
  { title: 'Certification Services', text: 'ISO 13485 management system certification by IPC-MDD.', icon: BadgeCheck, accent: 'teal', to: '/icmed-certification' },
  { title: 'Orders, Circulars & Notices', text: 'Official orders, circulars and notices issued by the Commission.', icon: ScrollText, accent: 'coral', to: '/orders-circulars-notices' },
];

const popular = [
  { label: 'IP 2026', q: 'IP 2026' },
  { label: 'IPRS', q: 'IPRS' },
  { label: 'Careers', q: 'career' },
  { label: 'Pharmacovigilance', q: 'pharmacovigilance' },
];

/** Service directory: a search desk on the left, the most used services as a two-column index. */
export function QuickAccessGrid() {
  return (
    <section aria-labelledby="services-title" className="has-backdrop field field-sky grain relative overflow-hidden py-20 md:py-28">
      <SectionBackdrop variant="hex" />
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow"><span className="rule" aria-hidden />Services</p>
            <h2 id="services-title" className="mt-4 text-[clamp(2.25rem,1.5rem+2.6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]"><SplitWords text="Services & resources" /></h2>
            <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed">Direct access to the publications, reference standards and stakeholder services used most often.</p>
            <figure className="img-reveal capsule-mask mt-8 hidden aspect-[4/3] bg-white/40 shadow-float lg:block">
              <picture>
                <source type="image/avif" srcSet="/images/generated/iprs-vials-768.avif 768w, /images/generated/iprs-vials-1280.avif 1280w" sizes="30vw" />
                <img src="/images/generated/iprs-vials-768.webp" srcSet="/images/generated/iprs-vials-768.webp 768w, /images/generated/iprs-vials-1280.webp 1280w" sizes="30vw" width={768} height={432} alt="Reference-standard vials in a laboratory rack (illustrative image)" loading="lazy" decoding="async" className="size-full object-cover object-[70%_50%]" />
              </picture>
            </figure>
            <div className="mt-6 rounded-[var(--radius-xl)] bg-white p-5 shadow-lift">
              <p className="font-semibold text-ink">Find a page, notice or publication</p>
              <SearchForm className="mt-3" />
              <p className="mt-4 text-[0.875rem] text-slate">Popular searches</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {popular.map(p => (
                  <li key={p.q}>
                    <SmartLink to={`/search?q=${encodeURIComponent(p.q)}`} className="chip-glass inline-flex min-h-9 items-center rounded-full px-3.5 text-[0.875rem] font-medium text-ink transition-colors hover:bg-teal-50 hover:text-teal-800">
                      {p.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <motion.ul variants={stagger(0.06)} {...inView} className="grid content-start gap-3 sm:grid-cols-2 lg:col-span-8">
          {services.map(s => {
            const external = !!s.href;
            const Icon = s.icon;
            return (
              <motion.li key={s.title} variants={pop} className={`accent-${s.accent}`}>
                <SmartLink to={s.to} href={s.href} className="tex-card edge-glow tilt group relative flex h-full gap-4 overflow-hidden rounded-[var(--radius-xl)] bg-white/80 p-5 shadow-hair hover:bg-white sm:p-6">
                  <span aria-hidden className="glare" />
                  <span
                    aria-hidden
                    className="flex h-14 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 ease-out group-hover:-rotate-12 group-hover:scale-110"
                    style={{ background: 'linear-gradient(180deg, var(--accent) 0 50%, var(--accent-ink) 50% 100%)' }}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-[1.25rem] font-semibold leading-snug text-ink"><span className="link-sweep">{s.title}</span></span>
                      {external
                        ? <ArrowUpRight aria-hidden size={19} className="mt-1 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                        : <ArrowRight aria-hidden size={19} className="mt-1 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" />}
                    </span>
                    <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink/80">{s.text}</span>
                  </span>
                </SmartLink>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
