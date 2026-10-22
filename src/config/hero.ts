// Homepage hero slides. Every sentence is taken from www.ipc.gov.in (source route noted per slide).
// Art: generated with Canva (see README, "Asset provenance"). Leader art is a generated likeness made from the
// official IPC carousel portrait and is always captioned "Digital illustration". No text or logos in any art.
// Do not add claims that are not on the official site.
import { about, ip2026, shop } from './site';

export type Accent = 'teal' | 'saffron' | 'sky' | 'violet' | 'coral';

export interface ResponsiveImage {
  /** Path stem under /images, e.g. 'scenes/research-centre' → /images/scenes/research-centre-768.avif */
  stem: string;
  widths: number[];
  width: number;
  height: number;
}

interface Link {
  label: string;
  to?: string;
  href?: string;
}

export interface HeroSlide {
  id: string;
  /** Short name for the slide picker */
  label: string;
  accent: Accent;
  context: string;
  title: string;
  body: string;
  quote?: { text: string; cite: string };
  facts?: { value: string; label: string }[];
  cta: Link;
  secondary?: Link;
  /** The slide's art, shown inside the capsule-shaped panel. */
  art: ResponsiveImage & { position: string; alt: string };
  /** Leader slides: name plate shown over the art, with a "Digital illustration" caption. */
  person?: { name: string; role: string };
  /** A short word set enormous and outlined on a depth layer behind the art. */
  word: string;
}

const art = (stem: string, position: string, alt: string) => ({
  stem: `generated/${stem}`,
  widths: [768, 1280, 1920],
  width: 1920,
  height: 1080,
  position,
  alt,
});

