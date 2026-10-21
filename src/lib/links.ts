import type { FileKind } from './types';

export function fileKindOf(href?: string): FileKind | undefined {
  if (!href) return undefined;
  const h = href.toLowerCase().split('#')[0];
  const file = h.match(/download\.php\?f=([^&]+)/)?.[1] ?? h.split('?')[0];
  const ext = file.match(/\.([a-z0-9]{2,5})$/)?.[1];
  if (!ext) return undefined;
  if (ext === 'pdf') return 'pdf';
  if (ext === 'doc' || ext === 'docx') return 'doc';
  if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'xls';
  if (ext === 'ppt' || ext === 'pptx') return 'ppt';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (ext === 'zip' || ext === 'rar') return 'zip';
  return undefined;
}

export const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href);

/** Host label for external links ("cdsco.gov.in"), used as supporting metadata. */
export function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
