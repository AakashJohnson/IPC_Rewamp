import type { FormDefinition } from '../lib/forms/types';

// Field lists mirror the forms on www.ipc.gov.in. Server-only steps of the original forms
// (OTP verification, captcha, upload storage) cannot run without a backend; see submit-adapter.ts.

const MOBILE = { pattern: '^[0-9+\\- ]{10,15}$', patternMessage: 'Enter a valid mobile number (10 digits).' };
const PIN = { pattern: '^[0-9]{6}$', patternMessage: 'Enter a 6-digit PIN code.' };
const AADHAAR = { pattern: '^[0-9 ]{12,14}$', patternMessage: 'Enter the 12-digit Aadhaar number.' };

export const FORMS: Record<FormDefinition['id'], FormDefinition> = {
  training: {
    id: 'training',
    title: 'Application Form for Training / Project Work at IPC, Ghaziabad',
    intro: 'Training form should be duly filled and submitted by email. Essential documents: College Recommendation Letter; College Approval letter / NOC for Co-guide from IPC and Project Title (for Ph.D., M. Pharm and M.Sc. students).',
    to: ['qualityassurance-ipc@gov.in'],
    cc: ['lab.ipc@gov.in'],
    recipientSource: { label: 'Skill Development', to: '/mandates/skill-development' },
    related: [{ label: 'Skill Development — training periods and fees', to: '/mandates/skill-development' }],
    fieldsets: [
      {
        legend: 'Training Details',
        fields: [
          { name: 'training_name', label: 'Name of the Training', type: 'text', required: true },
          { name: 'duration_from', label: 'Duration of the Training — From', type: 'date', required: true, half: true },
          { name: 'duration_to', label: 'Duration of the Training — To', type: 'date', required: true, half: true },
          {
            name: 'stream', label: 'Stream', type: 'select', required: true,
            options: ['Pharmaceuticals Analysis', 'Chemistry', 'Microbiology', 'Biologics', 'Phytopharmaceuticals', 'PvPI', 'Others']
              .map(v => ({ value: v, label: v })),
          },
          { name: 'stream_other', label: 'Please specify other stream', type: 'text', required: true, showWhen: { field: 'stream', equals: ['Others'] } },
        ],
      },
      {
        legend: 'Details of Candidate',
        fields: [
          { name: 'candidate_name', label: 'Name of the Candidate', type: 'text', required: true, half: true },
          { name: 'father_name', label: "Father's Name", type: 'text', required: true, half: true },
          { name: 'dob', label: 'Date of Birth', type: 'date', required: true, half: true },
          { name: 'mobile', label: 'Mobile No.', type: 'tel', required: true, half: true, ...MOBILE },
          { name: 'email', label: 'Email', type: 'email', required: true, half: true },
          { name: 'aadhaar', label: 'Aadhaar Card No.', type: 'text', required: true, half: true, ...AADHAAR },
          { name: 'photo', label: 'Upload Image', type: 'file', required: true, accept: 'image/*', hint: 'Passport-size photograph.' },
        ],
      },
      {
        legend: 'Institute Details',
        fields: [
          { name: 'institute_name', label: 'Name of the Institute', type: 'text', required: true },
          { name: 'institute_address', label: 'Address of the Institute', type: 'textarea', required: true },
          { name: 'institute_pin', label: 'Pin Code', type: 'text', required: true, half: true, ...PIN },
          { name: 'institute_phone', label: 'Phone No.', type: 'tel', required: true, half: true },
          { name: 'institute_email', label: 'Email', type: 'email', required: true },
        ],
      },
      {
        legend: 'Educational Qualification',
        fields: [
          {
            name: 'qualifications', label: 'Educational qualifications', type: 'table', rows: 4,
            hint: 'The first row is required.',
            columns: [
              { name: 'degree', label: 'Degree', required: true },
              { name: 'institution', label: 'Name of University/College', required: true },
              { name: 'subjects', label: 'Subjects', required: true },
              { name: 'score', label: 'Class / %age Obtained', required: true },
              { name: 'year', label: 'Year of Passing', required: true },
              { name: 'specialisation', label: 'Specialization, if any' },
            ],
          },
        ],
      },
      {
        legend: 'Declaration',
        fields: [
          {
            name: 'declaration', type: 'declaration', required: true,
            label: 'I hereby declare that all the above information provided by me are true to the best of my knowledge, if any false information is found my application may be rejected.',
          },
        ],
      },
    ],
  },

  feedback: {
    id: 'feedback',
    title: 'Feedback Form',
    intro: 'Share feedback, suggestions or queries about the Indian Pharmacopoeia Commission or this website.',
    to: ['lab.ipc@gov.in'],
    recipientSource: { label: 'Contact Us', to: '/about-us/contact-us' },
    fieldsets: [
      {
        legend: 'Your details',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true, half: true },
          { name: 'email', label: 'Email', type: 'email', required: true, half: true },
          { name: 'phone', label: 'Phone', type: 'tel', half: true, ...MOBILE },
          { name: 'address', label: 'Address', type: 'textarea', placeholder: 'Enter your address' },
        ],
      },
      {
        legend: 'Feedback',
        fields: [
          { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Please include as much detail as possible.', maxLength: 1500 },
        ],
      },
    ],
  },

  'monograph-inclusion': {
    id: 'monograph-inclusion',
    title: 'Monograph Inclusion Request Form',
    intro: 'Request the inclusion of a monograph in the Indian Pharmacopoeia. Review the Monographs Inclusion-Exclusion Criteria before submitting.',
    to: ['lab.ipc@gov.in'],
    recipientSource: { label: 'Draft monographs for comments', to: '/mandates/indian-pharmacopoeia/monographs/monographs-under-preparation' },
    related: [
      { label: 'Monographs Inclusion-Exclusion Criteria', to: '/mandates/indian-pharmacopoeia/monographs-inclusion-exclusion-criteria' },
      { label: 'Guidance Document for Drafting and Formatting of Monographs', to: '/mandates/indian-pharmacopoeia/guideline-for-formatting-of-monographs' },
    ],
    fieldsets: [
      {
        legend: 'Applicant',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true, half: true },
          { name: 'mobile', label: 'Mobile Number', type: 'tel', required: true, half: true, ...MOBILE },
          { name: 'email', label: 'Email ID', type: 'email', required: true, half: true },
          { name: 'organization', label: 'Organization Name', type: 'text', required: true, half: true },
          { name: 'organization_type', label: 'Organization Type', type: 'text', required: true },
        ],
      },
      {
        legend: 'Proposed monograph',
        fields: [
          { name: 'molecule', label: 'Name of the Molecule', type: 'text', required: true, half: true },
          { name: 'therapeutic_category', label: 'Therapeutic Category', type: 'text', required: true, half: true },
          {
            name: 'monograph', label: 'Monograph', type: 'radio', required: true,
            options: [{ value: 'API', label: 'API' }, { value: 'Dosage Form', label: 'Dosage Form' }, { value: 'Other', label: 'Other' }],
          },
          { name: 'monograph_other', label: 'Please specify', type: 'text', required: true, showWhen: { field: 'monograph', equals: ['Other'] } },
          {
            name: 'cdsco_approval', label: 'CDSCO approval status', type: 'radio', required: true,
            options: [{ value: 'API', label: 'API' }, { value: 'Dosage Form', label: 'Dosage Form' }, { value: 'Both', label: 'Both' }],
          },
          { name: 'dosage_form', label: 'In case of Dosage Form, provide details wrt for how long product is being marketed in India?', type: 'textarea' },
          { name: 'approval_doc', label: 'Approval status in India (Upload)', type: 'file', required: true },
          { name: 'product_details', label: 'Details of the Product / Companies Marketing Product', type: 'textarea', required: true },
          { name: 'manufacturers_doc', label: 'Manufacturers identified (name, address)', type: 'file', required: true },
          { name: 'benchmark', label: 'Benchmark – International Product / Company', type: 'textarea', required: true },
        ],
      },
      {
        legend: 'Category and supporting documents',
        fields: [
          {
            name: 'category', label: 'Category', type: 'radio', required: true,
            options: ['National Health Programs of India', 'Essential Medicines List', 'Fixed Dose Combination', 'Any Other'].map(v => ({ value: v, label: v })),
          },
          { name: 'category_other', label: 'Please specify', type: 'text', required: true, showWhen: { field: 'category', equals: ['Any Other'] } },
          { name: 'draft_monograph', label: 'Draft Monograph in IP Format', type: 'file', required: true },
          { name: 'coa', label: 'Certificate of Analysis of at least 3 batches/lots samples & impurities', type: 'file', required: true },
          {
            name: 'verification', label: 'Whether willing to provide Reference standards/ samples/ impurities for monograph verification', type: 'radio', required: true,
            options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }],
          },
          { name: 'justification', label: 'Justification of Inclusion of Monograph', type: 'textarea', required: true },
        ],
      },
    ],
  },
};
