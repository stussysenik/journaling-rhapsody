/**
 * Page header component — ported from components.zig drawHeader
 *
 * Renders the worksheet title on the left and a date entry box on
 * the right, followed by a horizontal divider line.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { drawRoundedRect } from '../draw-utils.js';

export interface HeaderConfig {
  title: string;
}

/**
 * Draw the page header (title + date box + divider).
 * Returns the new y cursor position below the divider.
 */
export function renderHeader(
  page: PDFPage,
  fonts: Fonts,
  config: HeaderConfig,
  _y: number
): number {
  const y = d.CONTENT_TOP - d.TITLE_SIZE;

  // Title text
  page.drawText(config.title, {
    x: d.CONTENT_LEFT,
    y,
    font: fonts.bold,
    size: d.TITLE_SIZE,
    color: d.TEXT_COLOR,
  });

  // Date box (right-aligned)
  const boxW = 120.0;
  const boxH = 22.0;
  const boxX = d.CONTENT_RIGHT - boxW;
  const boxY = y - 4.0;

  // Fill
  drawRoundedRect(page, boxX, boxY, boxW, boxH, 4.0, {
    fillColor: d.BG_FILL_COLOR,
  });
  // Stroke
  drawRoundedRect(page, boxX, boxY, boxW, boxH, 4.0, {
    borderColor: d.DIVIDER_COLOR,
    borderWidth: 0.5,
  });

  // Date text inside the box
  page.drawText('Date: ___/___/______', {
    x: boxX + 8.0,
    y: boxY + 7.0,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });

  // Divider line below header
  const divY = y - d.UNIT;
  page.drawLine({
    start: { x: d.CONTENT_LEFT, y: divY },
    end: { x: d.CONTENT_RIGHT, y: divY },
    thickness: 0.5,
    color: d.DIVIDER_COLOR,
  });

  return divY - d.units(0.5);
}
