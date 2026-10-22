import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Mail, Paperclip } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { PageCanvas } from '../components/ui/PageCanvas';
import { SmartLink } from '../components/ui/SmartLink';
import { FORMS } from '../config/forms';
import { submitAdapter, type SubmissionResult } from '../lib/forms/submit-adapter';
import type { FieldDefinition, FormDefinition, FormValues } from '../lib/forms/types';
import { ease } from '../lib/motion';
import { usePageSetup } from '../lib/page-context';
import type { FormPage } from '../lib/types';

type Errors = Record<string, string>;

const inputCls = (invalid: boolean) =>
  `mt-1.5 block w-full rounded-[var(--radius-md)] border bg-pearl px-4 text-ink placeholder:text-muted/70 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-600 ${invalid ? 'border-[#b42318]' : 'border-line-strong focus:border-teal-600'}`;

const isVisible = (f: FieldDefinition, values: FormValues) =>
  !f.showWhen || f.showWhen.equals.includes(String(values[f.showWhen.field] ?? ''));

function validate(form: FormDefinition, values: FormValues): Errors {
  const errors: Errors = {};
  for (const fs of form.fieldsets) {
    for (const f of fs.fields) {
      if (!isVisible(f, values)) continue;
      const v = values[f.name];
      if (f.type === 'table') {
        const first = (v as string[][] | undefined)?.[0] ?? [];
        const missing = f.columns?.findIndex((c, i) => c.required && !first[i]?.trim()) ?? -1;
        if (missing >= 0) errors[`${f.name}.0.${missing}`] = `Enter ${f.columns![missing].label.toLowerCase()} for the first qualification.`;
        continue;
      }
      if (f.type === 'declaration') {
        if (f.required && v !== 'yes') errors[f.name] = 'You must accept the declaration to submit.';
        continue;
      }
      if (f.type === 'file') {
        if (f.required && !(v instanceof File)) errors[f.name] = `Choose a file for “${f.label}”.`;
        continue;
      }
      const s = typeof v === 'string' ? v.trim() : '';
      if (f.required && !s) {
        errors[f.name] = f.type === 'radio' || f.type === 'select' ? `Select ${f.label.toLowerCase()}.` : `Enter ${f.label.toLowerCase()}.`;
      } else if (s && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) {
        errors[f.name] = 'Enter an e-mail address in the format name@example.com.';
      } else if (s && f.pattern && !new RegExp(f.pattern).test(s)) {
        errors[f.name] = f.patternMessage ?? `Check the format of ${f.label.toLowerCase()}.`;
      }
    }
  }
  return errors;
}

