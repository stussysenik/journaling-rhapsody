/**
 * Paired columns component — ported from components.zig drawPairedColumns
 *
 * Renders two columns of write-in lines with headers.
 * Useful for exercises like "Thought" vs "Reframe".
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';

export interface PairedColumnsConfig {
  labelA: string;
  labelB: string;
  numRows: number;
  x?: number;
  w?: number;
}

/**
 * Draw two columns of ruled lines with headers.
 * Returns the new y cursor position below the last row.
 */
export function renderPairedColumns(
  page: PDFPage,
  fonts: Fonts,
  config: PairedColumnsConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const w = config.w ?? d.CONTENT_W;
  const halfW = (w - d.UNIT) * 0.5;

  // Column headers
  page.drawText(config.labelA, {
    x,
    y,
    font: fonts.bold,
    size: d.BODY_SIZE,
    color: d.TEXT_COLOR,
  });
  page.drawText(config.labelB, {
    x: x + halfW + d.UNIT,
    y,
    font: fonts.bold,
    size: d.BODY_SIZE,
    color: d.TEXT_COLOR,
  });

  // Rows
  let rowY = y - d.BODY_LEADING - 2.0;
  for (let i = 0; i < config.numRows; i++) {
    // Left column line
    page.drawLine({
      start: { x, y: rowY },
      end: { x: x + halfW, y: rowY },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });
    // Right column line
    page.drawLine({
      start: { x: x + halfW + d.UNIT, y: rowY },
      end: { x: x + w, y: rowY },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });
    rowY -= d.BODY_LEADING * 1.5;
  }

  return rowY - d.units(0.3);
}
