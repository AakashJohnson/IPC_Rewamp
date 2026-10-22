import { useId, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { ease } from '../../lib/motion';

interface AccordionItemProps {
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  index?: number;
}

/** Disclosure row: button with aria-expanded, panel labelled by its trigger, animated height. */
export function AccordionItem({ title, open, onToggle, children, index }: AccordionItemProps) {
  const id = useId();
  return (
    <div className="tex-card mb-3 overflow-hidden rounded-[var(--radius-lg)] bg-pearl transition-[background-color,box-shadow] duration-300 hover:shadow-lift has-[[aria-expanded=true]]:bg-white has-[[aria-expanded=true]]:shadow-lift">
      <h3 className="text-[1.0625rem] font-semibold">
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex w-full items-start gap-4 px-5 py-5 text-left text-ink hover:text-teal-800"
        >
          {index !== undefined && (
            <span className="tabular flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[0.875rem] font-bold text-white">{index}</span>
          )}
          <span className="flex-1 leading-snug">{title}</span>
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2, ease: ease.out }}
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-hair group-hover:bg-teal-600 group-hover:text-white"
          >
            <Plus size={16} />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: ease.out }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-6 ${index !== undefined ? 'sm:pl-[4.25rem]' : ''}`}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
