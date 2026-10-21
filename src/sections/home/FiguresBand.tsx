import { motion } from 'motion/react';
import { Award, BookOpen, FlaskConical, Landmark } from 'lucide-react';
import { CountUp } from '../../components/effects/CountUp';
import { ContourLines, DotMatrix } from '../../components/effects/AnimatedBackdrop';
import { IconBadge } from '../../components/ui/IconBadge';
import { SmartLink } from '../../components/ui/SmartLink';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { ip2026 } from '../../config/site';

// Official figures only: IP 2026 release announcement and Formation of IPC page.
const figures = [
  { icon: BookOpen, value: 3340, label: 'Monographs in the Indian Pharmacopoeia 2026' },
  { icon: FlaskConical, value: 121, label: 'New monographs incorporated in IP 2026' },
  { icon: Award, value: 10, suffix: 'th', label: 'Edition of the IP, released 2 January 2026' },
  { icon: Landmark, value: 2009, from: 1990, grouping: false, label: 'Fully operational as an autonomous body' },
];

export function FiguresBand() {
  return (
    <section aria-label="Key figures" className="on-dark relative overflow-hidden bg-navy-900 py-14 text-white md:py-16">
      <DotMatrix />
      <ContourLines tone="text-white/[0.06]" />
      <div className="container-page relative">
        <motion.ul variants={stagger(0.1)} {...inView} className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-white/10 lg:grid-cols-4">
          {figures.map(f => (
            <motion.li key={f.label} variants={fadeUp} className="group relative bg-navy-900 p-4 sm:p-6 md:p-7">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-saffron via-teal-600 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              <IconBadge icon={f.icon} tone="light" />
              <p className="mt-5">
                <CountUp
                  value={f.value}
                  from={f.from}
                  suffix={f.suffix}
                  grouping={f.grouping ?? true}
                  className="tabular block font-serif text-[2rem] font-semibold leading-none tracking-tight text-white sm:text-[2.5rem] md:text-[3rem]"
                />
                <span className="mt-3 block text-[0.8125rem] leading-snug text-white/70 sm:text-[0.9375rem]">{f.label}</span>
              </p>
            </motion.li>
          ))}
        </motion.ul>
        <p className="mt-4 text-[0.75rem] text-white/50">
          Source: <SmartLink to={ip2026.releaseNews} className="underline underline-offset-2 hover:text-white">release of IP 2026</SmartLink> and <SmartLink to="/about-us/about-ipc" className="underline underline-offset-2 hover:text-white">Formation of IPC</SmartLink>.
        </p>
      </div>
    </section>
  );
}
