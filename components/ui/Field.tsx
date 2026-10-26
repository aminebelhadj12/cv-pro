"use client";

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { Validator } from "@/lib/resume/validation";

const CONTROL =
  "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";
const CONTROL_OK = "border-slate-300 focus:border-brand-600 focus:ring-brand-600/30";
const CONTROL_BAD = "border-red-500 focus:border-red-500 focus:ring-red-500/30";

function describedBy(id: string, hint?: string, error?: string | null) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

/** Shows the validation error only after the field has been left once. */
function useFieldError(value: string, validate?: Validator) {
  const { t } = useTranslation();
  const [touched, setTouched] = useState(false);
  const code = touched && validate ? validate(value) : null;
  return {
    error: code ? t.builder.validation[code] : null,
    onBlur: () => setTouched(true),
  };
}

interface ShellProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  className?: string;
  children: ReactNode;
}

function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  className = "",
  children,
}: ShellProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ms-0.5 text-red-600">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} aria-live="polite" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputAttrs = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "placeholder"
  | "inputMode"
  | "autoComplete"
  | "disabled"
  | "maxLength"
  | "dir"
>;

interface TextFieldProps extends InputAttrs {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  required?: boolean;
  validate?: Validator;
  className?: string;
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  required,
  validate,
  className,
  type = "text",
  dir,
  ...rest
}: TextFieldProps) {
  const id = useId();
  const { error, onBlur } = useFieldError(value, validate);

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <input
        id={id}
        type={type}
        value={value}
        dir={dir ?? (type === "text" ? "auto" : "ltr")}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${CONTROL} ${error ? CONTROL_BAD : CONTROL_OK}`}
        {...rest}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  validate?: Validator;
  className?: string;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 4,
  maxLength,
  required,
  validate,
  className,
}: TextAreaFieldProps) {
  const id = useId();
  const { error, onBlur } = useFieldError(value, validate);

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        dir="auto"
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${CONTROL} resize-y ${error ? CONTROL_BAD : CONTROL_OK}`}
      />
      {maxLength ? (
        <p className="mt-1 text-end text-xs text-slate-500" aria-hidden="true">
          {value.length} / {maxLength}
        </p>
      ) : null}
    </FieldShell>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  hint?: string;
  className?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
  className,
}: SelectFieldProps) {
  const id = useId();

  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={describedBy(id, hint)}
        className={`${CONTROL} ${CONTROL_OK}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function CheckboxField({
  label,
  checked,
  onChange,
  className = "",
}: CheckboxFieldProps) {
  const id = useId();

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 rounded border-slate-300 accent-brand-600"
        />
        {label}
      </label>
    </div>
  );
}
