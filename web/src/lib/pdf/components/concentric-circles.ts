/**
 * Concentric circles component — ported from components.zig drawConcentricCircles
 *
 * Renders two concentric circles (e.g., "Circle of Control" exercise).
 * The inner circle represents what you can control, the outer circle
 * represents what you can influence.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { textWidth } from '../text-utils.js';

export interface ConcentricCirclesConfig {
  cx: number;
  cy: number;
  rInner: number;
  rOuter: number;
  labelInner: string;
  labelOuter: string;
}

/**
 * Draw two concentric circles with labels.
 * This is a fixed-position component (no y cursor return).
 */
export function renderConcentricCircles(
  page: PDFPage,
  fonts: Fonts,
  config: ConcentricCirclesConfig
): void {
  const { cx, cy, rInner, rOuter } = config;

  // Outer circle
  page.drawCircle({
    x: cx,
    y: cy,
    size: rOuter,
    borderColor: d.GRID_COLOR,
    borderWidth: 0.8,
  });

  // Inner circle
  page.drawCircle({
    x: cx,
    y: cy,
    size: rInner,
    borderColor: d.DIVIDER_COLOR,
    borderWidth: 1.0,
  });

  // Inner label — centered just below the top of the inner circle
  const iw = textWidth(fonts.bold, config.labelInner, d.CAPTION_SIZE);
  page.drawText(config.labelInner, {
    x: cx - iw * 0.5,
    y: cy + rInner - 14.0,
    font: fonts.bold,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });

  // Outer label — centered just below the top of the outer circle
  const ow = textWidth(fonts.bold, config.labelOuter, d.CAPTION_SIZE);
  page.drawText(config.labelOuter, {
    x: cx - ow * 0.5,
    y: cy + rOuter - 10.0,
    font: fonts.bold,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });
}
