import type { ReactNode } from "react";
import type { Direction, Locale } from "@/types/i18n";
import {
  PAGE_HEIGHT_MM,
  PAGE_PAD_Y_MM,
  PAGE_WIDTH_MM,
} from "./constants";

interface ResumePageProps {
  dir: Direction;
  lang: Locale;
  fontClass: string;
  /** CSS background of the whole sheet (sidebar stripe, etc.). White by default. */
  background?: string;
  children: ReactNode;
}

/**
 * The A4 sheet. Content sits in a table whose empty <thead>/<tfoot> rows act as
 * top and bottom margins: browsers repeat them on every printed page, so
 * continuation pages keep their margins while backgrounds still reach the edges.
 */
export function ResumePage({
  dir,
  lang,
  fontClass,
  background = "#ffffff",
  children,
}: ResumePageProps) {
  const spacer = { height: `${PAGE_PAD_Y_MM}mm` };

  return (
    <div
      className={`resume-sheet ${fontClass}`}
      dir={dir}
      lang={lang}
      style={{
        width: `${PAGE_WIDTH_MM}mm`,
        minHeight: `${PAGE_HEIGHT_MM - 1}mm`,
        background,
      }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <td className="p-0" style={spacer} />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-0 align-top">{children}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="p-0" style={spacer} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
