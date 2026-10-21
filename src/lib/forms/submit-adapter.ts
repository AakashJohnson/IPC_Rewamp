import type { FieldDefinition, FormDefinition, FormValues } from './types';

// All form submissions go through one adapter so a real API can replace e-mail without touching the UI.
// The default adapter prepares an e-mail to the official address published on the IPC website.

export interface SubmissionResult {
  ok: boolean;
  /** Shown to the user after submitting */
  message: string;
  /** Files the user must attach manually (mail clients cannot receive attachments from a link) */
  attachments: string[];
}

export interface SubmitAdapter {
  submit(form: FormDefinition, values: FormValues): Promise<SubmissionResult>;
}

const visible = (f: FieldDefinition, values: FormValues) =>
  !f.showWhen || f.showWhen.equals.includes(String(values[f.showWhen.field] ?? ''));

/** Plain-text summary of the submission, grouped by fieldset. */
export function summarise(form: FormDefinition, values: FormValues) {
  const lines: string[] = [form.title, ''];
  const attachments: string[] = [];
  for (const fs of form.fieldsets) {
    lines.push(fs.legend.toUpperCase());
    for (const f of fs.fields) {
      if (!visible(f, values)) continue;
      const v = values[f.name];
      if (f.type === 'file') {
        if (v instanceof File) attachments.push(`${f.label}: ${v.name}`);
        continue;
      }
      if (f.type === 'table' && Array.isArray(v)) {
        v.filter(row => row.some(c => c.trim())).forEach((row, i) => {
          lines.push(`${i + 1}. ${row.map((c, j) => `${f.columns?.[j]?.label}: ${c || '—'}`).join('; ')}`);
        });
        continue;
      }
      if (f.type === 'declaration') {
        lines.push(`Declaration accepted: ${v === 'yes' ? 'Yes' : 'No'}`);
        continue;
      }
      if (typeof v === 'string' && v.trim()) lines.push(`${f.label}: ${v.trim()}`);
    }
    lines.push('');
  }
  if (attachments.length) {
    lines.push('ATTACHMENTS (attached to this e-mail)');
    attachments.forEach(a => lines.push(`- ${a}`));
  }
  return { text: lines.join('\n'), attachments };
}

export const mailtoAdapter: SubmitAdapter = {
  async submit(form, values) {
    const { text, attachments } = summarise(form, values);
    const who = String(values.name || values.candidate_name || '').trim();
    const subject = `${form.title}${who ? ` — ${who}` : ''}`;
    const params = new URLSearchParams();
    if (form.cc?.length) params.set('cc', form.cc.join(','));
    params.set('subject', subject);
    params.set('body', text);
    // URLSearchParams encodes spaces as "+", which mail clients show literally.
    const href = `mailto:${form.to.join(',')}?${params.toString().replace(/\+/g, '%20')}`;
    window.location.href = href;
    return {
      ok: true,
      attachments,
      message: `Your e-mail application has been opened with the details filled in, addressed to ${form.to.join(', ')}. Review it${attachments.length ? ', attach the listed files' : ''} and press Send to submit.`,
    };
  },
};

/** The adapter used by every form. Replace with an API-backed adapter when a submission endpoint exists. */
export const submitAdapter: SubmitAdapter = mailtoAdapter;
