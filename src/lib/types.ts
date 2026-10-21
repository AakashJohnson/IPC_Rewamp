export type FileKind = 'pdf' | 'doc' | 'xls' | 'ppt' | 'image' | 'zip';

export interface LinkItem {
  label: string;
  /** Internal app route */
  to?: string;
  /** Absolute URL (official file, official transactional page, or external site) */
  href?: string;
  file?: FileKind;
}

export interface NavNode extends LinkItem {
  children?: NavNode[];
  columns?: NavColumn[];
}

export interface NavColumn {
  heading: string;
  items: NavNode[];
}

export interface Navigation {
  main: NavNode[];
  raw: NavNode[];
  footer: LinkItem[];
  related: LinkItem[];
  library: LinkItem[];
}

export interface Crumb {
  label: string;
  href?: string;
}

export type PageKind =
  | 'article' | 'library' | 'contact' | 'news' | 'register' | 'gallery-index' | 'gallery-album'
  | 'faq' | 'links' | 'form' | 'news-index' | 'news-archive' | 'sitemap';

interface PageBase {
  route: string;
  title: string;
  crumbs: Crumb[];
  updated?: string;
  hiUrl: string;
  official: string;
}

export interface BodyPage extends PageBase {
  kind: 'article' | 'library' | 'contact' | 'news';
  bodyHtml: string;
  date?: string;
  category?: string;
}

export interface RegisterRow {
  title: string;
  href?: string;
  internal?: boolean;
  file?: FileKind;
  sizeKB?: number;
  date?: string;
  expiry?: string;
}

export interface RegisterPage extends PageBase {
  kind: 'register';
  rows: RegisterRow[];
  hasExpiry: boolean;
  links: LinkItem[];
}

export interface GalleryAlbumSummary {
  route?: string;
  href?: string;
  title: string;
  count: number;
  cover?: string;
}

export interface GalleryIndexPage extends PageBase {
  kind: 'gallery-index';
  albums: GalleryAlbumSummary[];
}

export interface GalleryImage {
  src: string;
  thumb: string;
  w?: number;
  h?: number;
  caption?: string;
}

export interface GalleryAlbumPage extends PageBase {
  kind: 'gallery-album';
  images: GalleryImage[];
}

export interface FaqPage extends PageBase {
  kind: 'faq';
  items: { q: string; a: string }[];
}

export interface LinksPage extends PageBase {
  kind: 'links';
  links: LinkItem[];
}

export interface FormPage extends PageBase {
  kind: 'form';
  formId: 'training' | 'feedback' | 'monograph-inclusion';
}

export interface SimplePage extends PageBase {
  kind: 'news-index' | 'news-archive' | 'sitemap';
}

export type Page = BodyPage | RegisterPage | GalleryIndexPage | GalleryAlbumPage | FaqPage | LinksPage | FormPage | SimplePage;

export interface NewsItem {
  id: number | null;
  title: string;
  route?: string;
  href?: string;
  date?: string;
  category: string;
  current: boolean;
  archive: boolean;
}

export interface ManifestEntry {
  r: string;
  t: string;
  k: PageKind;
  d?: string;
}
