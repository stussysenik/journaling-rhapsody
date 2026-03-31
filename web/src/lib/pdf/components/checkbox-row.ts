/**
 * Checkbox row component — ported from components.zig drawCheckboxRow
 *
 * Renders a horizontal row of checkboxes with labels.
 * Each checkbox is a small white square with a gray border,
 * followed by a text label. Items flow left-to-right.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { textWidth } from '../text-utils.js';

export interface CheckboxRowConfig {
  labels: string[];
  x?: number;
}

/**
 * Draw a row of checkboxes with labels.
 * Returns the new y cursor position.
 */
export function renderCheckboxRow(
  page: PDFPage,
  fonts: Fonts,
  config: CheckboxRowConfig,
  y: number
): number {
  const startX = config.x ?? d.CONTENT_LEFT;
  let cx = startX;

  for (const label of config.labels) {
    // Checkbox square (10x10, white fill, gray border)
    page.drawRectangle({
      x: cx,
      y: y - 1.0,
      width: 10.0,
      height: 10.0,
      color: d.WHITE,
      borderColor: d.GRID_COLOR,
      borderWidth: 0.5,
    });

    // Label text
    page.drawText(label, {
      x: cx + 13.0,
      y,
      font: fonts.regular,
      size: d.BODY_SIZE,
      color: d.TEXT_COLOR,
    });

    const lw = textWidth(fonts.regular, label, d.BODY_SIZE);
    cx += 13.0 + lw + 14.0;
  }

  return y - d.units(1.0);
}
