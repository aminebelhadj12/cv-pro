/** A4 geometry. The preview and the print stylesheet (phase 6) share these values. */
export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;
/** Space kept at the top and bottom of EVERY printed page (see ResumePage). */
export const PAGE_PAD_Y_MM = 12;

const PX_PER_MM = 96 / 25.4;
export const PAGE_WIDTH_PX = PAGE_WIDTH_MM * PX_PER_MM;
export const PAGE_HEIGHT_PX = PAGE_HEIGHT_MM * PX_PER_MM;
export const PAGE_PAD_Y_PX = PAGE_PAD_Y_MM * PX_PER_MM;
