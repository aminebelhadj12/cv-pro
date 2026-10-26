export type PrintErrorCode = "empty" | "unavailable";

export class PrintError extends Error {
  readonly code: PrintErrorCode;
  constructor(code: PrintErrorCode) {
    super(code);
    this.name = "PrintError";
    this.code = code;
  }
}

/**
 * "Sara El Amrani" -> "Sara_El_Amrani_CV". Characters that are illegal in file
 * names are removed; Arabic and accented letters are kept.
 */
export function buildPdfFilename(fullName: string): string {
  const base = fullName
    .normalize("NFC")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "_")
    .replace(/^\.+/, "")
    .slice(0, 80);
  return base ? `${base}_CV` : "CV";
}

/** Browsers suggest document.title as the PDF file name, so we swap it while printing. */
let originalTitle: string | null = null;

function restoreTitle() {
  if (originalTitle !== null) {
    document.title = originalTitle;
    originalTitle = null;
  }
  window.removeEventListener("afterprint", restoreTitle);
}

async function waitForRender(): Promise<void> {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const root = document.getElementById("print-root");
  if (!root) throw new PrintError("empty");

  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(images.map((img) => img.decode().catch(() => undefined)));

  // Two frames: lets the browser lay out the print sheet before the dialog opens.
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}

/** Opens the browser print dialog for the print sheet. The user picks "Save as PDF". */
export async function printResume(fileName: string): Promise<void> {
  if (typeof window === "undefined" || typeof window.print !== "function") {
    throw new PrintError("unavailable");
  }

  if (originalTitle === null) originalTitle = document.title;
  document.title = fileName;
  window.addEventListener("afterprint", restoreTitle);

  try {
    await waitForRender();
    window.print();
  } catch (error) {
    restoreTitle();
    throw error;
  }
}
