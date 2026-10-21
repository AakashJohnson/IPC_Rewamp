// Verified institutional content used by the homepage and shell. Every statement is taken from
// www.ipc.gov.in (source route noted) — do not add claims that are not on the official site.

export const institution = {
  nameEn: 'Indian Pharmacopoeia Commission',
  nameHi: 'भारतीय भेषज संहिता आयोग',
  ministryEn: 'Ministry of Health & Family Welfare',
  ministryHi: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय',
  governmentEn: 'Government of India',
  governmentHi: 'भारत सरकार',
};

export const contact = {
  office: 'Office of the Secretary-cum-Scientific Director',
  address: ['Indian Pharmacopoeia Commission', 'Ministry of Health & Family Welfare, Govt. of India', 'Sector-23, Raj Nagar', 'Ghaziabad – 201 002'],
  phones: ['0120-2800500', '0120-2783400', '0120-2783392'],
  emails: [
    { label: 'General queries', email: 'lab.ipc@gov.in' },
    { label: 'Purchase of IP and IPC publications', email: 'publication-ipc@gov.in' },
    { label: 'Purchase of IPRS and impurity standards', email: 'sales-ipc@gov.in' },
  ],
  routeMap: '/about-us/contact-us/route-map-of-ipc',
  source: '/about-us/contact-us',
};

export const social = [
  { label: 'Facebook', href: 'https://www.facebook.com/ipcgzb1/' },
  { label: 'X (Twitter)', href: 'https://twitter.com/ipcgzb' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCy_KW0w36ImIwrUPFhNtcMQ' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ipcgzb' },
];

/** Transactional OpenCart store — stays on the official site. */
export const shop = {
  login: 'https://www.ipc.gov.in/shop/index.php?route=account/login',
  cart: 'https://www.ipc.gov.in/shop/index.php?route=checkout/cart',
  orderIp: 'https://www.ipc.gov.in/shop/index.php?route=product/category&path=59',
  orderNfi: 'https://www.ipc.gov.in/shop/index.php?route=product/category&path=60',
  orderIprs: 'https://www.ipc.gov.in/shop/index.php?route=product/category&path=61',
  search: 'https://www.ipc.gov.in/shop/index.php?route=product/search',
};

export const ipOnline = 'https://iponline.ipc.gov.in/';
export const nfiOnline = 'https://nfionline.ipc.gov.in/';

/** Source: /about-us */
export const about = {
  lead: 'Indian Pharmacopoeia Commission (IPC) is an Autonomous Institution of the Ministry of Health and Family Welfare, Govt. of India. IPC is created to set standards of drugs in the country.',
  standards: 'IP prescribes standards for identity, purity and strength of drugs essentially required from health care perspective of human beings and animals.',
  authority: 'IP standards are authoritative in nature. They are enforced by the Regulatory authorities for quality control of medicines in India.',
  iprs: 'IPC also provides IP Reference Substances (IPRS) which act as a finger print for identification of an article under test and its purity as prescribed in IP.',
  /** Source: /about-us/about-ipc */
  operational: 'The Commission has become fully operational from 1st January, 2009 as an Autonomous Body, fully financed by the Central Government.',
  source: '/about-us',
};

/** Source: /about-us/about-ipc/objectives-of-ipc */
export const missionVision = {
  mission: 'To promote public and animal health in India by bringing out authoritative and officially accepted standards for quality of drugs including active pharmaceutical ingredients, excipients and dosage forms, used by health professionals, patients and consumers.',
  vision: 'To promote the highest standards of drugs for use in human and animals within practical limits of the technologies available for manufacture and analysis.',
  source: '/about-us/about-ipc/objectives-of-ipc',
};

/** Source: IP 2026 release (homepage slide; /news-highlights/1421-…) and /mandates/indian-pharmacopoeia/indian-pharmacopoeia-ip-2026 */
export const ip2026 = {
  edition: '10th edition',
  released: '2 January 2026',
  releasedBy: 'Union Minister for Health and Family Welfare and Chemicals and Fertilizers, Shri J. P. Nadda',
  venue: 'Dr. Ambedkar International Centre, New Delhi',
  newMonographs: '121',
  totalMonographs: '3,340',
  summary: 'The Indian Pharmacopoeia 2026 incorporated 121 new monographs, increasing the total number of monographs to 3,340.',
  legal: 'As per provisions of the Second Schedule of the Drugs and Cosmetics Act 1940, Indian Pharmacopoeia (IP) is the official book of standards for drugs in India.',
  pageRoute: '/mandates/indian-pharmacopoeia/indian-pharmacopoeia-ip-2026',
  releaseNews: '/news-highlights/1421-union-health-minister-shri-j-p-nadda-releases-10th-edition-of-indian-pharmacopoeia-ip-2026',
  amendments: '/news-highlights/1477-indian-pharmacopoeia-2026-amendment-lists',
  introductionPdf: 'https://ipc.gov.in/images/ARnD/Introduction-Pages-IP-2026.pdf',
  releaseNoticePdf: 'https://ipc.gov.in/images/ARnD/IP-Online-Notice-17Jul26.pdf',
  proforma: '/mandates/indian-pharmacopoeia/proforma-invoice-of-ip-publication',
};

/** Programme summaries quote the IPC objectives (/about-us/about-ipc/objectives-of-ipc) and programme pages. */
export const programmes = [
  {
    index: '01',
    title: 'Drug Standards',
    subtitle: 'Indian Pharmacopoeia',
    text: 'To develop comprehensive monographs for drugs to be included in the Indian Pharmacopoeia, including active pharmaceutical ingredients, pharmaceutical aids and dosage forms as well as medical devices.',
    to: '/mandates/indian-pharmacopoeia',
  },
  {
    index: '02',
    title: 'Reference Standards',
    subtitle: 'IPRS & Impurity Standards',
    text: 'IP Reference Substances (IPRS) are issued by the Indian Pharmacopoeia Commission. They are the official standards to be used in cases of arbitration.',
    to: '/mandates/national-formulary-of-india-nfi/about-iprs',
  },
  {
    index: '03',
    title: 'Pharmacovigilance',
    subtitle: 'PvPI',
    text: 'IPC acts as the National Coordination Centre for the Pharmacovigilance Programme of India.',
    to: '/mandates/pvpi/pharmacovigilance-skill-development-programme',
  },
  {
    index: '04',
    title: 'Materiovigilance',
    subtitle: 'MvPI',
    text: 'Commenced on July 6, 2015 to monitor the safety of medical devices in the country. IPC functions as National Coordination Centre since 2018.',
    to: '/mandates/materiovigilance-programme-of-india-mvpi/about-us',
  },
  {
    index: '05',
    title: 'National Formulary',
    subtitle: 'NFI',
    text: 'To publish the National Formulary of India for updating medical practitioners and other healthcare professionals.',
    to: '/mandates/nfi/about-nfi',
  },
  {
    index: '06',
    title: 'Harmonization',
    subtitle: 'Pharmacopoeial Discussion Group',
    text: 'To collaborate with pharmacopoeias like the Ph Eur, BP, USP, JP, ChP and International Pharmacopoeia with a view to harmonizing with global standards.',
    to: '/pharmacopoeial-harmonization',
  },
];
