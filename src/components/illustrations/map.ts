import type { ComponentType } from 'react';
import { LabFlask, Microscope, Molecule, ReferenceVials } from './lab';
import { BookStack, Camera, DocumentStack, FormPen, Globe, Institution, MagnifierDoc, MedicalDevice, PulseShield, TrainingCap } from './institution';

type Illus = ComponentType<{ className?: string }>;

// Route-prefix rules for interior page headers; the first match wins.
const ROUTE_RULES: [RegExp, Illus][] = [
  [/^\/news-(highlights|archive)/, DocumentStack],
  [/photo-gallery|media-new|virtual-tour/, Camera],
  [/materiovigilance/, MedicalDevice],
  [/\/pvpi|pharmacovigilance/, PulseShield],
  [/national-formulary-of-india-nfi|iprs|reference-standard/, ReferenceVials],
  [/microbiology|analytical|laboratory|ipl/, Microscope],
  [/skill-development|training|internship/, TrainingCap],
  [/harmoni|related-website|site-map|e-services/, Globe],
  [/indian-pharmacopoeia|\/nfi|publication|library|sections|collections|periodicals|newspapers|e-resources|membership/, BookStack],
  [/form|submission|application/, FormPen],
  [/orders|circulars|careers|tenders|rti|employees|annual-report|minutes/, DocumentStack],
  [/faq|help|search|disclaimer|policy|terms|copyright|hyperlinking/, MagnifierDoc],
  [/departments|biologics|pharmacology|phytopharma|quality-assurance|certification|icmed/, LabFlask],
  [/^\/about-us|contact/, Institution],
];

export function illustrationFor(route: string): Illus {
  return ROUTE_RULES.find(([re]) => re.test(route))?.[1] ?? Molecule;
}

/** Illustration shown in the mega-menu panel for each top-level group. */
export const GROUP_ILLUSTRATION: Record<string, Illus> = {
  'About IPC': Institution,
  'Publications & Standards': BookStack,
  Programmes: PulseShield,
  'Online Services': Globe,
  Notices: DocumentStack,
  More: MagnifierDoc,
};
