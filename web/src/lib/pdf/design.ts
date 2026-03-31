/**
 * Design system constants — ported from design.zig
 *
 * John Maeda "Laws of Simplicity" approach: all spacing derives from
 * an 18pt base unit. Golden ratio drives proportions.
 *
 * All values are in PDF points (72pt = 1 inch).
 * PDF coordinate system: origin at bottom-left, y increases upward.
 */

import { rgb, type Color } from 'pdf-lib';

// ---------------------------------------------------------------------------
// Base unit
// ---------------------------------------------------------------------------

/** Base spacing unit: 18pt (0.25 inch) */
export const UNIT = 18.0;

/** Multiply base unit by n for consistent spacing */
export function units(n: number): number {
  return n * UNIT;
}

// ---------------------------------------------------------------------------
// Page dimensions (US Letter)
// ---------------------------------------------------------------------------

export const PAGE_W = 612.0;
export const PAGE_H = 792.0;

// ---------------------------------------------------------------------------
// Margins: 4 units = 72pt = 1 inch
// ---------------------------------------------------------------------------

export const MARGIN = 72.0;

// ---------------------------------------------------------------------------
// Content area
// ---------------------------------------------------------------------------

export const CONTENT_W = PAGE_W - 2 * MARGIN; // 468pt
export const CONTENT_H = PAGE_H - 2 * MARGIN; // 648pt
export const CONTENT_TOP = PAGE_H - MARGIN; // 720 — top of drawable area
export const CONTENT_BOTTOM = MARGIN; // 72 — bottom of drawable area
export const CONTENT_LEFT = MARGIN; // 72
export const CONTENT_RIGHT = PAGE_W - MARGIN; // 540

// ---------------------------------------------------------------------------
// Golden ratio columns
// ---------------------------------------------------------------------------

export const PHI = 1.618;
export const COL_MAJOR = CONTENT_W * (PHI / (1.0 + PHI)); // ~289pt
export const COL_MINOR = CONTENT_W - COL_MAJOR; // ~179pt
export const COL_GAP = UNIT; // 18pt gap between columns

// ---------------------------------------------------------------------------
// Typography sizes (in points)
// ---------------------------------------------------------------------------

export const TITLE_SIZE = 22.0;
export const SECTION_SIZE = 12.0;
export const BODY_SIZE = 9.5;
export const CAPTION_SIZE = 7.5;
export const LABEL_SIZE = 8.0;

// ---------------------------------------------------------------------------
// Leading (line spacing, in points)
// ---------------------------------------------------------------------------

export const TITLE_LEADING = 28.0;
export const SECTION_LEADING = 16.0;
export const BODY_LEADING = 13.0;
export const CAPTION_LEADING = 10.0;

// ---------------------------------------------------------------------------
// Colors — pdf-lib rgb() uses 0-1 range, same as the Zig source
// ---------------------------------------------------------------------------

export const TEXT_COLOR: Color = rgb(0.10, 0.10, 0.10);
export const GRID_COLOR: Color = rgb(0.88, 0.88, 0.88);
export const DIVIDER_COLOR: Color = rgb(0.80, 0.80, 0.80);
export const CAPTION_COLOR: Color = rgb(0.50, 0.50, 0.50);
export const ACCENT_COLOR: Color = rgb(0.83, 0.63, 0.09);
export const BG_FILL_COLOR: Color = rgb(0.96, 0.96, 0.96);
export const WHITE: Color = rgb(1.0, 1.0, 1.0);

// ---------------------------------------------------------------------------
// Rounded corner radius
// ---------------------------------------------------------------------------

export const CORNER_R = 6.0;
