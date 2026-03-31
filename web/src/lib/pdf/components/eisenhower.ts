/**
 * Eisenhower matrix component — ported from components.zig drawEisenhower
 *
 * Renders a 2x2 decision matrix with quadrant labels:
 *   Top-left: Urgent + Important
 *   Top-right: Not Urgent + Important
 *   Bottom-left: Urgent + Not Important
 *   Bottom-right: Neither
 *
 * Each quadrant has write-in lines.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';

export interface EisenhowerConfig {
  size: number;
  x?: number;
}

/**
 * Draw the Eisenhower 2x2 matrix.
 * Returns the new y cursor position below the matrix.
 */
export function renderEisenhower(
  page: PDFPage,
  fonts: Fonts,
  config: EisenhowerConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const size = config.size;
  const half = size * 0.5;

  // Grid — outer border
  page.drawRectangle({
    x,
    y: y - size,
    width: size,
    height: size,
    borderColor: d.DIVIDER_COLOR,
    borderWidth: 0.8,
  });

  // Horizontal midline
  page.drawLine({
    start: { x, y: y - half },
    end: { x: x + size, y: y - half },
    thickness: 0.8,
    color: d.DIVIDER_COLOR,
  });

  // Vertical midline
  page.drawLine({
    start: { x: x + half, y },
    end: { x: x + half, y: y - size },
    thickness: 0.8,
    color: d.DIVIDER_COLOR,
  });

  // Quadrant labels (bold, caption size)
  const labels = [
    { text: 'URGENT + IMPORTANT', x: x + 6.0, y: y - 10.0 },
    { text: 'NOT URGENT + IMPORTANT', x: x + half + 6.0, y: y - 10.0 },
    { text: 'URGENT + NOT IMPORTANT', x: x + 6.0, y: y - half - 10.0 },
    { text: 'NEITHER', x: x + half + 6.0, y: y - half - 10.0 },
  ];
  for (const label of labels) {
    page.drawText(label.text, {
      x: label.x,
      y: label.y,
      font: fonts.bold,
      size: d.CAPTION_SIZE,
      color: d.CAPTION_COLOR,
    });
  }

  // Axis labels (oblique)
  page.drawText('URGENT', {
    x: x + half * 0.5 - 15.0,
    y: y + 5.0,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });
  page.drawText('NOT URGENT', {
    x: x + half * 1.5 - 20.0,
    y: y + 5.0,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });
  page.drawText('I', {
    x: x - 8.0,
    y: y - half * 0.5 + 3.0,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });
  page.drawText('N', {
    x: x - 8.0,
    y: y - half * 1.5 + 3.0,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });

  // Write-in lines in each quadrant (3 lines per quadrant)
  const offsetsX = [x + 8.0, x + half + 8.0];
  const offsetsY = [y - 22.0, y - half - 22.0];

  for (const oy of offsetsY) {
    for (const ox of offsetsX) {
      for (let i = 0; i < 3; i++) {
        const ly = oy - i * 14.0;
        page.drawLine({
          start: { x: ox, y: ly },
          end: { x: ox + half - 16.0, y: ly },
          thickness: 0.3,
          color: d.GRID_COLOR,
        });
      }
    }
  }

  return y - size - d.units(0.5);
}
