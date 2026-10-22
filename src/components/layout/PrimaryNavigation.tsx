import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, BookOpen, ChevronDown, FlaskConical, Globe, Landmark, LayoutGrid, Megaphone, MonitorSmartphone, type LucideIcon } from 'lucide-react';
import { groupOf, navigation } from '../../lib/nav';
import { ease, spring } from '../../lib/motion';
import { SmartLink } from '../ui/SmartLink';
import { groupDescriptions } from '../../config/navigation-meta';
import { GROUP_ILLUSTRATION } from '../illustrations/map';
import { iconFor } from '../../lib/icons';
import type { NavNode } from '../../lib/types';

const HOVER_OPEN_MS = 110;
const HOVER_CLOSE_MS = 450;

// Icon and accent per top-level group.
// Each group has its own colour: a gradient chip behind its icon, and the menu panel's colour field.
const GROUP_STYLE: Record<string, { icon: LucideIcon; field: string; chip: string }> = {
  'About IPC': { icon: Landmark, field: 'field-sky', chip: 'linear-gradient(135deg, #3aa5ea, #0a62a0)' },
  'Publications & Standards': { icon: BookOpen, field: 'field-teal', chip: 'linear-gradient(135deg, #14b3a5, #076f69)' },
  Programmes: { icon: FlaskConical, field: 'field-coral', chip: 'linear-gradient(135deg, #ff8a6b, #d9452c)' },
  'Online Services': { icon: MonitorSmartphone, field: 'field-violet', chip: 'linear-gradient(135deg, #9b7cff, #5a3fcc)' },
  Harmonization: { icon: Globe, field: 'field-teal', chip: 'linear-gradient(135deg, #2fd08a, #1f8f5f)' },
  Notices: { icon: Megaphone, field: 'field-saffron', chip: 'linear-gradient(135deg, #ffb347, #e07b00)' },
  More: { icon: LayoutGrid, field: 'field-violet', chip: 'linear-gradient(135deg, #f472b6, #a855f7)' },
};

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
        <span aria-hidden className="menu-chip mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover/link:-rotate-12 group-hover/link:scale-110">
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

function MegaPanel({ item, id, onKeyDown, onPointerEnter }: { item: NavNode; id: string; onKeyDown: (e: KeyboardEvent) => void; onPointerEnter: () => void }) {
  const columns = item.columns ?? [];
  const style = GROUP_STYLE[item.label];
  const Art = GROUP_ILLUSTRATION[item.label];
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: ease.out }}
      onKeyDown={onKeyDown}
      onPointerEnter={onPointerEnter}
      className="absolute inset-x-0 top-full z-50 pt-2"
    >
      {/* Invisible bridge so the pointer can travel from the trigger to the panel without closing it. */}
      <span aria-hidden className="absolute inset-x-0 -top-4 h-6" />
      <div className="container-page">
      <div className="grid max-h-[min(72vh,44rem)] grid-cols-12 gap-8 overflow-y-auto overscroll-contain rounded-[var(--radius-xl)] bg-white p-6 shadow-menu ring-1 ring-black/5">
        <div className={`field ${style?.field ?? 'field-teal'} grain relative col-span-3 overflow-hidden rounded-[var(--radius-lg)] p-6`}>
          {style && <style.icon aria-hidden size={120} strokeWidth={1} className="decor absolute -bottom-6 -right-6 opacity-15" />}
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
          {columns.map((col, ci) => (
            <div key={col.heading} className={`chip-tone-${ci % 4} ${columns.length === 1 ? 'col-span-2' : ''}`}>
              <p className="text-[0.9375rem] font-semibold text-teal-700">{col.heading}</p>
              <ul className={`mt-4 ${columns.length === 1 ? 'grid grid-cols-2 gap-x-8 gap-y-4' : 'space-y-4'}`}>
                {col.items.map((n, k) => (
                  <motion.li key={`${n.label}-${n.to ?? n.href}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.04 * k, duration: 0.3, ease: ease.out } }}>
                    <MenuLink node={n} level={0} />
                    {n.children && <MenuTree nodes={n.children} level={1} />}
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
    // Escape closes a menu that was opened by hover, wherever focus happens to be.
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') close(navRef.current?.contains(document.activeElement) ? open : undefined); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
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
      className="no-print hidden self-stretch xl:flex xl:items-center"
      onPointerLeave={hoverClose}
      onPointerEnter={clearTimer}
      onBlur={e => {
        if (open && !navRef.current?.contains(e.relatedTarget as Node)) close();
      }}
    >
      <div>
        <ul className="nav-pill flex items-center gap-0.5 rounded-full p-1" onPointerLeave={() => setHovered(null)}>
          {items.map(item => {
            const isOpen = open === item.label;
            const isActive = activeGroup === item.label;
            const Icon = GROUP_STYLE[item.label]?.icon;
            const base = `group/nav relative z-0 flex h-10 items-center gap-1 whitespace-nowrap rounded-full px-1 text-[0.8125rem] font-semibold transition-colors duration-200 ${isOpen || isActive ? 'text-teal-800' : 'text-ink hover:text-navy-900'}`;
            const icon = Icon && (
              <span aria-hidden className="hidden size-5 shrink-0 items-center justify-center rounded-full text-white min-[1360px]:flex shadow-[0_4px_10px_-4px_rgb(11_34_64/0.5)] transition-transform duration-300 group-hover/nav:-rotate-12 group-hover/nav:scale-110" style={{ background: GROUP_STYLE[item.label].chip }}>
                <Icon size={11} strokeWidth={2.4} />
              </span>
            );
            const underline = indicator === item.label && (
              <motion.span
                layoutId="primary-nav-indicator"
                transition={spring}
                aria-hidden
                className={`absolute inset-0 -z-10 rounded-full ${isActive || isOpen ? 'nav-active' : 'nav-hover'}`}
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
                    {icon}
                    {item.label}
                    <ChevronDown aria-hidden size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
                    {icon}
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
        {openItem && <MegaPanel key={openItem.label} item={openItem} id={`${baseId}-panel`} onKeyDown={onPanelKey} onPointerEnter={clearTimer} />}
      </AnimatePresence>
    </nav>
  );
}
