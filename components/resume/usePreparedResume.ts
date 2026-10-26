"use client";

import { useMemo } from "react";
import { useResume } from "@/lib/resume/ResumeProvider";
import { prepareResume, type PreparedResume } from "./prepare";

export function usePreparedResume(): PreparedResume {
  const { resume } = useResume();
  return useMemo(() => prepareResume(resume), [resume]);
}
