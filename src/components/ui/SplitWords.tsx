import { Fragment } from 'react';
import { motion, type Variants } from 'motion/react';
import { ease } from '../../lib/motion';

const container = (delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
});
const word: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.8, ease: ease.out } },
};

/**
 * Splits a heading into words that rise from behind a mask. The full text stays in the accessibility tree
 * (aria-label on the wrapper is not used: the words are real text, read in order). Reduced motion is
 * handled globally by MotionConfig, which drops the travel.
 */
export function SplitWords({ text, delay = 0, inView = true }: { text: string; delay?: number; inView?: boolean }) {
  const words = text.split(' ');
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : { initial: 'hidden', animate: 'visible' };
  return (
    <motion.span variants={container(delay)} {...trigger} className="inline">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-word"><motion.span variants={word}>{w}</motion.span></span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.span>
  );
}
