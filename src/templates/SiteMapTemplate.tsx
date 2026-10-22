import { PageHeader } from '../components/ui/PageHeader';
import { PageCanvas } from '../components/ui/PageCanvas';
import { SmartLink } from '../components/ui/SmartLink';
import { navigation } from '../lib/nav';
import { usePageSetup } from '../lib/page-context';
import type { NavNode, SimplePage } from '../lib/types';

function Tree({ nodes, depth = 0 }: { nodes: NavNode[]; depth?: number }) {
  return (
    <ul className={depth ? 'mt-1.5 space-y-1.5 border-l border-line pl-4' : 'space-y-2.5'}>
      {nodes.map(n => (
        <li key={`${n.label}-${n.to ?? n.href}`}>
          {n.to || n.href ? (
            <SmartLink to={n.to} href={n.href} file={n.file} badge className={`hover:text-teal-700 hover:underline underline-offset-4 ${depth ? 'text-[0.9375rem] text-slate' : 'font-semibold text-ink'}`}>
              {n.label}
            </SmartLink>
          ) : <span className="font-semibold text-ink">{n.label}</span>}
          {n.children && <Tree nodes={n.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

/** Generated from the same navigation data as the header, so it never drifts from the menus. */
export function SiteMapTemplate({ page }: { page: SimplePage }) {
  usePageSetup('Site Map', page.hiUrl);
  return (
    <>
      <PageHeader title="Site Map" eyebrow="Help" lead="Every section of the Indian Pharmacopoeia Commission website." />
      <PageCanvas>
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {navigation.main.map(group => (
            <section key={group.label} aria-labelledby={`sm-${group.label}`} className="page-sheet">
              <h2 id={`sm-${group.label}`} className="pb-1 text-h3">
                {group.to ? <SmartLink to={group.to} className="hover:text-teal-700">{group.label}</SmartLink> : group.label}
              </h2>
              <div className="mt-5 space-y-6">
                {group.columns ? group.columns.map(col => (
                  <div key={col.heading}>
                    <p className="mb-2.5 text-[0.9375rem] font-semibold" style={{ color: 'var(--accent-ink)' }}>{col.heading}</p>
                    <Tree nodes={col.items} />
                  </div>
                )) : <Tree nodes={[group]} />}
              </div>
            </section>
          ))}
          <section aria-labelledby="sm-help" className="page-sheet">
            <h2 id="sm-help" className="pb-1 text-h3">Help & Policies</h2>
            <div className="mt-5"><Tree nodes={navigation.footer} /></div>
          </section>
          <section aria-labelledby="sm-library" className="page-sheet">
            <h2 id="sm-library" className="pb-1 text-h3">Library & Information Centre</h2>
            <div className="mt-5"><Tree nodes={navigation.library} /></div>
          </section>
        </div>
      </div>
      </PageCanvas>
    </>
  );
}
