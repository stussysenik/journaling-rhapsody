/**
 * Momentum meter component — ported from components.zig drawMomentumMeter
 *
 * Renders a row of labeled circles for tracking momentum
 * (e.g., "Stuck", "Slow", "Steady", "Flying").
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { textWidth } from '../text-utils.js';

export interface MomentumMeterConfig {
  labels: string[];
  x?: number;
  w?: number;
}

/**
 * Draw a momentum meter with labeled circles.
 * Returns the new y cursor position.
 */
export function renderMomentumMeter(
  page: PDFPage,
  fonts: Fonts,
  config: MomentumMeterConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const w = config.w ?? d.CONTENT_W;

  // "Momentum:" label
  page.drawText('Momentum:', {
    x,
    y,
    font: fonts.bold,
    size: d.BODY_SIZE,
    color: d.TEXT_COLOR,
  });

  const n = config.labels.length;
  const meterX = x + 75.0;
  const meterW = w - 75.0;
  const spacing = meterW / n;

  for (let i = 0; i < n; i++) {
    const cx = meterX + i * spacing + spacing * 0.5;
    const cy = y + d.BODY_SIZE * 0.3;

    // Circle
    page.drawCircle({
      x: cx,
      y: cy,
      size: 8.0,
      color: d.WHITE,
      borderColor: d.GRID_COLOR,
      borderWidth: 0.5,
    });

    // Label below the circle
    const label = config.labels[i];
    const lw = textWidth(fonts.regular, label, d.CAPTION_SIZE);
    page.drawText(label, {
      x: cx - lw * 0.5,
      y: cy - 18.0,
      font: fonts.regular,
      size: d.CAPTION_SIZE,
      color: d.CAPTION_COLOR,
    });
  }

  return y - d.units(2.0);
}
