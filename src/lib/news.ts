import home from '../content/home.json';
import { daysBetween } from './format';
import type { NewsItem } from './types';

/** "New" is only shown for items published within 14 days of the content snapshot. */
export const isRecent = (item: NewsItem) => !!item.date && daysBetween(item.date, home.snapshotDate) <= 14;

/** Topic colour families (see .accent-* in index.css), so a category reads the same wherever it appears. */
export const TOPIC_ACCENT: Record<string, string> = {
  Recruitment: 'accent-violet',
  'Training & Internships': 'accent-sky',
  Events: 'accent-saffron',
  'Publications & Standards': 'accent-teal',
  'Notices & Tenders': 'accent-coral',
  Announcements: 'accent-saffron',
};
