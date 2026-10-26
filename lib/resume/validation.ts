export type ValidationCode =
  | "required"
  | "email"
  | "phone"
  | "url"
  | "dateFormat"
  | "dateOrder";

/** Returns an error code, or null when the value is valid. Empty values are valid unless `required` is used. */
export type Validator = (value: string) => ValidationCode | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export const required: Validator = (value) =>
  value.trim() ? null : "required";

export const email: Validator = (value) => {
  const v = value.trim();
  return !v || EMAIL_RE.test(v) ? null : "email";
};

export const phone: Validator = (value) => {
  const v = value.trim();
  if (!v) return null;
  const digits = v.replace(/\D/g, "");
  const validChars = /^[+()\d\s.-]+$/.test(v);
  return validChars && digits.length >= 6 && digits.length <= 15
    ? null
    : "phone";
};

export function isValidUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  if (/\s/.test(v)) return false;
  try {
    const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export const url: Validator = (value) => (isValidUrl(value) ? null : "url");

export const month: Validator = (value) => {
  const v = value.trim();
  return !v || MONTH_RE.test(v) ? null : "dateFormat";
};

/** End date must not be before the start date ("YYYY-MM" strings compare correctly). */
export function endAfter(start: string): Validator {
  return (value) =>
    value && start && MONTH_RE.test(value) && MONTH_RE.test(start) && value < start
      ? "dateOrder"
      : null;
}

export function compose(...validators: Validator[]): Validator {
  return (value) => {
    for (const validator of validators) {
      const code = validator(value);
      if (code) return code;
    }
    return null;
  };
}
