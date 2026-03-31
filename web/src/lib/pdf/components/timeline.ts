/**
 * Timeline component — ported from components.zig drawTimeline
 *
 * Renders a horizontal timeline with circle checkpoints.
 * Each checkpoint has a write-in line below for notes and
 * a "date:" label beneath that.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';

export interface TimelineConfig {
  numPoints: number;
  x?: number;
  w?: number;
}

/**
 * Draw a horizontal timeline with checkpoint circles.
 * Returns the new y cursor position below the timeline.
 */
export function renderTimeline(
  page: PDFPage,
  fonts: Fonts,
  config: TimelineConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const w = config.w ?? d.CONTENT_W;
  const r = 8.0;

  // Main horizontal line
  page.drawLine({
    start: { x, y },
    end: { x: x + w, y },
    thickness: 1.0,
    color: d.DIVIDER_COLOR,
  });

  // Checkpoint circles
  const spacing = w / (config.numPoints + 1);

  for (let i = 0; i < config.numPoints; i++) {
    const cx = x + spacing * (i + 1);

    // White filled circle with border
    page.drawCircle({
      x: cx,
      y,
      size: r,
      color: d.WHITE,
      borderColor: d.DIVIDER_COLOR,
      borderWidth: 0.8,
    });

    // Write-in line below checkpoint
    page.drawLine({
      start: { x: cx - 30.0, y: y - 22.0 },
      end: { x: cx + 30.0, y: y - 22.0 },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });

    // Date label
    page.drawText('date:', {
      x: cx - 12.0,
      y: y - 32.0,
      font: fonts.oblique,
      size: d.CAPTION_SIZE,
      color: d.CAPTION_COLOR,
    });
  }

  return y - d.units(2.5);
}
