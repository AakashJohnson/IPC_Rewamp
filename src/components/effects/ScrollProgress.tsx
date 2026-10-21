import { motion, useScroll, useSpring } from 'motion/react';

/** Thin reading-progress bar along the top edge of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="decor no-print fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-saffron via-teal-600 to-green"
    />
  );
}
