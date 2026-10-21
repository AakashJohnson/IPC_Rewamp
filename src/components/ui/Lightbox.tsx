import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ease } from '../../lib/motion';
import type { GalleryImage } from '../../lib/types';

interface Props {
  images: GalleryImage[];
  index: number | null;
  albumTitle: string;
  onChange: (index: number | null) => void;
}

/** Accessible modal image viewer: focus is trapped, Esc closes, arrow keys navigate, focus returns on close. */
export function Lightbox({ images, index, albumTitle, onChange }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const open = index !== null;
  const count = images.length;

  const go = useCallback((delta: number) => {
    if (index === null) return;
    onChange((index + delta + count) % count);
  }, [index, count, onChange]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      returnFocus.current?.focus();
    };
  }, [open]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onChange(null); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Tab') {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button');
      if (!focusables?.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const img = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && img && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${albumTitle} — photo ${index! + 1} of ${count}`}
          onKeyDown={onKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex flex-col bg-navy-950/95 text-white"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
            <p className="tabular text-meta text-white/70" aria-live="polite">
              {index! + 1} / {count}
            </p>
            <button
              type="button"
              data-autofocus
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-2 rounded-xs border border-white/25 px-3 py-2 text-[0.875rem] hover:border-white"
            >
              <X aria-hidden size={16} /> Close
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-4 md:px-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={img.src}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: ease.out }}
                className="flex max-h-full flex-col items-center"
              >
                <img
                  src={img.src}
                  alt={img.caption ?? `${albumTitle} — photo ${index! + 1}`}
                  className="max-h-[calc(100vh-10rem)] w-auto max-w-full rounded-xs object-contain"
                  width={img.w}
                  height={img.h}
                />
                {img.caption && <figcaption className="mt-3 max-w-2xl text-center text-meta text-white/75">{img.caption}</figcaption>}
              </motion.figure>
            </AnimatePresence>
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous photo"
                  className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 hover:border-white md:left-5">
                  <ChevronLeft aria-hidden size={22} />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photo"
                  className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 hover:border-white md:right-5">
                  <ChevronRight aria-hidden size={22} />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
