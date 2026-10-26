"use client";

import { Trash2, Upload, User } from "lucide-react";
import { useId, useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ImageError, fileToResizedDataUrl } from "@/lib/image";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";

export function PhotoField() {
  const { t } = useTranslation();
  const { resume, dispatch } = useResume();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const photo = resume.personal.photo;

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allows choosing the same file again
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      dispatch({ type: "SET_PERSONAL", field: "photo", value: dataUrl });
    } catch (err) {
      const code = err instanceof ImageError ? err.code : "errorRead";
      setError(t.builder.photo[code]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {t.builder.photo.label}
      </span>

      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-400">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={t.builder.photo.alt}
              className="size-full object-cover"
            />
          ) : (
            <User aria-hidden="true" className="size-9" />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />
          <Button
            disabled={busy}
            aria-describedby={`${inputId}-hint`}
            onClick={() => inputRef.current?.click()}
          >
            <Upload aria-hidden="true" className="size-4" />
            {photo ? t.builder.photo.change : t.builder.photo.choose}
          </Button>
          {photo ? (
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() =>
                dispatch({ type: "SET_PERSONAL", field: "photo", value: "" })
              }
            >
              <Trash2 aria-hidden="true" className="size-4" />
              {t.builder.photo.remove}
            </Button>
          ) : null}
        </div>
      </div>

      <p id={`${inputId}-hint`} className="mt-2 text-xs text-slate-500">
        {t.builder.photo.hint}
      </p>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
