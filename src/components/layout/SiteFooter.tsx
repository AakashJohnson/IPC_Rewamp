import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, BookOpen, ChevronDown, Facebook, LifeBuoy, Landmark, Linkedin, Mail, MapPin, Megaphone, Phone, Twitter, Youtube, type LucideIcon } from 'lucide-react';
import { iconFor } from '../../lib/icons';
import { navigation } from '../../lib/nav';
import { SmartLink } from '../ui/SmartLink';
import { contact, institution, ipOnline, nfiOnline, social } from '../../config/site';
import home from '../../content/home.json';
import { formatDate } from '../../lib/format';
import { AnuvadiniAttribution } from './AnuvadiniAttribution';
import { SectionBackdrop } from '../effects/SectionBackdrop';

const columns = [
  {
    heading: 'About IPC',
    links: [
      { label: 'About Us', to: '/about-us' },
      { label: 'Mission & Vision', to: '/about-us/about-ipc/objectives-of-ipc' },
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

const HEADING_ICON: Record<string, LucideIcon> = { 'About IPC': Landmark, 'Publications & Services': BookOpen, Notices: Megaphone, Help: LifeBuoy };
const SOCIAL_ICON: Record<string, LucideIcon> = { Facebook, 'X (Twitter)': Twitter, YouTube: Youtube, LinkedIn: Linkedin };

function FooterLink({ label, to, href }: { label: string; to?: string; href?: string }) {
  const Icon = iconFor(label);
  return (
    <SmartLink to={to} href={href} className="group inline-flex items-start gap-2 text-[0.9375rem] text-ink/85 hover:text-ink">
      <span aria-hidden className="menu-chip mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
        <Icon size={13} strokeWidth={2} />
      </span>
      <span className="link-sweep">{label}</span>
    </SmartLink>
  );
}

function ColumnHeading({ children }: { children: string }) {
  const Icon = HEADING_ICON[children];
  return (
    <h2 className="flex items-center gap-2 text-[1rem] font-semibold">
      {Icon && <span aria-hidden className="menu-chip flex size-8 items-center justify-center rounded-full text-white"><Icon size={16} /></span>}
      {children}
    </h2>
  );
}

const POLICY = new Set(['Disclaimer', 'Copyright Policy', 'Terms & Conditions', 'Hyperlinking Policy', 'Privacy Policy']);

/** A compact close: identity and contact, three short link columns, then one line of policies and credits. */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '0%']);
  const help = navigation.footer.filter(l => !POLICY.has(l.label));
  const policies = navigation.footer.filter(l => POLICY.has(l.label));

  return (
    <footer ref={ref} role="contentinfo" className="field field-teal grain no-print relative overflow-hidden">
      <span aria-hidden className="bar-glow" style={{ top: 0, bottom: 'auto' }} />
      <SectionBackdrop variant="hex" tone="#076f69" />
      {/* The name built large: an outlined wordmark sliding in behind the content. */}
      <motion.p aria-hidden style={{ x }} className="decor pointer-events-none absolute -bottom-[0.18em] left-0 select-none whitespace-nowrap font-display text-[clamp(8rem,26vw,24rem)] font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_rgb(6_48_45/0.14)]">
        IPC
      </motion.p>

      <div className="container-page relative z-[1] py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-hair">
                <img src="/images/official/ipc-emblem-128.png" alt="" width={74} height={128} className="h-full w-auto" />
              </span>
              <span className="leading-tight">
                <span lang="hi" className="block text-[0.875rem] font-semibold text-teal-800">{institution.nameHi}</span>
                <span className="block font-display text-[1.25rem] font-semibold text-ink">{institution.nameEn}</span>
              </span>
            </Link>
            <address className="mt-6 grid gap-2.5 text-[0.9375rem] not-italic text-ink">
              <p className="flex gap-2.5"><MapPin aria-hidden size={18} className="mt-0.5 shrink-0 text-teal-800" />{contact.address.slice(2).join(', ')}</p>
              <p className="flex gap-2.5"><Phone aria-hidden size={18} className="mt-0.5 shrink-0 text-teal-800" /><span className="tabular">{contact.phones.join(', ')}</span></p>
              <p className="flex gap-2.5"><Mail aria-hidden size={18} className="mt-0.5 shrink-0 text-teal-800" /><a href={`mailto:${contact.emails[0].email}`} className="link-sweep">{contact.emails[0].email}</a></p>
            </address>
            <ul className="mt-5 flex flex-wrap gap-2">
              {social.map(s => {
                const Icon = SOCIAL_ICON[s.label] ?? ArrowUpRight;
                return (
                <li key={s.label}>
                  <SmartLink href={s.href} className={`chip-glass chip-tone-${social.indexOf(s) % 4} inline-flex h-10 items-center gap-2 rounded-full pl-1.5 pr-4 text-[0.875rem] font-semibold text-ink transition-transform hover:-translate-y-0.5`}>
                    <span aria-hidden className="menu-chip flex size-7 items-center justify-center rounded-full text-white"><Icon size={14} /></span>{s.label}
                  </SmartLink>
                </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
            {columns.map((col, ci) => (
              <div key={col.heading} className={`chip-tone-${(ci + 1) % 4}`}>
                <ColumnHeading>{col.heading}</ColumnHeading>
                <ul className="mt-3 space-y-2">
                  {col.links.map(l => (
                    <li key={l.label}><FooterLink label={l.label} to={l.to} href={l.href} /></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="chip-tone-2">
              <ColumnHeading>Help</ColumnHeading>
              <ul className="mt-3 space-y-2">
                {help.map(l => <li key={l.label}><FooterLink label={l.label} to={l.to} href={l.href} /></li>)}
              </ul>
            </div>
          </div>
        </div>

        <details className="group mt-10 rounded-[var(--radius-lg)] bg-white/55 px-5 py-3 open:bg-white/75">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 font-semibold text-ink">
            Related government websites
            <ChevronDown aria-hidden size={18} className="transition-transform group-open:rotate-180" />
          </summary>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 pb-2">
            {navigation.related.map(r => <li key={r.href}><SmartLink href={r.href} className="link-sweep text-[0.9375rem] text-ink/85 hover:text-ink">{r.label}</SmartLink></li>)}
            <li><SmartLink to="/related-website-links/websitelinks" className="link-sweep text-[0.9375rem] font-semibold text-ink">View all</SmartLink></li>
          </ul>
        </details>

        <div className="mt-8 flex flex-col gap-4 text-[0.875rem] text-ink/85 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
            {policies.map(l => <li key={l.label}><SmartLink to={l.to} href={l.href} className="link-sweep">{l.label}</SmartLink></li>)}
          </ul>
          <div className="flex flex-col gap-2 lg:items-end">
            <AnuvadiniAttribution className="self-start lg:self-end" />
            <p>© {institution.nameEn}, {institution.governmentEn}. Content as on <time dateTime={home.snapshotDate}>{formatDate(home.snapshotDate)}</time>.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
