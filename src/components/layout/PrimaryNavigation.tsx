import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { groupOf, navigation } from '../../lib/nav';
import { ease, spring } from '../../lib/motion';
import { SmartLink } from '../ui/SmartLink';
import { groupDescriptions } from '../../config/navigation-meta';
import { GROUP_ILLUSTRATION } from '../illustrations/map';
import { iconFor } from '../../lib/icons';
import type { NavNode } from '../../lib/types';

const HOVER_OPEN_MS = 110;
const HOVER_CLOSE_MS = 180;

function MenuLink({ node, level }: { node: NavNode; level: 0 | 1 | 2 }) {
  const Icon = level === 0 ? iconFor(node.label) : null;
  const cls = [
    'group/link inline-flex items-start gap-1.5 rounded-xs transition-colors',
    level === 0 && 'font-semibold text-ink hover:text-teal-700 text-[0.9375rem] leading-snug',
    level === 1 && 'text-[0.875rem] leading-snug text-slate hover:text-teal-700',
    level === 2 && 'text-[0.8125rem] leading-snug text-muted hover:text-teal-700',
  ].filter(Boolean).join(' ');
  if (!node.to && !node.href) return <span className={`${cls} cursor-default`}>{node.label}</span>;
  return (
    <SmartLink to={node.to} href={node.href} file={node.file} badge className={cls}>
      {Icon && (
        <span aria-hidden className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-xs bg-teal-50 text-teal-700 transition-colors group-hover/link:bg-teal-600 group-hover/link:text-white">
          <Icon size={14} strokeWidth={1.8} />
        </span>
      )}
      {node.label}
      {node.href && !node.file && <ArrowUpRight aria-hidden size={12} className="mt-1 shrink-0 opacity-60" />}
    </SmartLink>
  );
}

function MenuTree({ nodes, level }: { nodes: NavNode[]; level: 1 | 2 }) {
  return (
    <ul className={level === 1 ? 'mt-2 space-y-1.5 border-l border-line pl-3' : 'mt-1.5 space-y-1 pl-3'}>
      {nodes.map(n => (
        <li key={`${n.label}-${n.to ?? n.href}`}>
          <MenuLink node={n} level={level} />
          {n.children && level === 1 && <MenuTree nodes={n.children} level={2} />}
        </li>
      ))}
    </ul>
  );
}

