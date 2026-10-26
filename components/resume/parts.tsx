import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { ContactKind } from "./prepare";

/** Multi-line text becomes a bullet list; a single line stays a paragraph. */
export function DescriptionText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-•*–]\s+/, ""))
    .filter(Boolean);
  if (lines.length === 0) return null;

  if (lines.length === 1) {
    return <p className={className}>{lines[0]}</p>;
  }
  return (
    <ul className={`list-disc space-y-0.5 ps-5 ${className}`}>
      {lines.map((line, index) => (
        <li key={index}>{line}</li>
      ))}
    </ul>
  );
}

export function LevelDots({
  level,
  total = 5,
  activeColor,
  idleColor,
}: {
  level: number;
  total?: number;
  activeColor: string;
  idleColor: string;
}) {
  return (
    <span aria-hidden="true" className="inline-flex gap-1">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className="size-2 rounded-full"
          style={{ background: index < level ? activeColor : idleColor }}
        />
      ))}
    </span>
  );
}

const CONTACT_ICONS = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
} satisfies Record<ContactKind, typeof Mail>;

export function ContactIcon({
  kind,
  className = "size-3.5",
}: {
  kind: ContactKind;
  className?: string;
}) {
  const Icon = CONTACT_ICONS[kind];
  return <Icon aria-hidden="true" className={className} />;
}
