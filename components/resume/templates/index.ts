import type { ComponentType } from "react";
import type { TemplateId } from "@/types/resume";
import type { PreparedResume } from "../prepare";
import { ClassicTemplate } from "./ClassicTemplate";
import { CreativeTemplate } from "./CreativeTemplate";
import { ModernTemplate } from "./ModernTemplate";

export const TEMPLATE_COMPONENTS: Record<
  TemplateId,
  ComponentType<{ data: PreparedResume }>
> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
};
