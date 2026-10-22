import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Contrast, LogIn, Menu, Search, ShoppingCart } from 'lucide-react';
import { PrimaryNavigation } from './PrimaryNavigation';
import { MobileNavigation } from './MobileNavigation';
import { CommandSearch } from './CommandSearch';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useA11y } from '../../lib/a11y';
import { institution, shop } from '../../config/site';

const strip = 'inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-white/20 aria-pressed:bg-white aria-pressed:text-navy-900 disabled:opacity-40';

/**
 * Vivid top strip: affiliation, text size, contrast, language, Anuvadini attribution and store access —
 * all visible, never hidden in a toggle. Collapses to the essentials on phones.
 */
function UtilityStrip() {
  const a11y = useA11y();
  return (
    <div className="utility-strip relative z-[2] text-white">
      <span aria-hidden className="strip-shine pointer-events-none absolute inset-0 overflow-hidden" />
      <div className="container-page relative flex h-10 items-center gap-2">
        <p className="hidden min-w-0 items-center gap-2 truncate text-[0.8125rem] font-medium md:flex">
          <span lang="hi">{institution.governmentHi}</span>
          <span aria-hidden className="opacity-50">|</span>
          <span>{institution.governmentEn}</span>
          <span aria-hidden className="hidden opacity-50 lg:inline">|</span>
          <span className="hidden truncate lg:inline">{institution.ministryEn}</span>
        </p>
        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <div role="group" aria-label="Text size" className="flex items-center rounded-full bg-white/15 p-0.5">
            <button type="button" className={strip} onClick={a11y.decrease} disabled={!a11y.canDecrease}>A−<span className="sr-only"> Decrease text size</span></button>
            <button type="button" className={strip} onClick={a11y.reset} aria-pressed={a11y.scaleIndex === 1}>A<span className="sr-only"> Default text size</span></button>
            <button type="button" className={strip} onClick={a11y.increase} disabled={!a11y.canIncrease}>A+<span className="sr-only"> Increase text size</span></button>
          </div>
          <button type="button" className={`${strip} gap-1.5`} onClick={a11y.toggleContrast} aria-pressed={a11y.highContrast}>
            <span aria-hidden className="flex size-6 items-center justify-center rounded-full bg-white text-violet-700"><Contrast size={14} /></span><span className="hidden lg:inline">Contrast</span><span className="sr-only lg:hidden">High contrast</span>
          </button>
          <LanguageSwitcher compact />
          <a
            href="https://anuvadini.aicte.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white py-1 pl-2.5 pr-1.5 text-navy-900 transition-transform hover:-translate-y-0.5"
          >
            <span className="hidden whitespace-nowrap text-[0.6875rem] font-semibold sm:inline">Powered by</span>
            <img src="/images/brand/anuvadini-logo-96.png" width={66} height={20} alt="Anuvadini" className="h-5 w-auto" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={shop.login} target="_blank" rel="noopener noreferrer" className={`${strip} hidden gap-1.5 sm:inline-flex`}>
            <LogIn aria-hidden size={15} /><span className="hidden lg:inline">Login</span><span className="sr-only"> to the IPC online store (opens in a new tab)</span>
          </a>
          <a href={shop.cart} target="_blank" rel="noopener noreferrer" className={`${strip} hidden sm:inline-flex`}>
            <ShoppingCart aria-hidden size={15} /><span className="sr-only">Cart on the IPC online store (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/** Two-tier header: the colourful utility strip, then emblem and wordmark, icon pill navigation and search. */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // On wide screens the header slides away on scroll down and returns on scroll up. Direction is decided
  // with hysteresis (travel accumulated in one direction), so momentum and trackpad deceleration — tiny
  // back-and-forth deltas — never make it flicker. It never hides while a menu is open or it's hovered.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let lastY = window.scrollY;
    let travel = 0;
    let hidden = false;
    let frame = 0;
    let pointerInside = false;
    const HIDE_AFTER = 48;
    const SHOW_AFTER = 24;
    const wide = window.matchMedia('(min-width: 64rem)');
    const set = (next: boolean) => { if (next !== hidden) { hidden = next; el.dataset.hidden = String(next); } };
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) < 1) return;
      // Reset the travel when the direction changes.
      travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
      const menuIsOpen = !!el.querySelector('[aria-expanded="true"]');
      if (!wide.matches || menuIsOpen || pointerInside || y < 120) set(false);
      else if (travel > HIDE_AFTER) set(true);
      else if (travel < -SHOW_AFTER) set(false);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const show = () => { travel = 0; set(false); };
    const onEnter = () => { pointerInside = true; show(); };
    const onLeave = () => { pointerInside = false; };
    window.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('focusin', show);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      el.removeEventListener('focusin', show);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header ref={headerRef} role="banner" className="site-header no-print sticky top-0 z-50" data-hidden="false">
      <UtilityStrip />
      <div className="main-bar relative">
        <div className="container-page relative flex h-[4.25rem] items-center gap-3">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3 xl:shrink-0">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-hair ring-2 ring-teal-500/30 xl:size-11 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
              <img src="/images/official/ipc-emblem-128.png" width={74} height={128} alt="" className="h-9 w-auto" />
            </span>
            <span className="min-w-0 leading-tight">
              <span lang="hi" className="block truncate text-[0.8125rem] font-semibold text-teal-700">{institution.nameHi}</span>
              <span className="brand-word block truncate font-display text-[0.9375rem] font-bold tracking-[-0.02em] sm:text-[1.125rem] xl:text-[0.9375rem]">{institution.nameEn}</span>
            </span>
            <span className="sr-only">, {institution.ministryEn}, {institution.governmentEn} — home page</span>
          </Link>

          <PrimaryNavigation />

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <button type="button" onClick={() => setSearchOpen(true)} className="search-pill inline-flex size-11 items-center justify-center gap-2 rounded-full text-white transition-transform hover:-translate-y-0.5 active:scale-95">
              <Search aria-hidden size={18} />
              <span className="sr-only">Search the website (Ctrl K)</span>
            </button>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-navy-900 px-3 text-[0.9375rem] font-semibold text-white active:scale-[0.97] sm:px-4 xl:hidden"
            >
              <Menu aria-hidden size={18} /><span className="sr-only sm:not-sr-only">Menu</span>
            </button>
          </div>
        </div>
        <span aria-hidden className="bar-glow" />
      </div>
      <MobileNavigation open={menuOpen} onClose={() => { setMenuOpen(false); menuButton.current?.focus(); }} />
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
