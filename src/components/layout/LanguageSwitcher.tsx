import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Languages, Plug } from 'lucide-react';
import { usePageMeta } from '../../lib/page-context';
import { ANUVADINI_LANGUAGES, isConnected, restoreElement, translateElement } from '../../lib/translate';
import { ease } from '../../lib/motion';

/** English / हिन्दी (official pages) / other Indian languages through Anuvadini when it is connected. */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [status, setStatus] = useState<string>('');
  const { hiUrl } = usePageMeta();
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const connected = isConnected();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  // A new route renders in English; re-apply the chosen language to it.
  useEffect(() => {
    if (lang === 'en' || !connected) return;
    const main = document.getElementById('main');
    const t = window.setTimeout(() => { if (main) translateElement(main, lang).catch(() => setStatus('Translation unavailable — showing English')); }, 600);
    return () => window.clearTimeout(t);
  }, [pathname, lang, connected]);

  const choose = async (code: string) => {
    const main = document.getElementById('main');
    if (!main) return;
    if (code === 'en') { restoreElement(main); setLang('en'); setStatus(''); setOpen(false); return; }
    if (!connected) { setStatus('not-connected'); return; }
    setStatus('Translating…');
    try {
      await translateElement(main, code);
      setLang(code);
      setStatus('');
      setOpen(false);
    } catch {
      restoreElement(main);
      setLang('en');
      setStatus('Translation unavailable — showing English');
    }
  };

  const current = lang === 'en' ? 'English' : ANUVADINI_LANGUAGES.find(l => l.code === lang)?.native;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => { setOpen(o => !o); if (status === 'not-connected') setStatus(''); }}
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/20 px-2.5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-white/30 aria-expanded:bg-white aria-expanded:text-navy-900"
      >
        <span aria-hidden className="flex size-6 items-center justify-center rounded-full bg-white text-teal-700"><Languages size={14} /></span>
        <span className={compact ? 'sr-only' : ''}>{current}</span>
        <span className="sr-only"> — choose language</span>
        <ChevronDown aria-hidden size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: ease.out } }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[min(18rem,calc(100vw-2rem))] origin-top-right rounded-[var(--radius-lg)] bg-white p-2 text-ink shadow-menu ring-1 ring-black/5"
          >
            <ul className="space-y-0.5">
              <li>
                <button type="button" onClick={() => choose('en')} className="flex min-h-11 w-full items-center justify-between rounded-[var(--radius-md)] px-3 text-left font-semibold hover:bg-paper">
                  English {lang === 'en' && <Check aria-hidden size={16} className="text-teal-700" />}
                </button>
              </li>
              <li>
                <a href={hiUrl} lang="hi" hrefLang="hi" className="flex min-h-11 items-center justify-between rounded-[var(--radius-md)] px-3 font-semibold hover:bg-paper">
                  हिन्दी <span lang="en" className="text-[0.75rem] font-medium text-slate">Official Hindi site</span>
                </a>
              </li>
            </ul>
            <p className="mt-2 border-t border-line px-3 pb-1 pt-3 text-[0.8125rem] font-semibold text-slate">Through Anuvadini</p>
            <ul className="grid grid-cols-2 gap-0.5">
              {ANUVADINI_LANGUAGES.map(l => (
                <li key={l.code}>
                  <button
                    type="button"
                    lang={l.code}
                    onClick={() => choose(l.code)}
                    aria-pressed={lang === l.code}
                    className={`flex min-h-10 w-full items-center justify-between rounded-[var(--radius-md)] px-3 text-left text-[0.9375rem] hover:bg-paper aria-pressed:bg-teal-50 ${connected ? '' : 'text-slate'}`}
                  >
                    {l.native}
                    <span className="sr-only" lang="en"> ({l.label})</span>
                  </button>
                </li>
              ))}
            </ul>
            <div role="status" aria-live="polite">
              {status === 'not-connected' ? (
                <p className="mt-2 flex gap-2 rounded-[var(--radius-md)] bg-saffron-100 p-3 text-[0.8125rem] leading-snug text-ink">
                  <Plug aria-hidden size={16} className="mt-0.5 shrink-0 text-saffron-700" />
                  Machine translation through Anuvadini isn’t connected yet. Use हिन्दी for the official Hindi pages.
                </p>
              ) : status ? (
                <p className="mt-2 rounded-[var(--radius-md)] bg-paper p-3 text-[0.8125rem]">{status}</p>
              ) : !connected ? (
                <p className="mt-2 px-3 pb-1 text-[0.75rem] text-slate">Not connected yet — see README.</p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
