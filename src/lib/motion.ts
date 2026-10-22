import type { Transition, Variants } from 'motion/react';

// Shared motion language: short distances, calm easing, nothing that delays reading.
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  micro: 0.16,
  base: 0.45,
  slow: 0.65,
};

export const spring: Transition = { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
};

export const stagger = (gap = 0.06, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Props for a block that reveals once as it scrolls into view. */
export const inView = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '0px 0px -12% 0px' },
} as const;

/** Grid entrance with a small overshoot (UI UX Pro Max "Stagger List — Standard": scale 0.92, back-out). */
export const pop: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};
