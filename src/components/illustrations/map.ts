import type { ComponentType } from 'react';
import { BookStack, DocumentStack, Globe, Institution, MagnifierDoc, PulseShield } from './institution';

type Illus = ComponentType<{ className?: string }>;

/** Illustration shown in the mega-menu panel for each top-level group. */
export const GROUP_ILLUSTRATION: Record<string, Illus> = {
  'About IPC': Institution,
  'Publications & Standards': BookStack,
  Programmes: PulseShield,
  'Online Services': Globe,
  Notices: DocumentStack,
  More: MagnifierDoc,
};
