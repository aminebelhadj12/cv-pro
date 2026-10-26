import type { Locale } from "@/types/i18n";
import { ar } from "./ar";
import { en } from "./en";
import { fr, type Messages } from "./fr";

export type { Messages };

export const dictionaries: Record<Locale, Messages> = { fr, ar, en };
