import { Contrast, LogIn, ShoppingCart } from 'lucide-react';
import { useA11y } from '../../lib/a11y';
import { usePageMeta } from '../../lib/page-context';
import { institution, shop } from '../../config/site';

const ctrl = 'inline-flex h-8 min-w-8 items-center justify-center rounded-xs px-1.5 text-[0.8125rem] font-semibold transition-colors hover:bg-white/10 aria-pressed:bg-white aria-pressed:text-navy-900 disabled:opacity-40';

/** Thin government utility strip: affiliation, accessibility controls, language and account access. */
export function SiteUtilityBar() {
  const a11y = useA11y();
  const { hiUrl } = usePageMeta();

  return (
    <div className="no-print bg-navy-950 text-white">
      <div className="tricolour" aria-hidden />
      <div className="container-page flex min-h-10 items-center justify-between gap-4 py-1 text-[0.8125rem]">
        {/* Below 25rem the controls need the full width; the branding header repeats the affiliation. */}
        <p className="hidden min-w-0 items-center gap-2 text-white/85 xs:flex">
          <span lang="hi">{institution.governmentHi}</span>
          <span aria-hidden className="text-white/40">|</span>
          <span>{institution.governmentEn}</span>
          <span aria-hidden className="hidden text-white/40 md:inline">|</span>
          <span className="hidden truncate md:inline">{institution.ministryEn}</span>
        </p>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <div role="group" aria-label="Text size" className="flex items-center">
            <button type="button" className={ctrl} onClick={a11y.decrease} disabled={!a11y.canDecrease}>
              A-<span className="sr-only"> Decrease text size</span>
            </button>
            <button type="button" className={ctrl} onClick={a11y.reset} aria-pressed={a11y.scaleIndex === 1}>
              A<span className="sr-only"> Default text size</span>
            </button>
            <button type="button" className={ctrl} onClick={a11y.increase} disabled={!a11y.canIncrease}>
              A+<span className="sr-only"> Increase text size</span>
            </button>
          </div>
          <button type="button" className={`${ctrl} gap-1.5`} onClick={a11y.toggleContrast} aria-pressed={a11y.highContrast}>
            <Contrast aria-hidden size={14} />
            <span className="hidden sm:inline">High contrast</span>
            <span className="sr-only sm:hidden">High contrast</span>
          </button>
          <span aria-hidden className="hidden h-4 w-px bg-white/20 sm:block" />
          <a href={hiUrl} lang="hi" hrefLang="hi" className={`${ctrl} px-2`}>
            हिन्दी
            <span className="sr-only" lang="en"> — Hindi version of this page on the official site (opens in the same tab)</span>
          </a>
          <a href={shop.cart} className={`${ctrl} hidden sm:inline-flex`} target="_blank" rel="noopener noreferrer">
            <ShoppingCart aria-hidden size={15} />
            <span className="sr-only">Cart — IPC online store (opens in a new tab)</span>
          </a>
          <a href={shop.login} className={`${ctrl} gap-1.5`} target="_blank" rel="noopener noreferrer">
            <LogIn aria-hidden size={14} />
            <span className="hidden sm:inline">Login</span>
            <span className="sr-only"><span className="sm:hidden">Login</span> — IPC online store (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
