import type { AccentId } from "@/types/resume";

export interface AccentColors {
  /** Main colour: headings and bands. Always readable as text on white. */
  main: string;
  /** Dark variant: sidebars (white text on top). */
  dark: string;
  /** Light tint: chips and soft backgrounds. */
  light: string;
}

export const ACCENTS: Record<AccentId, AccentColors> = {
  blue: { main: "#2563eb", dark: "#1e3a8a", light: "#dbeafe" },
  emerald: { main: "#047857", dark: "#064e3b", light: "#d1fae5" },
  violet: { main: "#7c3aed", dark: "#4c1d95", light: "#ede9fe" },
  rose: { main: "#e11d48", dark: "#881337", light: "#ffe4e6" },
  amber: { main: "#b45309", dark: "#78350f", light: "#fef3c7" },
  slate: { main: "#334155", dark: "#0f172a", light: "#e2e8f0" },
};
