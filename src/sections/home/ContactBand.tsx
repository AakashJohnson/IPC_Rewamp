import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { SmartLink } from '../../components/ui/SmartLink';
import { EditorialButton } from '../../components/ui/EditorialButton';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { contact } from '../../config/site';
import { SplitWords } from '../../components/ui/SplitWords';
import { SectionBackdrop } from '../../components/effects/SectionBackdrop';

const LabScene = lazy(() => import('../../components/three/LabScene').then(m => ({ default: m.LabScene })));

// Public resources available on www.ipc.gov.in.
const resources = [
  { label: 'Right to Information (RTI)', to: '/rti' },
  { label: 'Citizen Charter', to: '/about-us/about-ipc/citizen-charter' },
  { label: 'Feedback Form', to: '/feedback-form' },
  { label: 'Frequently Asked Questions', to: '/faq' },
  { label: 'Careers', to: '/careers' },
  { label: 'Tenders', to: '/tenders' },
  { label: 'Help', to: '/help' },
  { label: 'Site Map', to: '/site-map' },
];

/** Closing section before the footer: how to reach the Commission and the public-service pages. */
export function ContactBand() {
  const [live, setLive] = useState(false);
  useEffect(() => { setLive(window.matchMedia('(min-width: 64rem)').matches); }, []);
  return (
    <section aria-labelledby="contact-title" className="has-backdrop field field-coral grain relative overflow-hidden py-20 md:py-28">
      <SectionBackdrop variant="hex" />
      {live && (
        <Suspense fallback={null}>
          <LabScene accent="#f26a55" variant="capsules" count={7} className="absolute inset-0 opacity-90" />
        </Suspense>
      )}
      <div className="container-page relative grid gap-10 lg:grid-cols-12 lg:gap-12">
        <motion.div variants={stagger(0.08)} {...inView} className="lg:col-span-7">
          <motion.p variants={fadeUp} className="eyebrow"><span className="rule" aria-hidden />Contact</motion.p>
          <h2 id="contact-title" className="mt-4 text-[clamp(2.25rem,1.5rem+2.6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]"><SplitWords text="Reach the Commission" /></h2>
          {/* A coupon: notches cut into its edges and a perforation between address and contact lines. */}
          <motion.div variants={fadeUp} className="coupon relative mt-8 grid gap-6 rounded-[var(--radius-xl)] bg-white p-6 shadow-float sm:grid-cols-2 sm:gap-10 sm:p-8">
            <address className="not-italic">
              <p className="flex items-start gap-2 font-semibold text-ink"><MapPin aria-hidden size={18} className="mt-1 shrink-0 text-coral-700" />{contact.office}</p>
              <p className="mt-2 leading-relaxed text-ink/85">{contact.address.map(l => <span key={l} className="block">{l}</span>)}</p>
              <SmartLink to={contact.routeMap} className="group mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-coral-700">
                <span className="link-sweep">Route map of IPC</span> <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-1" />
              </SmartLink>
            </address>
            <div className="space-y-5">
              <div>
                <p className="flex items-center gap-2 font-semibold text-ink"><Phone aria-hidden size={18} className="text-coral-700" />Telephone</p>
                <ul className="mt-2 space-y-1">
                  {contact.phones.map(p => (
                    <li key={p}><a href={`tel:${p.replace(/[^0-9+]/g, '')}`} className="tabular text-ink/85 hover:text-ink">{p}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-2 font-semibold text-ink"><Mail aria-hidden size={18} className="text-coral-700" />Email</p>
                <ul className="mt-2 space-y-2">
                  {contact.emails.map(e => (
                    <li key={e.email} className="text-[0.9375rem] leading-snug">
                      <span className="block text-ink/75">{e.label}</span>
                      <a href={`mailto:${e.email}`} className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">{e.email}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6">
            <EditorialButton to={contact.source} magnetic>All contact details</EditorialButton>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} {...inView} className="lg:col-span-5 lg:pt-24">
          <div className="relative h-full rounded-[var(--radius-xl)] bg-white/90 p-6 shadow-float sm:p-8">
            <h3 className="text-[1.5rem] font-semibold">Public resources</h3>
            <p className="mt-2">Information and services for citizens, applicants and stakeholders.</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {resources.map(r => (
                <li key={r.to}>
                  <SmartLink to={r.to} className="group flex min-h-12 items-center justify-between gap-3 chip-glass rounded-full px-4 py-2 font-semibold text-ink transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lift">
                    <span>{r.label}</span>
                    <ArrowRight aria-hidden size={16} className="shrink-0 text-coral-700 transition-transform group-hover:translate-x-1" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
