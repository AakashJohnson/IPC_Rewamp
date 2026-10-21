import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { Menu } from 'lucide-react';
import { SiteUtilityBar } from './SiteUtilityBar';
import { SearchForm } from './SearchForm';
import { MobileNavigation } from './MobileNavigation';
import { institution } from '../../config/site';

export function InstitutionalHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  return (
    <header role="banner">
      <SiteUtilityBar />
      <div className="border-b border-line bg-white">
        <div className="container-page flex items-center gap-4 py-3 md:py-4">
          <Link to="/" className="group flex min-w-0 items-center gap-3 md:gap-4">
            <img
              src="/images/official/ipc-logo-192.png"
              width={81}
              height={192}
              alt=""
              className="h-14 w-auto shrink-0 md:h-[76px]"
            />
            <span className="min-w-0 border-l border-line pl-3 md:pl-4">
              <span lang="hi" className="block text-[0.8125rem] font-semibold leading-tight text-navy-800 md:text-[0.9375rem]">
                {institution.nameHi}
              </span>
              <span className="mt-0.5 block text-[1.0625rem] font-bold leading-tight tracking-[-0.01em] text-ink sm:text-[1.25rem] md:text-[1.4375rem]">
                {institution.nameEn}
              </span>
              <span className="mt-1 hidden text-[0.75rem] leading-snug text-muted sm:block md:text-meta">
                <span lang="hi">{institution.ministryHi}, {institution.governmentHi}</span>
                <span className="block">{institution.ministryEn}, {institution.governmentEn}</span>
              </span>
            </span>
            <span className="sr-only">, home page</span>
          </Link>

          <div className="ml-auto hidden items-center gap-6 lg:flex">
            <SearchForm className="w-72 xl:w-80" />
            <img src="/images/official/swachh-bharat-96.png" width={221} height={96} alt="Swachh Bharat" className="h-11 w-auto" />
          </div>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="ml-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-sm border border-line-strong px-3 text-[0.875rem] font-semibold text-navy-900 hover:border-navy-900 lg:hidden"
          >
            <Menu aria-hidden size={20} />
            <span>Menu</span>
          </button>
        </div>
      </div>
      <MobileNavigation open={menuOpen} onClose={() => { setMenuOpen(false); menuButton.current?.focus(); }} />
    </header>
  );
}
