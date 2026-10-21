import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, X } from 'lucide-react';
import { navigation } from '../../lib/nav';
import { ease } from '../../lib/motion';
import { SmartLink } from '../ui/SmartLink';
import { SearchForm } from './SearchForm';
import type { NavNode } from '../../lib/types';

function Disclosure({ label, children, level }: { label: string; children: ReactNode; level: 0 | 1 }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(o => !o)}
        className={`flex w-full items-center justify-between gap-3 text-left ${level === 0 ? 'py-4 text-[1.0625rem] font-semibold text-ink' : 'py-2.5 text-[0.9375rem] font-medium text-slate'}`}
      >
        {label}
        <ChevronDown aria-hidden size={level === 0 ? 20 : 17} className={`shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: ease.out }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NodeList({ nodes }: { nodes: NavNode[] }) {
  return (
    <ul className="space-y-0.5 border-l border-line pl-4">
      {nodes.map(n => (
        <li key={`${n.label}-${n.to ?? n.href}`}>
          {n.children?.length ? (
            <Disclosure label={n.label} level={1}>
              <div className="pb-2">
                {(n.to || n.href) && (
                  <SmartLink to={n.to} href={n.href} file={n.file} badge className="block py-2 text-[0.9375rem] font-semibold text-teal-700">
                    {n.label} — overview
                  </SmartLink>
                )}
                <NodeList nodes={n.children} />
              </div>
            </Disclosure>
          ) : (
            <SmartLink to={n.to} href={n.href} file={n.file} badge className="block py-2.5 text-[0.9375rem] text-slate hover:text-teal-700">
              {n.label}
            </SmartLink>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Full-height navigation sheet for small screens. Focus is trapped while open and restored on close. */
export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const lastPath = useRef(location.pathname);

  useEffect(() => {
    if (lastPath.current !== location.pathname && open) onClose();
    lastPath.current = location.pathname;
  }, [location.pathname, open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Page content behind the sheet is removed from the tab order and the accessibility tree.
    const background = [document.getElementById('main'), document.querySelector<HTMLElement>('footer[role="contentinfo"]')];
    background.forEach(el => { if (el) el.inert = true; });
    panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    return () => {
      document.body.style.overflow = prev;
      background.forEach(el => { if (el) el.inert = false; });
    };
  }, [open]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (e.key !== 'Tab') return;
    const f = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input');
    if (!f?.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" onKeyDown={onKeyDown}>
          <motion.div
            className="absolute inset-0 bg-navy-950/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: ease.out }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-menu"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">Menu</p>
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="inline-flex h-11 items-center gap-2 rounded-sm border border-line-strong px-3 text-[0.875rem] font-semibold text-navy-900"
              >
                <X aria-hidden size={18} /> Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-10">
              <SearchForm className="mt-4" onSubmitted={onClose} />
              <nav aria-label="Primary" className="mt-4">
                <ul className="divide-y divide-line">
                  <li>
                    <SmartLink to="/" className="block py-4 text-[1.0625rem] font-semibold text-ink">Home</SmartLink>
                  </li>
                  {navigation.main.map(item => (
                    <li key={item.label}>
                      {item.columns ? (
                        <Disclosure label={item.label} level={0}>
                          <div className="space-y-5 pb-5">
                            {item.to && (
                              <SmartLink to={item.to} className="block text-[0.9375rem] font-semibold text-teal-700">{item.label} — overview</SmartLink>
                            )}
                            {item.columns.map(col => (
                              <div key={col.heading}>
                                <p className="mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">{col.heading}</p>
                                <NodeList nodes={col.items} />
                              </div>
                            ))}
                          </div>
                        </Disclosure>
                      ) : (
                        <SmartLink to={item.to} href={item.href} className="block py-4 text-[1.0625rem] font-semibold text-ink">{item.label}</SmartLink>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
