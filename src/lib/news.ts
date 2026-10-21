import home from '../content/home.json';
import { daysBetween } from './format';
import type { NewsItem } from './types';

/** "New" is only shown for items published within 14 days of the content snapshot. */
export const isRecent = (item: NewsItem) => !!item.date && daysBetween(item.date, home.snapshotDate) <= 14;
