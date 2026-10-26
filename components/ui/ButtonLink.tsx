import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "inverted";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
  secondary:
    "border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50",
  inverted: "bg-white text-brand-700 shadow-sm hover:bg-brand-50",
};

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
