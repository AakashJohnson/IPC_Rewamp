import { Suspense, use } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Images } from 'lucide-react';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { SmartLink } from '../../components/ui/SmartLink';
import { loadPage } from '../../lib/content';
import { fadeUp, inView, stagger } from '../../lib/motion';
import { ip2026 } from '../../config/site';
import { Camera } from '../../components/illustrations';
import type { GalleryIndexPage } from '../../lib/types';

const GALLERY = '/about-us/media-new/photo-gallery';

function Albums() {
  const page = use(loadPage(GALLERY)) as GalleryIndexPage | null;
  const albums = page?.albums.slice(0, 3) ?? [];
  return (
    <motion.ul variants={stagger(0.07)} {...inView} className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
      {albums.map(a => (
        <motion.li key={a.route ?? a.href} variants={fadeUp}>
          <SmartLink to={a.route} href={a.href} className="group grid grid-cols-[7rem_1fr] items-center gap-4 sm:grid-cols-1 lg:grid-cols-[8.5rem_1fr]">
            <span className="block aspect-[4/3] overflow-hidden rounded-sm border border-line bg-paper-2">
              {a.cover && <img src={a.cover} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />}
            </span>
            <span>
              <span className="line-clamp-2 block text-[0.9375rem] font-semibold leading-snug text-ink group-hover:text-teal-800">{a.title}</span>
              <span className="mt-1 block text-meta text-muted">{a.count} photos</span>
            </span>
          </SmartLink>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function InstitutionalGallery() {
  return (
    <section aria-labelledby="gallery-title" className="relative overflow-hidden border-t border-line bg-white py-16 md:py-24">
      <Camera className="decor pointer-events-none absolute -right-6 top-10 hidden w-48 opacity-80 xl:block" />
      <div className="container-page relative">
        <SectionHeading
          id="gallery-title"
          index="09"
          eyebrow="Media"
          title="From the Commission"
          action={{ label: 'Open the photo gallery', to: GALLERY }}
        />
        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:gap-10">
          <motion.figure variants={fadeUp} {...inView} className="lg:col-span-8">
            <SmartLink to={ip2026.releaseNews} className="group block">
              <span className="block overflow-hidden rounded-sm border border-line bg-paper">
                <img
                  src="/images/official/ip-2026-launch-1600.webp"
                  srcSet="/images/official/ip-2026-launch-800.webp 800w, /images/official/ip-2026-launch-1600.webp 1600w"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  width={1600}
                  height={657}
                  loading="lazy"
                  decoding="async"
                  alt="Union Health Minister Shri J. P. Nadda releases the 10th edition of the Indian Pharmacopoeia (IP 2026) at Dr. Ambedkar International Centre, New Delhi, on 2 January 2026"
                  className="block w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                />
              </span>
              <figcaption className="mt-4 flex items-start justify-between gap-4">
                <span>
                  <span className="block font-semibold text-ink group-hover:text-teal-800">Release of the 10th edition of the Indian Pharmacopoeia</span>
                  <span className="mt-1 block text-meta text-muted">{ip2026.released} · {ip2026.venue}</span>
                </span>
                <ArrowRight aria-hidden size={18} className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-teal-700" />
              </figcaption>
            </SmartLink>
          </motion.figure>
          <div className="lg:col-span-4">
            <p className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">
              <Images aria-hidden size={14} /> Photo albums
            </p>
            <div className="mt-4">
              <Suspense fallback={<div className="h-64 rounded-sm bg-paper" aria-hidden />}>
                <Albums />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
