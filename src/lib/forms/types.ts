export type FieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea' | 'select' | 'radio' | 'file' | 'declaration' | 'table';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: FieldOption[];
  /** For 'file' fields */
  accept?: string;
  /** HTML pattern + message for simple client-side validation */
  pattern?: string;
  patternMessage?: string;
  maxLength?: number;
  /** Only shown (and validated) when another field has one of these values */
  showWhen?: { field: string; equals: string[] };
  /** For 'table' fields */
  columns?: { name: string; label: string; required?: boolean }[];
  rows?: number;
  /** Half-width on wide screens */
  half?: boolean;
}

export interface FieldsetDefinition {
  legend: string;
  fields: FieldDefinition[];
}

export interface FormDefinition {
  id: 'training' | 'feedback' | 'monograph-inclusion';
  title: string;
  intro: string;
  /** Official recipient(s) named on the IPC website */
  to: string[];
  cc?: string[];
  recipientSource: { label: string; to: string };
  fieldsets: FieldsetDefinition[];
  related?: { label: string; to: string }[];
}

export type FieldValue = string | string[][] | File | null;
export type FormValues = Record<string, FieldValue>;
