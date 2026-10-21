import { motion } from 'motion/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { RichContent } from '../components/ui/RichContent';
import { SideNav } from '../components/ui/SideNav';
import { EmptyState } from '../components/ui/EmptyState';
import { SmartLink } from '../components/ui/SmartLink';
import { ChildLinks, SourceNote, UpdatedMeta } from './shared';
import { childrenOf, groupOf, navigation, sideNavFor, type SideNavModel } from '../lib/nav';
import { usePageSetup } from '../lib/page-context';
import { ease } from '../lib/motion';
import { contact } from '../config/site';
import type { BodyPage } from '../lib/types';

function ContactCard() {
  return (
    <div className="mb-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
      <div className="bg-white p-6">
        <MapPin aria-hidden size={20} className="text-teal-700" />
        <h2 className="mt-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Address</h2>
        <address className="mt-2 not-italic leading-relaxed text-ink">
          {contact.office},<br />
          {contact.address.map(l => <span key={l} className="block">{l}</span>)}
        </address>
        <SmartLink to={contact.routeMap} className="link-underline mt-3 inline-block text-[0.9375rem]">Route map of IPC</SmartLink>
      </div>
      <div className="bg-white p-6">
        <Phone aria-hidden size={20} className="text-teal-700" />
        <h2 className="mt-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Telephone</h2>
        <ul className="mt-2 space-y-1">
          {contact.phones.map(p => (
            <li key={p}><a href={`tel:${p.replace(/-/g, '')}`} className="tabular text-ink hover:text-teal-700">{p}</a></li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6">
        <Mail aria-hidden size={20} className="text-teal-700" />
        <h2 className="mt-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">E-mail</h2>
        <ul className="mt-2 space-y-3">
          {contact.emails.map(e => (
            <li key={e.email}>
              <span className="block text-meta text-muted">{e.label}</span>
              <a href={`mailto:${e.email}`} className="link-underline">{e.email}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const libraryNav: SideNavModel = {
  heading: { label: 'Library & Information Centre', to: '/library-home' },
  items: navigation.library,
};

/** Standard informational page: title band, optional section navigation, official content. */
export function ArticleTemplate({ page }: { page: BodyPage }) {
  usePageSetup(page.title, page.hiUrl);
  const side = page.kind === 'library' ? libraryNav : sideNavFor(page.route);
  const children = childrenOf(page.route);
  const eyebrow = page.kind === 'library' ? 'Library & Information Centre' : groupOf(page.route)?.label;

  return (
    <>
      <PageHeader title={page.title} crumbs={page.crumbs} eyebrow={eyebrow} meta={<UpdatedMeta updated={page.updated} />} />
      <div className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: ease.out }}
          className={side ? 'min-w-0 lg:order-2 lg:col-span-8 lg:col-start-5 xl:col-span-8' : 'min-w-0 lg:col-span-9'}
        >
          {page.kind === 'contact' && <ContactCard />}
          {page.bodyHtml ? (
            <RichContent html={page.bodyHtml} className="container-text" />
          ) : children.length === 0 && page.kind !== 'contact' ? (
            <EmptyState title="No content has been published on this page yet">
              The official website does not currently carry content for this page. Use the section navigation or the search to find related information.
            </EmptyState>
          ) : null}
          {children.length > 0 && (
            <div className={page.bodyHtml ? 'mt-12' : ''}>
              <ChildLinks nodes={children} />
            </div>
          )}
          <SourceNote official={page.official} updated={page.updated} />
        </motion.article>
        {side && (
          <aside className="lg:order-1 lg:col-span-3">
            <SideNav model={side} />
          </aside>
        )}
      </div>
    </>
  );
}