function FieldShell({ id, label, required, hint, error, children, as = 'div' }: {
  id: string; label: ReactNode; required?: boolean; hint?: string; error?: string; children: ReactNode; as?: 'div' | 'fieldset';
}) {
  const Label = as === 'fieldset' ? 'legend' : 'label';
  const Wrapper = as;
  return (
    <Wrapper className="min-w-0">
      <Label {...(as === 'div' ? { htmlFor: id } : {})} className="text-[0.9375rem] font-semibold text-ink">
        {label}
        {required ? <span className="ml-1 text-[#b42318]" aria-hidden>*</span> : <span className="ml-1.5 text-meta font-normal text-muted">(optional)</span>}
      </Label>
      {hint && <p id={`${id}-hint`} className="mt-0.5 text-meta text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-meta font-semibold text-[#b42318]">
          <AlertCircle aria-hidden size={14} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
      {children}
    </Wrapper>
  );
}

function Field({ f, values, errors, set, baseId }: {
  f: FieldDefinition; values: FormValues; errors: Errors; set: (name: string, v: FormValues[string]) => void; baseId: string;
}) {
  const id = `${baseId}-${f.name}`;
  const error = errors[f.name];
  const describedBy = [f.hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  const common = { id, name: f.name, 'aria-invalid': !!error || undefined, 'aria-describedby': describedBy, required: f.required };
  const value = typeof values[f.name] === 'string' ? (values[f.name] as string) : '';

  switch (f.type) {
    case 'textarea':
      return (
        <FieldShell id={id} label={f.label} required={f.required} hint={f.hint} error={error}>
          <textarea {...common} rows={5} maxLength={f.maxLength} placeholder={f.placeholder} value={value}
            onChange={e => set(f.name, e.target.value)} className={`${inputCls(!!error)} py-3 leading-relaxed`} />
        </FieldShell>
      );
    case 'select':
      return (
        <FieldShell id={id} label={f.label} required={f.required} hint={f.hint} error={error}>
          <select {...common} value={value} onChange={e => set(f.name, e.target.value)} className={`${inputCls(!!error)} h-12`}>
            <option value="">Select…</option>
            {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FieldShell>
      );
    case 'radio':
      return (
        <FieldShell id={id} label={f.label} required={f.required} hint={f.hint} error={error} as="fieldset">
          <div id={id} tabIndex={-1} className="mt-2 flex flex-wrap gap-2" aria-describedby={describedBy}>
            {f.options?.map(o => (
              <label key={o.value} className={`inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border px-4 text-[0.9375rem] transition-colors ${value === o.value ? 'border-teal-600 bg-teal-50 text-ink' : 'border-line-strong bg-white text-slate hover:border-navy-800'}`}>
                <input type="radio" name={f.name} value={o.value} checked={value === o.value} onChange={() => set(f.name, o.value)}
                  className="size-4 accent-teal-700" />
                {o.label}
              </label>
            ))}
          </div>
        </FieldShell>
      );
    case 'file': {
      const file = values[f.name] instanceof File ? (values[f.name] as File) : null;
      return (
        <FieldShell id={id} label={f.label} required={f.required} hint={f.hint} error={error}>
          <input {...common} type="file" accept={f.accept} onChange={e => set(f.name, e.target.files?.[0] ?? null)}
            className={`${inputCls(!!error)} py-2.5 text-[0.875rem] file:mr-3 file:rounded-xs file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-[0.8125rem] file:font-semibold file:text-white`} />
          {file && <p className="mt-1 text-meta text-muted">Selected: {file.name}</p>}
        </FieldShell>
      );
    }
    case 'declaration':
      return (
        <div>
          <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 ${error ? 'border-[#b42318]' : 'border-line-strong'} bg-white`}>
            <input {...common} type="checkbox" checked={values[f.name] === 'yes'} onChange={e => set(f.name, e.target.checked ? 'yes' : '')}
              className="mt-1 size-4 shrink-0 accent-teal-700" />
            <span className="text-[0.9375rem] leading-relaxed text-ink">{f.label}</span>
          </label>
          {error && <p id={`${id}-error`} className="mt-1 text-meta font-semibold text-[#b42318]">{error}</p>}
        </div>
      );
    case 'table': {
      const rows = (values[f.name] as string[][] | undefined) ?? Array.from({ length: f.rows ?? 3 }, () => f.columns!.map(() => ''));
      const setCell = (r: number, c: number, v: string) => {
        const next = rows.map(row => [...row]);
        next[r][c] = v;
        set(f.name, next);
      };
      return (
        <fieldset className="min-w-0">
          <legend className="text-[0.9375rem] font-semibold text-ink">{f.label}</legend>
          {f.hint && <p className="mt-0.5 text-meta text-muted">{f.hint}</p>}
          <div className="mt-3 space-y-4">
            {rows.map((row, r) => (
              <fieldset key={r} className="rounded-sm border border-line bg-white p-4">
                <legend className="px-1 text-meta font-semibold text-muted">Qualification {r + 1}{r === 0 ? '' : ' (optional)'}</legend>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {f.columns!.map((col, c) => {
                    const cellId = `${id}-${r}-${c}`;
                    const cellError = errors[`${f.name}.${r}.${c}`];
                    return (
                      <div key={col.name}>
                        <label htmlFor={cellId} className="text-meta font-semibold text-ink">{col.label}</label>
                        <input id={cellId} value={row[c]} onChange={e => setCell(r, c, e.target.value)}
                          aria-invalid={!!cellError || undefined} aria-describedby={cellError ? `${cellId}-error` : undefined}
                          className={`${inputCls(!!cellError)} h-11`} />
                        {cellError && <p id={`${cellId}-error`} className="mt-1 text-meta font-semibold text-[#b42318]">{cellError}</p>}
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </fieldset>
      );
    }
    default:
      return (
        <FieldShell id={id} label={f.label} required={f.required} hint={f.hint} error={error}>
          <input {...common} type={f.type} value={value} placeholder={f.placeholder} maxLength={f.maxLength}
            autoComplete={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : undefined}
            onChange={e => set(f.name, e.target.value)} className={`${inputCls(!!error)} h-12`} />
        </FieldShell>
      );
  }
}

export function FormTemplate({ page }: { page: FormPage }) {
  const form = FORMS[page.formId];
  usePageSetup(form.title, page.hiUrl);
  const baseId = useId();
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const set = (name: string, v: FormValues[string]) => {
    setValues(s => ({ ...s, [name]: v }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSubmitting(true);
    try {
      const r = await submitAdapter.submit(form, values);
      setResult(r);
      requestAnimationFrame(() => resultRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  };

  const errorEntries = Object.entries(errors);
  const allFields = form.fieldsets.flatMap(fs => fs.fields);
  const labelFor = (key: string) => allFields.find(f => f.name === key.split('.')[0])?.label ?? key;
  const targetId = (key: string) => {
    const [name, r, c] = key.split('.');
    return r !== undefined ? `${baseId}-${name}-${r}-${c}` : `${baseId}-${name}`;
  };

  return (
    <>
      <PageHeader title={form.title} crumbs={page.crumbs.filter(c => c.label !== form.title)} eyebrow="Online form" lead={form.intro} printable={false} />
      <PageCanvas>
      <div className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-12">
        <div className="page-sheet min-w-0 lg:col-span-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="done"
                ref={resultRef}
                tabIndex={-1}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: ease.out }}
                className="rounded-sm border border-teal-600/40 bg-teal-50 p-6 outline-none md:p-8"
                role="status"
              >
                <CheckCircle2 aria-hidden size={28} className="text-teal-700" />
                <h2 className="mt-3 text-h3">Your application is ready to send</h2>
                <p className="mt-2 text-ink">{result.message}</p>
                {result.attachments.length > 0 && (
                  <div className="mt-5">
                    <p className="flex items-center gap-2 font-semibold text-ink"><Paperclip aria-hidden size={16} /> Attach these files to the e-mail</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6 text-[0.9375rem]">
                      {result.attachments.map(a => <li key={a}>{a}</li>)}
                    </ul>
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => submitAdapter.submit(form, values)} className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-navy-900 px-4 font-semibold text-white hover:bg-navy-800">
                    <Mail aria-hidden size={16} /> Open the e-mail again
                  </button>
                  <button type="button" onClick={() => setResult(null)} className="inline-flex min-h-11 items-center rounded-sm border border-line-strong bg-white px-4 font-semibold text-navy-900 hover:border-navy-900">
                    Edit the form
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={onSubmit} initial={false} exit={{ opacity: 0 }} className="space-y-10">
                {errorEntries.length > 0 && (
                  <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-sm border-2 border-[#b42318] bg-white p-5 outline-none">
                    <h2 className="text-[1.0625rem] font-semibold text-[#b42318]">There {errorEntries.length === 1 ? 'is a problem' : `are ${errorEntries.length} problems`} with your form</h2>
                    <ul className="mt-3 space-y-1.5">
                      {errorEntries.map(([k, msg]) => (
                        <li key={k}>
                          <a
                            href={`#${targetId(k)}`}
                            onClick={ev => { ev.preventDefault(); const el = document.getElementById(targetId(k)); el?.focus(); el?.scrollIntoView({ block: 'center' }); }}
                            className="text-[0.9375rem] font-semibold text-[#b42318] underline underline-offset-4"
                          >
                            {labelFor(k)}: {msg}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-meta text-muted">Fields marked <span className="text-[#b42318]">*</span> are required.</p>
                {form.fieldsets.map((fs, i) => (
                  <fieldset key={fs.legend} className="border-t border-line pt-8">
                    <legend className="eyebrow -mt-11 rounded-full bg-white px-3">
                      <span className="index">{String(i + 1).padStart(2, '0')}</span><span className="rule" aria-hidden />{fs.legend}
                    </legend>
                    <div className="mt-2 grid gap-6 sm:grid-cols-2">
                      {fs.fields.filter(f => isVisible(f, values)).map(f => (
                        <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
                          <Field f={f} values={values} errors={errors} set={set} baseId={baseId} />
                        </div>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
                  <button type="submit" disabled={submitting} className="search-pill inline-flex min-h-12 items-center gap-2 rounded-full px-7 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60">
                    <Mail aria-hidden size={17} /> Prepare e-mail submission
                  </button>
                  <p className="max-w-md text-meta text-muted">
                    Your details are not stored by this website. Submitting opens your e-mail application with the completed form addressed to {form.to.join(', ')}.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        <aside className="lg:col-span-3 lg:col-start-10">
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="side-card">
              <p className="text-[1rem] font-semibold text-ink">Submitted to</p>
              <ul className="mt-2 space-y-1">
                {[...form.to, ...(form.cc ?? [])].map(e => <li key={e}><a href={`mailto:${e}`} className="link-underline text-[0.875rem] [overflow-wrap:anywhere]">{e}</a></li>)}
              </ul>
              <p className="mt-3 text-meta text-muted">
                Address as published on <SmartLink to={form.recipientSource.to} className="link-underline">{form.recipientSource.label}</SmartLink>.
              </p>
            </div>
            {form.related && (
              <div className="side-card">
                <p className="text-[1rem] font-semibold text-ink">Before you apply</p>
                <ul className="mt-3 space-y-2 text-[0.9375rem]">
                  {form.related.map(r => <li key={r.to}><SmartLink to={r.to} className="link-underline">{r.label}</SmartLink></li>)}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
      </PageCanvas>
    </>
  );
}
