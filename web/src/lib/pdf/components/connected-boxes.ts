/**
 * Connected boxes component — ported from components.zig drawConnectedBoxes
 *
 * Renders a sequence of labeled boxes connected by arrows
 * (e.g., setback -> lesson -> next move). Each box has a title
 * and write-in lines inside.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { drawRoundedRect } from '../draw-utils.js';

export interface ConnectedBoxesConfig {
  labels: string[];
  x?: number;
  w?: number;
}

/**
 * Draw a row of connected boxes with arrows between them.
 * Returns the new y cursor position below the boxes.
 */
export function renderConnectedBoxes(
  page: PDFPage,
  fonts: Fonts,
  config: ConnectedBoxesConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const w = config.w ?? d.CONTENT_W;
  const n = config.labels.length;

  if (n === 0) return y;

  const boxH = 55.0;
  const arrowGap = 20.0;
  const boxW = (w - arrowGap * (n - 1)) / n;

  for (let i = 0; i < n; i++) {
    const bx = x + i * (boxW + arrowGap);

    // Box background
    drawRoundedRect(page, bx, y - boxH, boxW, boxH, d.CORNER_R, {
      fillColor: d.BG_FILL_COLOR,
    });
    // Box border
    drawRoundedRect(page, bx, y - boxH, boxW, boxH, d.CORNER_R, {
      borderColor: d.GRID_COLOR,
      borderWidth: 0.5,
    });

    // Label
    page.drawText(config.labels[i], {
      x: bx + 8.0,
      y: y - 12.0,
      font: fonts.bold,
      size: d.LABEL_SIZE,
      color: d.TEXT_COLOR,
    });

    // Write-in lines inside the box
    page.drawLine({
      start: { x: bx + 8.0, y: y - 24.0 },
      end: { x: bx + boxW - 8.0, y: y - 24.0 },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });
    page.drawLine({
      start: { x: bx + 8.0, y: y - 37.0 },
      end: { x: bx + boxW - 8.0, y: y - 37.0 },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });

    // Arrow to next box
    if (i < n - 1) {
      const arrowX = bx + boxW + 2.0;
      const arrowY = y - boxH * 0.5;

      // Arrow shaft
      page.drawLine({
        start: { x: arrowX, y: arrowY },
        end: { x: arrowX + arrowGap - 6.0, y: arrowY },
        thickness: 1.0,
        color: d.DIVIDER_COLOR,
      });
      // Arrowhead (two short lines)
      page.drawLine({
        start: { x: arrowX + arrowGap - 10.0, y: arrowY + 3.0 },
        end: { x: arrowX + arrowGap - 6.0, y: arrowY },
        thickness: 1.0,
        color: d.DIVIDER_COLOR,
      });
      page.drawLine({
        start: { x: arrowX + arrowGap - 10.0, y: arrowY - 3.0 },
        end: { x: arrowX + arrowGap - 6.0, y: arrowY },
        thickness: 1.0,
        color: d.DIVIDER_COLOR,
      });
    }
  }

  return y - boxH - d.units(0.5);
}
