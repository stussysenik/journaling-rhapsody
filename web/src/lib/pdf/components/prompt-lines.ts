/**
 * Prompt lines component — ported from components.zig drawPromptLines
 *
 * Renders a bold prompt string followed by evenly-spaced ruled lines
 * for writing. No box or background — just text and lines.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';

export interface PromptLinesConfig {
  prompt: string;
  numLines: number;
  x?: number;
  w?: number;
}

/**
 * Draw a prompt with ruled lines below it (no box).
 * Returns the new y cursor position below the last line.
 */
export function renderPromptLines(
  page: PDFPage,
  fonts: Fonts,
  config: PromptLinesConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const w = config.w ?? d.CONTENT_W;

  // Prompt text
  page.drawText(config.prompt, {
    x,
    y,
    font: fonts.bold,
    size: d.BODY_SIZE,
    color: d.TEXT_COLOR,
  });

  // Ruled lines
  let ly = y - d.BODY_LEADING - 2.0;
  for (let i = 0; i < config.numLines; i++) {
    page.drawLine({
      start: { x, y: ly },
      end: { x: x + w, y: ly },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });
    ly -= d.BODY_LEADING;
  }

  return ly - d.units(0.3);
}
