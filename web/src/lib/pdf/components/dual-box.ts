/**
 * Dual box component — ported from components.zig drawDualBox
 *
 * Renders two equal-width lined boxes side by side, each with
 * its own label and write-in lines. Useful for comparison exercises
 * (e.g., "Pros" vs "Cons").
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { renderLinedBox } from './lined-box.js';

export interface DualBoxConfig {
  labelA: string;
  labelB: string;
  linesPerBox: number;
  x?: number;
  w?: number;
  h?: number;
}

/**
 * Draw two side-by-side lined boxes.
 * Returns the new y cursor position below the boxes.
 */
export function renderDualBox(
  page: PDFPage,
  fonts: Fonts,
  config: DualBoxConfig,
  y: number
): number {
  const x = config.x ?? d.CONTENT_LEFT;
  const w = config.w ?? d.CONTENT_W;
  const h = config.h ?? 80.0;
  const gap = d.UNIT * 0.5;
  const boxW = (w - gap) * 0.5;

  // Box A (left)
  renderLinedBox(page, fonts, {
    prompt: config.labelA,
    numLines: config.linesPerBox,
    x,
    w: boxW,
    h,
  }, y);

  // Box B (right)
  renderLinedBox(page, fonts, {
    prompt: config.labelB,
    numLines: config.linesPerBox,
    x: x + boxW + gap,
    w: boxW,
    h,
  }, y);

  return y - h - d.units(0.4);
}
