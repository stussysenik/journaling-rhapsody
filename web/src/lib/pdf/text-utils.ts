/**
 * Text measurement and layout helpers for pdf-lib.
 *
 * Uses pdf-lib's built-in font.widthOfTextAtSize() for accurate
 * measurement with the embedded Helvetica metrics (no need to port
 * the Zig font width tables — pdf-lib ships its own).
 */

import type { PDFFont } from 'pdf-lib';

/**
 * Measure the width of a text string at a given font size.
 * Thin wrapper around pdf-lib's built-in measurement.
 */
export function textWidth(font: PDFFont, text: string, size: number): number {
  return font.widthOfTextAtSize(text, size);
}

/**
 * Compute the x position that centers `text` within a container
 * of width `containerW` starting at `containerX`.
 */
export function centerTextX(
  font: PDFFont,
  text: string,
  size: number,
  containerX: number,
  containerW: number
): number {
  const tw = font.widthOfTextAtSize(text, size);
  return containerX + (containerW - tw) * 0.5;
}

/**
 * Word-wrap text to fit within `maxWidth` at the given font size.
 * Returns an array of lines. Breaks only at whitespace boundaries.
 */
export function wrapText(
  font: PDFFont,
  text: string,
  size: number,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!word) continue;

    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const candidateWidth = font.widthOfTextAtSize(candidate, size);

    if (candidateWidth <= maxWidth || !currentLine) {
      // Fits on current line, or it's the first word (must take it)
      currentLine = candidate;
    } else {
      // Push current line and start new one
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [''];
}
