/**
 * Scale component — ported from components.zig drawScale + drawLabeledScale
 *
 * Renders a numbered scale (1..max) as hollow circles with numbers inside,
 * preceded by a bold label. The labeled variant adds low/high endpoint text.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { textWidth } from '../text-utils.js';

export interface ScaleConfig {
  label: string;
  max: number;
  x?: number;
  w?: number;
}

export interface LabeledScaleConfig extends ScaleConfig {
  lowLabel: string;
  highLabel: string;
}

/**
 * Draw a numbered scale (1..max) with a label.
 * Returns the new y cursor position.
 */
export function renderScale(
  page: PDFPage,
  fonts: Fonts,
  config: ScaleConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const w = config.w ?? d.CONTENT_W;

  // Label
  page.drawText(config.label, {
    x,
    y,
    font: fonts.bold,
    size: d.BODY_SIZE,
    color: d.TEXT_COLOR,
  });

  // Dots (numbered circles)
  const dotAreaX = x + 160.0;
  const dotAreaW = w - 160.0;
  const spacing = dotAreaW / config.max;

  for (let i = 0; i < config.max; i++) {
    const cx = dotAreaX + i * spacing + spacing * 0.5;
    const cy = y + d.BODY_SIZE * 0.3;

    // White filled circle with gray border
    page.drawCircle({
      x: cx,
      y: cy,
      size: 7.0,
      color: d.WHITE,
      borderColor: d.GRID_COLOR,
      borderWidth: 0.5,
    });

    // Number inside the circle
    const numStr = String(i + 1);
    const numW = textWidth(fonts.regular, numStr, d.LABEL_SIZE);
    page.drawText(numStr, {
      x: cx - numW * 0.5,
      y: cy - d.LABEL_SIZE * 0.35,
      font: fonts.regular,
      size: d.LABEL_SIZE,
      color: d.CAPTION_COLOR,
    });
  }

  return y - d.units(1.2);
}

/**
 * Draw a labeled scale with low/high endpoint text.
 * Returns the new y cursor position.
 */
export function renderLabeledScale(
  page: PDFPage,
  fonts: Fonts,
  config: LabeledScaleConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const w = config.w ?? d.CONTENT_W;

  const result = renderScale(page, fonts, config, y);

  // Low/high endpoint labels
  page.drawText(config.lowLabel, {
    x: x + 160.0,
    y: y - d.BODY_LEADING,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });

  const hw = textWidth(fonts.oblique, config.highLabel, d.CAPTION_SIZE);
  page.drawText(config.highLabel, {
    x: x + w - hw,
    y: y - d.BODY_LEADING,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });

  return result;
}
