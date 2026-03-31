/**
 * Footer component — ported from components.zig drawFooter
 *
 * Renders a centered disclaimer at the bottom of every worksheet page.
 * Includes a thin divider line above the text.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';
import { centerTextX } from '../text-utils.js';

export interface FooterConfig {
  /** Override disclaimer text (defaults to the standard experimental disclaimer) */
  text?: string;
}

const DEFAULT_DISCLAIMER =
  'FOR EXPERIMENTAL PURPOSES ONLY \u2014 NOT A SUBSTITUTE FOR PROFESSIONAL MENTAL HEALTH CARE';

/**
 * Draw the page footer with disclaimer text.
 * This always renders at the bottom of the content area.
 */
export function renderFooter(
  page: PDFPage,
  fonts: Fonts,
  config: FooterConfig = {}
): void {
  const text = config.text ?? DEFAULT_DISCLAIMER;
  const footerY = d.CONTENT_BOTTOM - d.units(0.5);
  const fontSize = 6.5;

  // Divider line above disclaimer
  page.drawLine({
    start: { x: d.CONTENT_LEFT, y: footerY + 10.0 },
    end: { x: d.CONTENT_RIGHT, y: footerY + 10.0 },
    thickness: 0.3,
    color: d.DIVIDER_COLOR,
  });

  // Centered disclaimer text
  const textX = centerTextX(fonts.oblique, text, fontSize, d.CONTENT_LEFT, d.CONTENT_W);
  page.drawText(text, {
    x: textX,
    y: footerY,
    font: fonts.oblique,
    size: fontSize,
    color: d.CAPTION_COLOR,
  });
}
