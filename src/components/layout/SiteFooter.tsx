import { Link } from 'react-router';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { navigation } from '../../lib/nav';
import { SmartLink } from '../ui/SmartLink';
import { contact, institution, ipOnline, nfiOnline, social } from '../../config/site';
import home from '../../content/home.json';
import { formatDate } from '../../lib/format';
import { GlowOrbs, MoleculeField } from '../effects/AnimatedBackdrop';

const columns = [
  {
    heading: 'About IPC',
    links: [
      { label: 'About Us', to: '/about-us' },
      { label: 'Mission, Vision and Objectives', to: '/about-us/about-ipc/objectives-of-ipc' },
      { label: 'Organisational Chart', to: '/about-us/organisational-chart' },
      { label: 'Annual Reports', to: '/about-us/about-ipc/annual-reports' },
      { label: 'Citizen Charter', to: '/about-us/about-ipc/citizen-charter' },
      { label: 'Photo Gallery', to: '/about-us/media-new/photo-gallery' },
    ],
  },
  {
    heading: 'Publications & Services',
    links: [
      { label: 'Indian Pharmacopoeia', to: '/mandates/indian-pharmacopoeia' },
      { label: 'National Formulary of India', to: '/mandates/nfi' },
      { label: 'IP Reference Substances', to: '/mandates/national-formulary-of-india-nfi' },
      { label: 'IP Online', href: ipOnline },
      { label: 'NFI Online', href: nfiOnline },
      { label: 'Online Services', to: '/e-services' },
    ],
  },
  {
    heading: 'Notices',
    links: [
      { label: 'News & Highlights', to: '/news-highlights' },
      { label: 'Orders & Circulars', to: '/orders-circulars-notices' },
      { label: 'Tenders', to: '/tenders' },
      { label: 'Careers', to: '/careers' },
      { label: 'RTI', to: '/rti' },
    ],
  },
];

const POLICY = new Set(['Disclaimer', 'Copyright Policy', 'Terms & Conditions', 'Hyperlinking Policy', 'Privacy Policy']);

export function SiteFooter() {
  const help = navigation.footer.filter(l => !POLICY.has(l.label));
  const policies = navigation.footer.filter(l => POLICY.has(l.label));
  const linkCls = 'text-[0.9375rem] text-white/75 transition-colors hover:text-white';

  return (
    <footer role="contentinfo" className="no-print relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden className="decor texture-grid-dark fade-mask-b absolute inset-0 opacity-60" />
      <GlowOrbs dark className="opacity-60" />
      <MoleculeField tone="text-white/[0.05]" accent={false} mask="edges" />
      <div className="container-page relative">
        <div className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-4">
              <span className="flex size-[72px] shrink-0 items-center justify-center rounded-sm bg-white p-2">
                <img src="/images/official/ipc-emblem-128.png" alt="" width={74} height={128} className="h-full w-auto" />
              </span>
              <span>
                <span lang="hi" className="block text-[0.875rem] font-semibold text-white/80">{institution.nameHi}</span>
                <span className="block text-[1.25rem] font-bold leading-tight">{institution.nameEn}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-white/70">
              An Autonomous Institution of the {institution.ministryEn}, {institution.governmentEn}, created to set standards of drugs in the country.
            </p>
            <address className="mt-6 space-y-3 text-[0.9375rem] not-italic text-white/80">
              <p className="flex gap-3">
                <MapPin aria-hidden size={18} className="mt-1 shrink-0 text-white/50" />
                <span>{contact.address.slice(2).join(', ')}</span>
              </p>
              <p className="flex gap-3">
                <Phone aria-hidden size={18} className="mt-1 shrink-0 text-white/50" />
                <span className="tabular">{contact.phones.join(', ')}</span>
              </p>
              <p className="flex gap-3">
                <Mail aria-hidden size={18} className="mt-1 shrink-0 text-white/50" />
                <a href={`mailto:${contact.emails[0].email}`} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                  {contact.emails[0].email}
                </a>
              </p>
            </address>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
            {columns.map(col => (
              <div key={col.heading}>
                <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] !text-white/55">{col.heading}</h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <SmartLink to={l.to} href={l.href} className={`${linkCls} inline-flex items-center gap-1`}>
                        {l.label}
                        {l.href && <ArrowUpRight aria-hidden size={13} className="opacity-60" />}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] !text-white/55">Help</h2>
              <ul className="mt-4 space-y-2.5">
                {help.map(l => (
                  <li key={l.label}><SmartLink to={l.to} href={l.href} className={linkCls}>{l.label}</SmartLink></li>
                ))}
              </ul>
              <h2 className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.12em] !text-white/55">Connect with IPC</h2>
              <ul className="mt-4 space-y-2.5">
                {social.map(s => (
                  <li key={s.label}>
                    <SmartLink href={s.href} className={`${linkCls} inline-flex items-center gap-1`}>
                      {s.label}<ArrowUpRight aria-hidden size={13} className="opacity-60" />
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 py-8">
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] !text-white/55">Related Government Websites</h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
            {navigation.related.map(r => (
              <li key={r.href}>
                <SmartLink href={r.href} className="text-[0.875rem] text-white/70 hover:text-white">{r.label}</SmartLink>
              </li>
            ))}
            <li><SmartLink to="/related-website-links/websitelinks" className="text-[0.875rem] font-semibold text-white hover:underline">View all</SmartLink></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 py-7 text-[0.8125rem] text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {policies.map(l => (
              <li key={l.label}><SmartLink to={l.to} href={l.href} className="hover:text-white">{l.label}</SmartLink></li>
            ))}
          </ul>
          <div className="flex flex-col gap-1 lg:items-end">
            <p>© Indian Pharmacopoeia Commission, {institution.ministryEn}, {institution.governmentEn}</p>
            <p>Content as published on www.ipc.gov.in · snapshot of <time dateTime={home.snapshotDate}>{formatDate(home.snapshotDate)}</time></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