function MegaPanel({ item, id, onKeyDown }: { item: NavNode; id: string; onKeyDown: (e: KeyboardEvent) => void }) {
  const columns = item.columns ?? [];
  const Art = GROUP_ILLUSTRATION[item.label];
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.16, ease: ease.out }}
      onKeyDown={onKeyDown}
      className="absolute inset-x-0 top-full z-50 border-b border-line bg-white shadow-menu"
    >
      <div className="container-page grid max-h-[min(70vh,44rem)] grid-cols-12 gap-8 overflow-y-auto overscroll-contain py-8">
        <div className="col-span-3 border-r border-line pr-8">
          <p className="eyebrow"><span className="rule" aria-hidden />Menu</p>
          <p className="mt-3 text-[1.375rem] font-semibold leading-tight text-ink">{item.label}</p>
          {groupDescriptions[item.label] && <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{groupDescriptions[item.label]}</p>}
          {item.to && (
            <SmartLink to={item.to} className="group mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-teal-700">
              Overview <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-1" />
            </SmartLink>
          )}
          {Art && <Art className="mt-6 w-44 xl:w-52" />}
        </div>
        <div className={`col-span-9 grid gap-x-8 gap-y-8 ${columns.length >= 4 ? 'grid-cols-4' : columns.length === 3 ? 'grid-cols-3' : columns.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {columns.map(col => (
            <div key={col.heading} className={columns.length === 1 ? 'col-span-2' : ''}>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">{col.heading}</p>
              <ul className={`mt-4 ${columns.length === 1 ? 'grid grid-cols-2 gap-x-8 gap-y-4' : 'space-y-4'}`}>
                {col.items.map(n => (
                  <li key={`${n.label}-${n.to ?? n.href}`}>
                    <MenuLink node={n} level={0} />
                    {n.children && <MenuTree nodes={n.children} level={1} />}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/** Desktop primary navigation with disclosure-pattern mega menus. Hidden below the lg breakpoint. */
export function PrimaryNavigation() {
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const timer = useRef<number | undefined>(undefined);
  const location = useLocation();
  const baseId = useId();
  const activeGroup = groupOf(decodeURIComponent(location.pathname))?.label;
  const [hovered, setHovered] = useState<string | null>(null);

  const clearTimer = () => window.clearTimeout(timer.current);
  const close = useCallback((returnFocusTo?: string) => {
    clearTimer();
    setOpen(null);
    if (returnFocusTo) triggers.current[returnFocusTo]?.focus();
  }, []);

  // Close on navigation.
  useEffect(() => { close(); }, [location.pathname, close]);

  // Close on outside pointer down.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, close]);

  useEffect(() => clearTimer, []);

  const items = navigation.main;
  const labels = items.map(i => i.label);

  const focusTrigger = (label: string, delta: number) => {
    const idx = labels.indexOf(label);
    const next = items[(idx + delta + items.length) % items.length];
    const el = triggers.current[next.label] ?? navRef.current?.querySelector<HTMLElement>(`[data-nav-item="${CSS.escape(next.label)}"]`);
    el?.focus();
  };

  const onTriggerKey = (e: KeyboardEvent, item: NavNode) => {
    if (e.key === 'ArrowDown' && item.columns) {
      e.preventDefault();
      setOpen(item.label);
      requestAnimationFrame(() => navRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${baseId}-panel`)} a`)?.focus());
    } else if (e.key === 'Escape') {
      close(item.label);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      focusTrigger(item.label, e.key === 'ArrowRight' ? 1 : -1);
    }
  };

  const onPanelKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      close(open);
    }
  };

  const hoverOpen = (label: string, e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearTimer();
    timer.current = window.setTimeout(() => setOpen(label), open ? 0 : HOVER_OPEN_MS);
  };
  const hoverClose = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearTimer();
    timer.current = window.setTimeout(() => setOpen(null), HOVER_CLOSE_MS);
  };

  const openItem = items.find(i => i.label === open);
  const indicator = hovered ?? open ?? activeGroup;

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="no-print sticky top-0 z-40 hidden border-b border-line bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90 lg:block"
      onPointerLeave={hoverClose}
      onBlur={e => {
        if (open && !navRef.current?.contains(e.relatedTarget as Node)) close();
      }}
    >
      <div className="container-page">
        <ul className="flex items-stretch gap-1" onPointerLeave={() => setHovered(null)}>
          {items.map(item => {
            const isOpen = open === item.label;
            const isActive = activeGroup === item.label;
            const base = `relative flex h-14 items-center gap-1.5 px-3 text-[0.9375rem] font-semibold transition-colors xl:px-4 ${isOpen || isActive ? 'text-navy-900' : 'text-slate hover:text-navy-900'}`;
            const underline = indicator === item.label && (
              <motion.span
                layoutId="primary-nav-indicator"
                transition={spring}
                aria-hidden
                className={`absolute inset-x-3 bottom-0 h-[2px] xl:inset-x-4 ${isActive || isOpen ? 'bg-teal-600' : 'bg-line-strong'}`}
              />
            );
            return (
              <li key={item.label} className="flex" onPointerEnter={e => { setHovered(item.label); if (item.columns) hoverOpen(item.label, e); else if (open) hoverClose(e); }}>
                {item.columns ? (
                  <button
                    ref={el => { triggers.current[item.label] = el; }}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? `${baseId}-panel` : undefined}
                    onClick={() => (isOpen ? close() : setOpen(item.label))}
                    onKeyDown={e => onTriggerKey(e, item)}
                    className={base}
                  >
                    {item.label}
                    <ChevronDown aria-hidden size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    {underline}
                    {isActive && <span className="sr-only"> (current section)</span>}
                  </button>
                ) : (
                  <NavLink
                    to={item.to ?? '/'}
                    data-nav-item={item.label}
                    onKeyDown={e => onTriggerKey(e, item)}
                    className={base}
                  >
                    {item.label}
                    {underline}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <AnimatePresence>
        {openItem && <MegaPanel key={openItem.label} item={openItem} id={`${baseId}-panel`} onKeyDown={onPanelKey} />}
      </AnimatePresence>
    </nav>
  );
}
