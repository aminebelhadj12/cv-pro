"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Messages } from "@/messages";
import type { Direction, Locale } from "@/types/i18n";
import {
  DEFAULT_LOCALE,
  LOCALE_DIR,
  LOCALE_STORAGE_KEY,
  isLocale,
} from "./config";

interface LanguageContextValue {
  locale: Locale;
  dir: Direction;
  t: Messages;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Restore the saved language after mount (localStorage is unavailable on the server).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(saved)) setLocaleState(saved);
    } catch {
      // localStorage may be blocked (private mode, policies): keep the default.
    }
  }, []);

  // Keep <html lang> and <html dir> in sync with the active language.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_DIR[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Ignore storage errors: the language still changes for this session.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: LOCALE_DIR[locale],
      t: dictionaries[locale],
      setLocale,
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used inside <LanguageProvider>");
  }
  return ctx;
}
