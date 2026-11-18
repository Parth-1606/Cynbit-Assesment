/**
 * Form field primitives shared by the contact step.
 * Each field wires its label, description and error message to the input via
 * aria-describedby / aria-invalid so validation is announced correctly.
 */
import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { AlertCircle } from 'lucide-react';

interface FieldShellProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: (ids: { inputId: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

function FieldShell({ label, required = false, hint, error, children }: FieldShellProps) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-300"
      >
        {label}
        {required ? (
          <span className="ml-1 text-accent-purple" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-normal text-slate-500">(optional)</span>
        )}
      </label>

      {children({ inputId, describedBy, invalid: Boolean(error) })}

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-rose-400"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({ label, hint, error, required, ...inputProps }: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ inputId, describedBy, invalid }) => (
        <input
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          {...inputProps}
          className={`w-full rounded-xl border bg-navy-900/80 px-4 py-3 text-sm text-white
            placeholder:text-slate-600 transition-colors
            focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/30
            ${
              invalid
                ? 'border-rose-500/70'
                : 'border-hairline hover:border-white/25'
            }`}
        />
      )}
    </FieldShell>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextAreaField({ label, hint, error, required, ...textareaProps }: TextAreaFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ inputId, describedBy, invalid }) => (
        <textarea
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          {...textareaProps}
          className={`w-full resize-y rounded-xl border bg-navy-900/80 px-4 py-3 text-sm text-white
            placeholder:text-slate-600 transition-colors min-h-32
            focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/30
            ${invalid ? 'border-rose-500/70' : 'border-hairline hover:border-white/25'}`}
        />
      )}
    </FieldShell>
  );
}
