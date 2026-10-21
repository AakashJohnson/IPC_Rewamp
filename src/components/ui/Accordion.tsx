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
    <div className="border-b border-line">
      <h3 className="text-[1.0625rem] font-semibold">
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex w-full items-start gap-4 py-5 text-left text-ink hover:text-teal-800"
        >
          {index !== undefined && (
            <span className="tabular mt-0.5 w-7 shrink-0 text-[0.875rem] font-semibold text-muted">{String(index).padStart(2, '0')}</span>
          )}
          <span className="flex-1 leading-snug">{title}</span>
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2, ease: ease.out }}
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-teal-700 group-hover:border-teal-600/50"
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
            <div className={`pb-6 ${index !== undefined ? 'pl-11' : ''} pr-11`}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
