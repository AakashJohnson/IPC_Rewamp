import { useState } from 'react';
import { motion } from 'motion/react';
import { Images } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { PageCanvas } from '../components/ui/PageCanvas';
import { SmartLink } from '../components/ui/SmartLink';
import { Lightbox } from '../components/ui/Lightbox';
import { EmptyState } from '../components/ui/EmptyState';
import { SourceNote } from './shared';
import { fadeUp, stagger } from '../lib/motion';
import { usePageSetup } from '../lib/page-context';
import type { GalleryAlbumPage, GalleryIndexPage } from '../lib/types';

const galleryCrumbs = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Gallery', href: '/about-us/media-new' },
];

export function GalleryIndexTemplate({ page }: { page: GalleryIndexPage }) {
  usePageSetup('Photo Gallery', page.hiUrl);
  return (
    <>
      <PageHeader
        title="Photo Gallery"
        crumbs={galleryCrumbs}
        eyebrow="Media"
        lead={`${page.albums.length} albums of events, meetings, workshops and visits at the Indian Pharmacopoeia Commission.`}
        printable={false}
      />
      <PageCanvas>
      <div className="container-page py-12 md:py-16">
        <motion.ul variants={stagger(0.03)} initial="hidden" animate="visible" className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {page.albums.map(a => (
            <motion.li key={a.route ?? a.href} variants={fadeUp}>
              <SmartLink to={a.route} href={a.href} className="tex-card edge-glow tilt group relative block overflow-hidden rounded-[var(--radius-xl)] bg-white p-2 shadow-hair">
                <span aria-hidden className="glare" />
                <span className="relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-paper-2">
                  {a.cover && (
                    <img
                      src={a.cover}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  )}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-navy-950/80 px-2.5 py-1 text-[0.75rem] font-semibold text-white">
                    <Images aria-hidden size={13} /> {a.count} {a.count === 1 ? 'photo' : 'photos'}
                  </span>
                </span>
                <span className="block px-2 pb-2 pt-3 font-semibold leading-snug text-ink group-hover:text-teal-800">{a.title}</span>
              </SmartLink>
            </motion.li>
          ))}
        </motion.ul>
        <SourceNote official={page.official} />
      </div>
      </PageCanvas>
    </>
  );
}

export function GalleryAlbumTemplate({ page }: { page: GalleryAlbumPage }) {
  usePageSetup(page.title, page.hiUrl);
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <PageHeader
        title={page.title}
        crumbs={[...galleryCrumbs, { label: 'Photo Gallery', href: '/about-us/media-new/photo-gallery' }]}
        eyebrow="Photo Gallery"
        meta={<span>{page.images.length} {page.images.length === 1 ? 'photo' : 'photos'}</span>}
        printable={false}
      />
      <PageCanvas>
      <div className="container-page py-12 md:py-16">
        {page.images.length ? (
          <motion.ul variants={stagger(0.025)} initial="hidden" animate="visible" className="columns-2 gap-4 md:columns-3 xl:columns-4">
            {page.images.map((img, i) => (
              <motion.li key={img.src} variants={fadeUp} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="tilt group relative block w-full overflow-hidden rounded-[var(--radius-lg)] bg-paper-2 shadow-hair"
                >
                  <img
                    src={img.src}
                    alt={img.caption ?? `${page.title} — photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    width={img.w}
                    height={img.h}
                    className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="sr-only">Open photo {i + 1} of {page.images.length}</span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <EmptyState title="This album has no photos" />
        )}
        <SourceNote official={page.official} />
      </div>
      <Lightbox images={page.images} index={index} albumTitle={page.title} onChange={setIndex} />
      </PageCanvas>
    </>
  );
}
