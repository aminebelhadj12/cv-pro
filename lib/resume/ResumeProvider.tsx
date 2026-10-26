"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import type { ResumeData } from "@/types/resume";
import { createInitialResume } from "./defaults";
import {
  clearStoredDraft,
  isPristine,
  loadDraft,
  saveDraft,
} from "./persistence";
import { resumeReducer, type ResumeAction } from "./reducer";

export type SaveStatus = "idle" | "saving" | "saved" | "quota" | "error" | "unavailable";

export interface DraftState {
  saveStatus: SaveStatus;
  /** Timestamp of the last successful save (or of the restored draft). */
  savedAt: number | null;
  /** A saved draft was found and loaded when the page opened. */
  restored: boolean;
  /** A saved draft existed but was unreadable and has been discarded. */
  corrupted: boolean;
}

interface ResumeContextValue {
  resume: ResumeData;
  dispatch: Dispatch<ResumeAction>;
  /** False until the saved draft (if any) has been read after mount. */
  hydrated: boolean;
  draft: DraftState;
  /** Empties the form and deletes the saved draft. */
  clearDraft: () => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

const SAVE_DELAY_MS = 500;

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, dispatch] = useReducer(
    resumeReducer,
    undefined,
    () => createInitialResume(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<DraftState>({
    saveStatus: "idle",
    savedAt: null,
    restored: false,
    corrupted: false,
  });
  const latest = useRef(resume);
  // JSON of the resume as last loaded from, or written to, storage. Used to skip pointless saves.
  const synced = useRef<string | null>(null);

  // 1. Restore the saved draft once, after mount (localStorage does not exist on the server).
  useEffect(() => {
    const result = loadDraft();
    synced.current = JSON.stringify(
      result.status === "restored" ? result.data : createInitialResume(),
    );
    if (result.status === "restored") {
      dispatch({ type: "LOAD", data: result.data });
      setDraft((d) => ({ ...d, restored: true, savedAt: result.savedAt }));
    } else if (result.status === "corrupted") {
      setDraft((d) => ({ ...d, corrupted: true }));
    } else if (result.status === "unavailable") {
      setDraft((d) => ({ ...d, saveStatus: "unavailable" }));
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((data: ResumeData) => {
    if (isPristine(data)) {
      clearStoredDraft();
      setDraft((d) =>
        d.saveStatus === "unavailable" ? d : { ...d, saveStatus: "idle", savedAt: null },
      );
      return;
    }
    const result = saveDraft(data);
    if (result === "saved") synced.current = JSON.stringify(data);
    setDraft((d) =>
      result === "saved"
        ? { ...d, saveStatus: "saved", savedAt: Date.now() }
        : { ...d, saveStatus: result },
    );
  }, []);

  // 2. Autosave shortly after the last change. Never before the draft was restored,
  //    otherwise the empty initial form would overwrite the saved one.
  useEffect(() => {
    latest.current = resume;
    if (!hydrated) return;
    // Nothing changed since the last load/save (e.g. right after restoring): do not save again.
    if (JSON.stringify(resume) === synced.current) return;

    setDraft((d) =>
      d.saveStatus === "saving" || d.saveStatus === "unavailable"
        ? d
        : { ...d, saveStatus: "saving" },
    );
    const timer = window.setTimeout(() => persist(resume), SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [resume, hydrated, persist]);

  // 3. Save immediately when the tab is hidden or closed, so the last keystrokes are never lost.
  useEffect(() => {
    if (!hydrated) return;
    const flush = () => {
      if (JSON.stringify(latest.current) !== synced.current) persist(latest.current);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hydrated, persist]);

  const clearDraft = useCallback(() => {
    synced.current = JSON.stringify(createInitialResume(latest.current.cvLocale));
    dispatch({ type: "RESET" });
    clearStoredDraft();
    setDraft((d) => ({
      saveStatus: d.saveStatus === "unavailable" ? "unavailable" : "idle",
      savedAt: null,
      restored: false,
      corrupted: false,
    }));
  }, []);

  const value = useMemo(
    () => ({ resume, dispatch, hydrated, draft, clearDraft }),
    [resume, hydrated, draft, clearDraft],
  );

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) {
    throw new Error("useResume must be used inside <ResumeProvider>");
  }
  return ctx;
}
