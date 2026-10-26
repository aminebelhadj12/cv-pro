export type ImageErrorCode = "errorType" | "errorSize" | "errorRead";

export class ImageError extends Error {
  readonly code: ImageErrorCode;
  constructor(code: ImageErrorCode) {
    super(code);
    this.name = "ImageError";
    this.code = code;
  }
}

const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const ACCEPTED = /^image\/(jpeg|png|webp)$/;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageError("errorRead"));
    img.src = src;
  });
}

/**
 * Crops the image to a centred square, shrinks it to at most `size` px and
 * returns a JPEG data URL. Everything happens in the browser.
 */
export async function fileToResizedDataUrl(
  file: File,
  size = 400,
  quality = 0.85,
): Promise<string> {
  if (!ACCEPTED.test(file.type)) throw new ImageError("errorType");
  if (file.size > MAX_INPUT_BYTES) throw new ImageError("errorSize");

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    if (!side) throw new ImageError("errorRead");

    const out = Math.min(size, side);
    const canvas = document.createElement("canvas");
    canvas.width = out;
    canvas.height = out;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ImageError("errorRead");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out, out);
    ctx.drawImage(
      img,
      (img.naturalWidth - side) / 2,
      (img.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      out,
      out,
    );
    return canvas.toDataURL("image/jpeg", quality);
  } catch (error) {
    if (error instanceof ImageError) throw error;
    throw new ImageError("errorRead");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
