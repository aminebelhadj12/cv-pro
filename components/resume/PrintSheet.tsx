"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useResume } from "@/lib/resume/ResumeProvider";
import { isPreparedEmpty } from "./prepare";
import { TEMPLATE_COMPONENTS } from "./templates";
import { usePreparedResume } from "./usePreparedResume";

/**
 * Full-size, unscaled copy of the CV, mounted directly under <body>.
 * It is hidden on screen; the print stylesheet (globals.css) hides everything
 * else and shows only this element, which is what ends up in the PDF.
 */
export function PrintSheet() {
  const { resume } = useResume();
  const data = usePreparedResume();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isPreparedEmpty(data)) return null;

  const Template = TEMPLATE_COMPONENTS[resume.template];
  return createPortal(
    <div id="print-root" aria-hidden="true">
      <Template data={data} />
    </div>,
    document.body,
  );
}
