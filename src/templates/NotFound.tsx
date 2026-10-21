import { PageHeader } from '../components/ui/PageHeader';
import { SearchForm } from '../components/layout/SearchForm';
import { SmartLink } from '../components/ui/SmartLink';
import { usePageSetup } from '../lib/page-context';
import { MagnifierDoc } from '../components/illustrations';

const popular = [
  { label: 'Indian Pharmacopoeia', to: '/mandates/indian-pharmacopoeia' },
  { label: 'News & Highlights', to: '/news-highlights' },
  { label: 'Orders & Circulars', to: '/orders-circulars-notices' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact Us', to: '/about-us/contact-us' },
  { label: 'Site Map', to: '/site-map' },
];

export function NotFound() {
  usePageSetup('Page not found');
  return (
    <>
      <PageHeader title="Page not found" printable={false} lead="The page you requested is not available. It may have been moved, or the address may be incorrect." />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <MagnifierDoc className="mb-6 w-56" />
          <h2 className="text-h3">Search the website</h2>
          <SearchForm className="mt-4" size="lg" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="text-h3">Frequently visited</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {popular.map(p => (
              <li key={p.to}><SmartLink to={p.to} className="block py-3 font-medium text-ink hover:text-teal-700">{p.label}</SmartLink></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
