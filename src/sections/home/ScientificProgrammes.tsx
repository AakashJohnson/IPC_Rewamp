import type { ComponentType } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartLink } from '../../components/ui/SmartLink';
import { Spotlight } from '../../components/effects/Interactive';
import { MoleculeField } from '../../components/effects/AnimatedBackdrop';
import { BookStack, Globe, MedicalDevice, Molecule, PulseShield, ReferenceVials } from '../../components/illustrations';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { programmes } from '../../config/site';

// One illustration per programme, in the order of `programmes` in config/site.ts.
const ART: ComponentType<{ className?: string }>[] = [BookStack, ReferenceVials, PulseShield, MedicalDevice, Molecule, Globe];

export function ScientificProgrammes() {
  return (
    <section aria-labelledby="programmes-title" className="relative overflow-hidden bg-paper py-16 md:py-24">
      <MoleculeField tone="text-teal-700/[0.07]" mask="edges" />
      <div className="container-page relative">
        <SectionHeading
          id="programmes-title"
          index="05"
          eyebrow="Mandate"
          title="Programmes & scientific functions"
          intro="The work of the Commission, as set out in its objectives — from drug standards to the safety monitoring of medicines and medical devices."
        />
        <motion.ul variants={stagger(0.08)} {...inView} className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {programmes.map((p, i) => {
            const Art = ART[i];
            return (
              <motion.li key={p.title} variants={fadeUp}>
                <Spotlight className="h-full overflow-hidden rounded-md border border-line bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-teal-600/40 hover:shadow-lift">
                  <SmartLink to={p.to} className="group flex h-full flex-col">
                    <span className="relative flex h-44 items-center justify-center overflow-hidden border-b border-line bg-gradient-to-br from-teal-50 via-white to-paper">
                      <span aria-hidden className="decor texture-grid absolute inset-0 opacity-70" />
                      <span
                        aria-hidden
                        data-index={p.index}
                        className="absolute left-5 top-4 font-serif text-[2.25rem] font-semibold leading-none text-navy-900/15 before:content-[attr(data-index)]"
                      />
                      <Art className="relative h-40 w-auto transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04]" />
                    </span>
                    <span className="flex flex-1 flex-col p-6">
                      <span className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal-700">{p.subtitle}</span>
                      <span className="mt-2 block text-h3 font-semibold text-ink">{p.title}</span>
                      <span className="mt-3 block flex-1 text-[0.9375rem] leading-relaxed text-muted">{p.text}</span>
                      <span className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-teal-700">
                        Learn more <ArrowRight aria-hidden size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </span>
                  </SmartLink>
                </Spotlight>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