export const heroSlides: HeroSlide[] = [
  {
    id: 'prime-minister',
    label: 'Prime Minister',
    accent: 'sky',
    context: 'Inaugurated by the Prime Minister on 25 February 2024',
    title: 'Advance Level Research Centre',
    body: 'Prime Minister Shri Narendra Modi virtually inaugurated the Advance Level Research Centre (ALRC) at the Indian Pharmacopoeia Commission, Ghaziabad. ALRC will serve the nation as a hub for cutting-edge research, innovation and training in pharmacopoeia standards-setting, pharmacovigilance and other allied areas.',
    cta: {
      label: 'Read the announcement',
      to: '/news-highlights/1269-prime-minister-virtually-inaugurated-advance-level-research-centre-alrc-at-indian-pharmacopoeia-commission,-ghaziabad-on-25th-february-2024',
    },
    secondary: { label: 'Progress of ALRC', to: '/about-us/media-new/progress-of-alrc' },
    art: art('leader-modi', '62% 30%', 'Digital illustration of Prime Minister Shri Narendra Modi in a modern pharmaceutical research laboratory'),
    person: { name: 'Shri Narendra Modi', role: 'Hon’ble Prime Minister of India' },
    word: 'ALRC',
    // Source: /news-highlights/1269 (ALRC inauguration)
  },
  {
    id: 'union-health-minister',
    label: 'Union Health Minister',
    accent: 'saffron',
    context: 'Shri Jagat Prakash Nadda',
    title: 'Message from the Union Health Minister',
    body: 'From the Hon’ble Union Minister’s message to the Commission, as published on the official IPC website.',
    quote: {
      text: 'I commend the Indian Pharmacopoeia Commission (IPC) for its unwavering commitment for ensuring the highest standards of quality and safety in medicines.',
      cite: 'Shri Jagat Prakash Nadda',
    },
    cta: { label: 'Read the full message', to: '/about-us/message-from-minister-of-health-family-welfare-and-chemicals-fertilizers' },
    secondary: { label: 'Release of IP 2026', to: ip2026.releaseNews },
    art: art('leader-nadda', '64% 30%', 'Digital illustration of Shri Jagat Prakash Nadda in a pharmaceutical quality-control laboratory'),
    person: { name: 'Shri Jagat Prakash Nadda', role: 'Hon’ble Union Minister of Health & Family Welfare and Chemicals & Fertilizers, Government of India' },
    word: 'Quality',
    // Source: /about-us/message-from-minister-of-health-family-welfare-and-chemicals-fertilizers (official message slide)
  },
  {
    id: 'minister-of-state',
    label: 'Minister of State',
    accent: 'coral',
    context: 'Released on 21 September 2026',
    title: 'National Formulary of India 2026',
    body: 'Hon’ble Minister of State for Health & Family Welfare and Chemicals & Fertilizers, Smt. Anupriya Patel, released the 7th Edition of the National Formulary of India at the 6th National Pharmacovigilance Week organised by IPC at Dr. Ambedkar International Centre, New Delhi.',
    facts: [
      { value: '7th', label: 'edition' },
      { value: '653', label: 'monographs' },
      { value: '83', label: 'new monographs' },
    ],
    cta: {
      label: 'Read the announcement',
      to: '/news-highlights/1512-hon’ble-minister-of-state-for-health-family-welfare-and-chemicals-fertilizers,-government-of-india,-smt-anupriya-patel-releases-the-7th-edition-of-national-formulary-of-india-nfi-2026',
    },
    secondary: { label: 'Message from the Minister of State', to: '/about-us/message-of-the-hon-ble-minister-of-state-for-health-family-welfare-and-chemicals-fertilizers' },
    art: art('leader-patel', '66% 30%', 'Digital illustration of Smt. Anupriya Patel beside an open formulary in a pharmacy office'),
    person: { name: 'Smt. Anupriya Patel', role: 'Hon’ble Minister of State, Health & Family Welfare and Chemicals & Fertilizers, Government of India' },
    word: 'NFI',
    // Source: /news-highlights/1512 (NFI 2026 release) and the official Minister of State message slide
  },
  {
    id: 'indian-pharmacopoeia-2026',
    label: 'Indian Pharmacopoeia 2026',
    accent: 'teal',
    context: `Released ${ip2026.released}`,
    title: 'Indian Pharmacopoeia 2026',
    body: `${ip2026.legal} The ${ip2026.edition} incorporated ${ip2026.newMonographs} new monographs.`,
    facts: [
      { value: '10th', label: 'edition' },
      { value: ip2026.newMonographs, label: 'new monographs' },
      { value: ip2026.totalMonographs, label: 'monographs in total' },
    ],
    cta: { label: 'Explore IP 2026', to: ip2026.pageRoute },
    secondary: { label: 'Order the IP', href: shop.orderIp },
    art: art('ip-volumes', '62% 50%', 'Four pharmacopoeia volumes in a slipcase on a laboratory shelf (illustrative image)'),
    word: 'IP 2026',
    // Source: /mandates/indian-pharmacopoeia/indian-pharmacopoeia-ip-2026 and the IP 2026 release announcement
  },
  {
    id: 'reference-substances',
    label: 'Reference standards',
    accent: 'violet',
    context: 'Official standards for identification and purity',
    title: 'IP Reference Substances',
    body: `${about.iprs} They are the official standards to be used in cases of arbitration.`,
    cta: { label: 'IPRS & impurity standards', to: '/mandates/national-formulary-of-india-nfi/about-iprs' },
    secondary: { label: 'Purchase IPRS', href: shop.orderIprs },
    art: art('iprs-vials', '72% 50%', 'Clear and amber reference-standard vials in a rack (illustrative image)'),
    word: 'IPRS',
    // Source: /about-us and /mandates/national-formulary-of-india-nfi/about-iprs
  },
];

/** Builds srcset strings for the AVIF and WebP variants produced by scripts/optimize-images.mjs. */
export function srcSets(img: ResponsiveImage) {
  const set = (ext: string) => img.widths.map(w => `/images/${img.stem}-${w}.${ext} ${w}w`).join(', ');
  return { avif: set('avif'), webp: set('webp'), fallback: `/images/${img.stem}-${img.widths[img.widths.length - 1]}.webp` };
}
