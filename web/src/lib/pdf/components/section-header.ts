/**
 * Section header component — ported from components.zig drawSectionHeader
 *
 * Renders a section title with a small accent dot to its left.
 * The dot uses the golden accent color for visual hierarchy.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';

export interface SectionHeaderConfig {
  title: string;
  x?: number;
}

/**
 * Draw a section header with accent dot.
 * Returns the new y cursor position below the header.
 */
export function renderSectionHeader(
  page: PDFPage,
  fonts: Fonts,
  config: SectionHeaderConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;

  // Accent dot — fillCircle centered at (x+4, y + section_size*0.35)
  // pdf-lib drawCircle uses center coordinates and `size` as diameter
  page.drawCircle({
    x: x + 4.0,
    y: y + d.SECTION_SIZE * 0.35,
    size: 3.0,
    color: d.ACCENT_COLOR,
  });

  // Title text
  page.drawText(config.title, {
    x: x + 12.0,
    y,
    font: fonts.bold,
    size: d.SECTION_SIZE,
    color: d.TEXT_COLOR,
  });

  return y - d.SECTION_LEADING;
}
