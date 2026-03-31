/**
 * Lined box component — ported from components.zig drawLinedBox
 *
 * Renders a gray rounded rectangle with an optional prompt text at the top
 * and evenly-spaced ruled lines for writing.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { drawRoundedRect } from '../draw-utils.js';

export interface LinedBoxConfig {
  prompt: string;
  numLines: number;
  x?: number;
  w?: number;
  h?: number;
}

/**
 * Draw a lined box with optional prompt.
 * The box top-edge is at `y`, and the box extends downward by `h`.
 * Returns the new y cursor position below the box.
 */
export function renderLinedBox(
  page: PDFPage,
  fonts: Fonts,
  config: LinedBoxConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const w = config.w ?? d.CONTENT_W;
  const h = config.h ?? 80.0;
  const numLines = config.numLines;

  // Background fill — box bottom-left is at (x, y - h)
  drawRoundedRect(page, x, y - h, w, h, d.CORNER_R, {
    fillColor: d.BG_FILL_COLOR,
  });

  // Border stroke
  drawRoundedRect(page, x, y - h, w, h, d.CORNER_R, {
    borderColor: d.GRID_COLOR,
    borderWidth: 0.5,
  });

  // Prompt text (if non-empty)
  if (config.prompt) {
    page.drawText(config.prompt, {
      x: x + 10.0,
      y: y - 14.0,
      font: fonts.bold,
      size: d.BODY_SIZE,
      color: d.TEXT_COLOR,
    });
  }

  // Ruled lines
  const lineStartY = y - 28.0;
  const usableH = h - 36.0;
  const lineSpacing = numLines > 0 ? usableH / numLines : d.BODY_LEADING;

  for (let i = 0; i < numLines; i++) {
    const ly = lineStartY - i * lineSpacing;
    page.drawLine({
      start: { x: x + 10.0, y: ly },
      end: { x: x + w - 10.0, y: ly },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });
  }

  return y - h - d.units(0.4);
}
