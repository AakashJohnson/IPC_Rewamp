const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT = MONTHS.map(m => m.slice(0, 3));

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

/** 2026-10-21 → 21 October 2026 */
export function formatDate(iso?: string): string {
  if (!iso) return '';
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** 2026-10-21 → { day: '21', month: 'Oct', year: '2026' } for stacked date blocks */
export function dateBlock(iso?: string) {
  if (!iso) return undefined;
  const { y, m, d } = parts(iso);
  return { day: String(d).padStart(2, '0'), month: SHORT[m - 1], year: String(y) };
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(toIso) - Date.parse(fromIso)) / 86_400_000);
}

export function formatSize(kb?: number): string {
  if (!kb) return '';
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export const FILE_LABEL: Record<string, string> = { pdf: 'PDF', doc: 'DOC', xls: 'XLS', ppt: 'PPT', image: 'Image', zip: 'ZIP' };
