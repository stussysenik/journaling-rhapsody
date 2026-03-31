/**
 * Venn diagram components — ported from components.zig drawVenn2 + drawVenn3
 *
 * Two-circle and three-circle Venn diagrams with labeled zones
 * and write-in lines for journaling exercises.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { textWidth } from '../text-utils.js';

// ---------------------------------------------------------------------------
// Two-circle Venn
// ---------------------------------------------------------------------------

export interface Venn2Config {
  cx: number;
  cy: number;
  r: number;
  labelA: string;
  labelB: string;
}

/**
 * Draw a two-circle Venn diagram.
 * This is a fixed-position component (no y cursor return).
 */
export function renderVenn2(
  page: PDFPage,
  fonts: Fonts,
  config: Venn2Config
): void {
  const { cx, cy, r } = config;
  const offset = r * 0.6;

  // Circle A (left)
  page.drawCircle({
    x: cx - offset,
    y: cy,
    size: r,
    borderColor: d.DIVIDER_COLOR,
    borderWidth: 0.8,
  });

  // Circle B (right)
  page.drawCircle({
    x: cx + offset,
    y: cy,
    size: r,
    borderColor: d.DIVIDER_COLOR,
    borderWidth: 0.8,
  });

  // Labels above each circle
  const wa = textWidth(fonts.bold, config.labelA, d.BODY_SIZE);
  page.drawText(config.labelA, {
    x: cx - offset - wa * 0.5,
    y: cy + r + 8.0,
    font: fonts.bold,
    size: d.BODY_SIZE,
    color: d.TEXT_COLOR,
  });

  const wb = textWidth(fonts.bold, config.labelB, d.BODY_SIZE);
  page.drawText(config.labelB, {
    x: cx + offset - wb * 0.5,
    y: cy + r + 8.0,
    font: fonts.bold,
    size: d.BODY_SIZE,
    color: d.TEXT_COLOR,
  });

  // "Both" label in the overlap zone
  page.drawText('Both', {
    x: cx - 10.0,
    y: cy,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });

  // Write-in lines — left zone
  for (let i = 0; i < 3; i++) {
    const ly = cy - 10.0 - i * 12.0;
    page.drawLine({
      start: { x: cx - offset - r * 0.55, y: ly },
      end: { x: cx - offset + r * 0.3, y: ly },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });
  }

  // Write-in lines — right zone
  for (let i = 0; i < 3; i++) {
    const ly = cy - 10.0 - i * 12.0;
    page.drawLine({
      start: { x: cx + offset - r * 0.3, y: ly },
      end: { x: cx + offset + r * 0.55, y: ly },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });
  }
}

// ---------------------------------------------------------------------------
// Three-circle Venn
// ---------------------------------------------------------------------------

export interface Venn3Config {
  cx: number;
  cy: number;
  r: number;
  labels: [string, string, string];
}

/**
 * Draw a three-circle Venn diagram in triangular arrangement.
 * This is a fixed-position component (no y cursor return).
 */
export function renderVenn3(
  page: PDFPage,
  fonts: Fonts,
  config: Venn3Config
): void {
  const { cx, cy, r } = config;
  const offset = r * 0.55;

  // Three circle centers in triangular arrangement
  const centers: [number, number][] = [
    [cx, cy + offset * 0.6],           // top
    [cx - offset, cy - offset * 0.4],  // bottom-left
    [cx + offset, cy - offset * 0.4],  // bottom-right
  ];

  // Draw the three circles
  for (const [cxI, cyI] of centers) {
    page.drawCircle({
      x: cxI,
      y: cyI,
      size: r,
      borderColor: d.DIVIDER_COLOR,
      borderWidth: 0.8,
    });
  }

  // Labels outside each circle
  for (let i = 0; i < 3; i++) {
    const label = config.labels[i];
    const lw = textWidth(fonts.bold, label, d.BODY_SIZE);
    const lx = centers[i][0] - lw * 0.5;
    // Top circle label goes above; bottom circles go below
    const ly = i === 0 ? centers[i][1] + r + 8.0 : centers[i][1] - r - 8.0;

    page.drawText(label, {
      x: lx,
      y: ly,
      font: fonts.bold,
      size: d.BODY_SIZE,
      color: d.TEXT_COLOR,
    });
  }
}
