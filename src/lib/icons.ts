import {
  Award, BookMarked, BookOpen, Building2, CalendarDays, ClipboardList, Contact, Dna, FileBadge, FilePen,
  FileSpreadsheet, FileText, FlaskConical, Gavel, Globe, GraduationCap, HeartPulse, Images, Landmark, Library,
  Mail, Megaphone, Microscope, Newspaper, Phone, Pill, Scale, ScrollText, Search, ShieldCheck, Stethoscope, Users,
  Wallet, Briefcase, Network, Map as MapIcon, Leaf, TestTube, type LucideIcon,
} from 'lucide-react';

// Keyword → icon vocabulary used for menu entries, child-page cards and document rows.
// First match wins, so more specific patterns come first.
const RULES: [RegExp, LucideIcon][] = [
  [/materiovigilance|mvpi|medical device|mdmc/i, Stethoscope],
  [/pharmacovigilance|pvpi|\badr\b|haemovigilance/i, HeartPulse],
  [/phyto|herbal|botanical/i, Leaf],
  [/reference (substance|standard)|iprs|impurit|prednisone|calibrat/i, FlaskConical],
  [/monograph|draft|amendment|comment/i, FilePen],
  [/formulary|\bnfi\b/i, BookMarked],
  [/pharmacopoeia|\bip\b|addend|general notices/i, BookOpen],
  [/guidance|guideline|manual|\bsops?\b|toolkit/i, ClipboardList],
  [/biolog|vaccine|\bgene\b|\bcell/i, Dna],
  [/microbio|culture|mtcc/i, Microscope],
  [/analytical|laboratory|\bipl\b|testing|cough syrup/i, TestTube],
  [/pharmacology/i, Pill],
  [/quality|accredit|proficiency|certif|\biso\b/i, ShieldCheck],
  [/harmoni|\bpdg\b|international|collaborat|\bmou\b/i, Globe],
  [/train|skill|internship|education|workshop/i, GraduationCap],
  [/library|\bbooks?\b|periodical|newspaper|e-resource|collection/i, Library],
  [/finance|budget|account|audit|\bcash\b/i, Wallet],
  [/admin|\bstore\b|supply chain|employee/i, Building2],
  [/committee|working group|composition|organi[sz]ational/i, Users],
  [/message|minister|secretary|director/i, Landmark],
  [/\bnews\b|highlight|press|media/i, Newspaper],
  [/\bevents?\b|\bweek\b|conclave/i, CalendarDays],
  [/gallery|photo|virtual tour|alrc/i, Images],
  [/circular|\borders?\b|notice/i, ScrollText],
  [/tender|procure/i, Gavel],
  [/career|recruit|vacan/i, Briefcase],
  [/\brti\b|right to information|\bact\b|bye ?laws|charter/i, Scale],
  [/contact|route map/i, Contact],
  [/social|facebook|twitter/i, Megaphone],
  [/\bforms?\b|application|enrol|submission/i, FileBadge],
  [/annual report|\breports?\b|outcome|publication|newsletter/i, FileSpreadsheet],
  [/mission|vision|objective|award/i, Award],
  [/website|\blinks?\b|online|e-service|network/i, Network],
  [/site ?map/i, MapIcon],
  [/\bfaq\b|\bhelp\b|search/i, Search],
  [/phone|\btel\b/i, Phone],
  [/\bmail/i, Mail],
  [/about|formation|\bipc\b/i, Building2],
];

export function iconFor(label: string): LucideIcon {
  return RULES.find(([re]) => re.test(label))?.[1] ?? FileText;
}

export const TOPIC_ICONS: Record<string, LucideIcon> = {
  Recruitment: Briefcase,
  'Training & Internships': GraduationCap,
  Events: CalendarDays,
  'Publications & Standards': BookOpen,
  'Notices & Tenders': ScrollText,
  Announcements: Megaphone,
};

export const topicIcon = (topic: string) => TOPIC_ICONS[topic] ?? Megaphone;
