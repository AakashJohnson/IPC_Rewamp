import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CornerDownLeft, FileText, Newspaper, Search, X } from 'lucide-react';
import { loadSearchIndex, type SearchEntry } from '../../lib/content';
import { ease } from '../../lib/motion';

const SUGGESTED = [
  { label: 'Indian Pharmacopoeia 2026', to: '/mandates/indian-pharmacopoeia/indian-pharmacopoeia-ip-2026' },
  { label: 'IP Reference Substances', to: '/mandates/national-formulary-of-india-nfi/about-iprs' },
  { label: 'Draft monographs for comment', to: '/mandates/indian-pharmacopoeia/monographs/monographs-under-preparation' },
  { label: 'Careers', to: '/careers' },
  { label: 'Report an adverse drug reaction (PvPI)', to: '/mandates/pvpi/adr-reporting' },
  { label: 'Contact IPC', to: '/about-us/contact-us' },
];

function rank(index: SearchEntry[], q: string) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const out: { e: SearchEntry; s: number }[] = [];
  for (const e of index) {
    const title = e.t.toLowerCase();
    let s = 0;
    for (const t of terms) {
      if (title.includes(t)) s += title.startsWith(t) ? 12 : 8;
      else if (e.x.toLowerCase().includes(t)) s += 2;
      else { s = 0; break; }
    }
    if (s) out.push({ e, s: s + (e.k !== 'news' ? 3 : 0) });
  }
  return out.sort((a, b) => b.s - a.s).slice(0, 7).map(r => r.e);
}

/** ⌘K / Ctrl+K search sheet with live results over every page title and news headline. */
export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    setQ('');
    setActive(0);
    loadSearchIndex().then(setIndex, () => setFailed(true));
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const results = useMemo(() => (index ? rank(index, q) : []), [index, q]);
  const items = q.trim() ? results.map(r => ({ label: r.t, to: r.r, news: r.k === 'news' })) : SUGGESTED.map(s => ({ ...s, news: false }));

  const go = (to: string) => { onClose(); navigate(to); };
  const submit = () => {
    const term = q.trim();
    if (items[active] && (q.trim() === '' || results.length)) go(items[active].to);
    else go(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (e.key === 'Tab') {
      const f = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button, input');
      if (!f?.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[10vh]" onKeyDown={handleKeyDown}>
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search the IPC website"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: ease.out } }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[var(--radius-xl)] bg-white shadow-menu"
          >
            <form onSubmit={e => { e.preventDefault(); submit(); }} className="flex items-center gap-3 border-b border-line px-5 focus-within:bg-teal-50/60">
              <Search aria-hidden size={20} className="shrink-0 text-teal-700" />
              <label htmlFor={`${listId}-q`} className="sr-only">Search pages, notices and publications</label>
              <input
                id={`${listId}-q`}
                ref={inputRef}
                value={q}
                onChange={e => { setQ(e.target.value); setActive(0); }}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={items[active] ? `${listId}-${active}` : undefined}
                autoComplete="off"
                placeholder="Search pages, notices, publications"
                className="h-16 min-w-0 flex-1 bg-transparent text-[1.125rem] text-ink placeholder:text-muted focus:outline-none focus-visible:shadow-none focus-visible:outline-none"
              />
              <button type="button" onClick={onClose} className="inline-flex size-10 items-center justify-center rounded-full text-slate hover:bg-paper">
                <X aria-hidden size={18} /><span className="sr-only">Close search</span>
              </button>
            </form>
            <p className="px-5 pt-4 text-[0.875rem] font-semibold text-slate">
              {q.trim() ? (index ? `${results.length ? results.length : 'No'} quick matches` : failed ? 'Search index unavailable — press Enter for full search' : 'Loading…') : 'Popular destinations'}
            </p>
            <ul id={listId} role="listbox" aria-label="Search results" className="max-h-[50vh] overflow-y-auto p-2">
              {items.map((it, i) => (
                <li key={it.to} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <a
                    href={it.to}
                    onClick={e => { e.preventDefault(); go(it.to); }}
                    onMouseEnter={() => setActive(i)}
                    className={`group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 transition-colors ${i === active ? 'bg-teal-50 text-ink' : 'text-slate'}`}
                  >
                    {it.news ? <Newspaper aria-hidden size={18} className="shrink-0 text-coral-700" /> : <FileText aria-hidden size={18} className="shrink-0 text-teal-700" />}
                    <span className="min-w-0 flex-1 truncate font-medium">{it.label}</span>
                    <ArrowRight aria-hidden size={16} className={`shrink-0 transition-transform ${i === active ? 'translate-x-0.5 text-teal-700' : 'opacity-0'}`} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-3 bg-paper px-5 py-3 text-[0.8125rem] text-slate">
              <span className="inline-flex items-center gap-1.5"><CornerDownLeft aria-hidden size={14} /> Enter opens a result, Esc closes</span>
              <button type="button" onClick={() => go(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search')} className="font-semibold text-teal-700 hover:underline">
                See all results
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
