import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** Collapsible section built on <details>: keyboard accessible with no JavaScript state. */
export function SectionCard({
  title,
  count,
  defaultOpen = false,
  children,
}: SectionCardProps) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-4 [&::-webkit-details-marker]:hidden">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          {title}
          {typeof count === "number" && count > 0 ? (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-800">
              {count}
            </span>
          ) : null}
        </h2>
        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-slate-100 p-5">{children}</div>
    </details>
  );
}
