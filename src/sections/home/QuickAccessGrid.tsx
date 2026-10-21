import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, Earth, FilePen, FileText, FlaskConical, MonitorSmartphone, ScrollText, type LucideIcon } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartLink } from '../../components/ui/SmartLink';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { IconBadge } from '../../components/ui/IconBadge';
import { Spotlight } from '../../components/effects/Interactive';
import { ContourLines } from '../../components/effects/AnimatedBackdrop';
import { ipOnline, shop } from '../../config/site';

interface Service {
  title: string;
  text: string;
  icon: LucideIcon;
  to?: string;
  href?: string;
}

// Every destination is an existing IPC page or official service.
const services: Service[] = [
  { title: 'Purchase Indian Pharmacopoeia', text: 'Order IP and other IPC publications from the official online store.', icon: BookOpen, href: shop.orderIp },
  { title: 'IP Online', text: 'Subscribe to the online edition of the Indian Pharmacopoeia.', icon: MonitorSmartphone, href: ipOnline },
  { title: 'Reference Substances & Impurities', text: 'Lists, availability and supply order forms for IPRS and impurity standards.', icon: FlaskConical, to: '/mandates/national-formulary-of-india-nfi' },
  { title: 'Draft Monographs & Comments', text: 'Draft monographs and revision proposals open for stakeholder comments.', icon: FilePen, to: '/mandates/indian-pharmacopoeia/monographs' },
  { title: 'Guidance Documents', text: 'Guidance documents published by IPC for stakeholders.', icon: FileText, to: '/mandates/indian-pharmacopoeia/guidance-documents-for-stakeholders' },
  { title: 'Pharmacopoeial Harmonization', text: 'Pharmacopoeial Discussion Group work plan, procedures and updates.', icon: Earth, to: '/pharmacopoeial-harmonization' },
  { title: 'Certification Services', text: 'ISO 13485 management system certification by IPC-MDD.', icon: BadgeCheck, to: '/icmed-certification' },
  { title: 'Orders, Circulars & Notices', text: 'Official orders, circulars and notices issued by the Commission.', icon: ScrollText, to: '/orders-circulars-notices' },
];

export function QuickAccessGrid() {
  return (
    <section aria-labelledby="services-title" className="relative overflow-hidden bg-paper py-16 md:py-24">
      <ContourLines />
      <div className="container-page relative">
        <SectionHeading
          id="services-title"
          index="01"
          eyebrow="Services"
          title="Essential services & resources"
          intro="Direct access to the publications, reference standards and stakeholder services used most often."
        />
        <motion.ul variants={stagger(0.05)} {...inView} className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4 md:mt-14">
          {services.map((s, i) => {
            const external = !!s.href;
            return (
              <motion.li key={s.title} variants={fadeUp} className="bg-white">
                <Spotlight className="h-full">
                <SmartLink
                  to={s.to}
                  href={s.href}
                  className="group relative flex h-full flex-col p-5 sm:p-6 lg:min-h-[15rem] xl:p-7"
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-teal-600 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    <span className="flex items-start justify-between">
                    <IconBadge icon={s.icon} tone={i % 4 === 1 ? 'saffron' : i % 4 === 3 ? 'green' : 'teal'} />
                    {/* Decorative index as generated content, so it is not read or contrast-checked as text. */}
                    <span aria-hidden data-index={String(i + 1).padStart(2, '0')} className="tabular text-[0.75rem] font-semibold text-line-strong transition-colors before:content-[attr(data-index)] group-hover:text-teal-600" />
                  </span>
                  <span className="mt-4 block text-[1.0625rem] sm:mt-6 font-semibold leading-snug text-ink">{s.title}</span>
                  <span className="mt-2 block flex-1 text-[0.9375rem] leading-relaxed text-muted">{s.text}</span>
                  <span className="mt-4 flex items-center gap-2 text-[0.8125rem] sm:mt-6 font-semibold text-teal-700">
                    {external ? 'Open service' : 'View'}
                    {external
                      ? <ArrowUpRight aria-hidden size={15} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      : <ArrowRight aria-hidden size={15} className="transition-transform duration-200 group-hover:translate-x-1" />}
                  </span>
                </SmartLink>
                </Spotlight>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
