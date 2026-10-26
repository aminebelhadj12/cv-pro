"use client";

import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useResume } from "@/lib/resume/ResumeProvider";
import {
  PAGE_HEIGHT_MM,
  PAGE_HEIGHT_PX,
  PAGE_PAD_Y_MM,
  PAGE_PAD_Y_PX,
  PAGE_WIDTH_MM,
  PAGE_WIDTH_PX,
} from "./constants";
import { isPreparedEmpty } from "./prepare";
import { TEMPLATE_COMPONENTS } from "./templates";
import { usePreparedResume } from "./usePreparedResume";

const CONTENT_PER_PAGE_PX = ((PAGE_HEIGHT_MM - 2 * PAGE_PAD_Y_MM) * 96) / 25.4;

/** Live A4 preview, scaled down to the available width. */
export function ResumePreview() {
  const { t } = useTranslation();
  const { resume } = useResume();
  const data = usePreparedResume();
  const empty = isPreparedEmpty(data);

  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(PAGE_HEIGHT_PX);

  useEffect(() => {
    const frame = frameRef.current;
    const sheet = sheetRef.current;
    if (!frame || !sheet) return;

    const update = () => {
      setScale(Math.min(1, frame.clientWidth / PAGE_WIDTH_PX));
      setHeight(sheet.offsetHeight);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(frame);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, [empty]);

  if (empty) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <FileText aria-hidden="true" className="size-10 text-slate-300" />
        <p className="mt-3 font-semibold text-slate-800">
          {t.builder.preview.emptyTitle}
        </p>
        <p className="mt-1 max-w-xs text-sm text-slate-600">
          {t.builder.preview.emptyText}
        </p>
      </div>
    );
  }

  const Template = TEMPLATE_COMPONENTS[resume.template];

  // Approximate page-break guides: each printed page holds the A4 height minus the repeated margins.
  const contentEnd = height - PAGE_PAD_Y_PX;
  const breaks: number[] = [];
  for (let k = 1; ; k++) {
    const y = PAGE_PAD_Y_PX + CONTENT_PER_PAGE_PX * k;
    if (y >= contentEnd - 2) break;
    breaks.push(y);
  }

  return (
    <div>
      {/* The frame is always left-to-right so scaling math is the same in every UI language. */}
      <div ref={frameRef} dir="ltr" className="w-full">
        <div
          className="relative mx-auto overflow-hidden rounded-sm bg-white shadow-lg ring-1 ring-slate-200"
          style={{ width: PAGE_WIDTH_PX * scale, height: height * scale }}
        >
          <div
            ref={sheetRef}
            style={{
              width: `${PAGE_WIDTH_MM}mm`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <Template data={data} />
          </div>

          {breaks.map((y) => (
            <div
              key={y}
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-400/70"
              style={{ top: y * scale }}
            />
          ))}
        </div>
      </div>

      {breaks.length > 0 ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          {t.builder.preview.pageBreakNote}
        </p>
      ) : null}
    </div>
  );
}
