/**
 * Mood grid component — ported from components.zig drawMoodGrid
 *
 * Renders a 2x2 grid based on Marc Brackett's Mood Meter (RULER framework).
 * Axes: Energy (vertical) x Pleasantness (horizontal).
 * Each quadrant has a subtle tint fill and a list of emotion words.
 */

import { rgb, type PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';

export interface MoodGridConfig {
  /** Size of the grid (square, in points) */
  size: number;
  /** Four arrays of emotion words: [top-left, top-right, bottom-left, bottom-right] */
  quadrantWords: [string[], string[], string[], string[]];
  /** X position of the grid left edge (defaults to centered in content area) */
  x?: number;
}

/**
 * Draw the 2x2 mood grid with emotion words.
 * Returns the new y cursor position below the grid.
 */
export function renderMoodGrid(
  page: PDFPage,
  fonts: Fonts,
  config: MoodGridConfig,
  y: number
): number {
  const size = config.size;
  const half = size * 0.5;
  const x = config.x ?? (d.CONTENT_LEFT + (d.CONTENT_W - size) * 0.5);

  // Quadrant background tints — matching the Zig source exactly
  const qColors = [
    rgb(0.98, 0.93, 0.93), // top-left: high energy unpleasant (warm red tint)
    rgb(0.93, 0.98, 0.93), // top-right: high energy pleasant (green tint)
    rgb(0.93, 0.93, 0.98), // bottom-left: low energy unpleasant (blue tint)
    rgb(0.98, 0.97, 0.93), // bottom-right: low energy pleasant (warm yellow tint)
  ];

  // Fill quadrants
  // Top-left quadrant
  page.drawRectangle({
    x,
    y: y - half,
    width: half,
    height: half,
    color: qColors[0],
  });
  // Top-right quadrant
  page.drawRectangle({
    x: x + half,
    y: y - half,
    width: half,
    height: half,
    color: qColors[1],
  });
  // Bottom-left quadrant
  page.drawRectangle({
    x,
    y: y - size,
    width: half,
    height: half,
    color: qColors[2],
  });
  // Bottom-right quadrant
  page.drawRectangle({
    x: x + half,
    y: y - size,
    width: half,
    height: half,
    color: qColors[3],
  });

  // Grid lines — outer border + midlines
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

  // Axis labels
  // Y-axis: "HIGH" and "LOW"
  page.drawText('HIGH', {
    x: x - 16.0,
    y: y - half * 0.5,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });
  page.drawText('LOW', {
    x: x - 14.0,
    y: y - half * 1.5,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });
  // X-axis: "UNPLEASANT" and "PLEASANT"
  page.drawText('UNPLEASANT', {
    x: x + half * 0.35,
    y: y - size - 10.0,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });
  page.drawText('PLEASANT', {
    x: x + half * 1.35,
    y: y - size - 10.0,
    font: fonts.oblique,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });
  // Top label: "ENERGY"
  page.drawText('ENERGY', {
    x: x + half * 0.5 - 15.0,
    y: y + 4.0,
    font: fonts.bold,
    size: d.CAPTION_SIZE,
    color: d.CAPTION_COLOR,
  });

  // Emotion words in each quadrant
  const positions: [number, number][] = [
    [x + 8.0, y - 10.0],                  // top-left
    [x + half + 8.0, y - 10.0],           // top-right
    [x + 8.0, y - half - 10.0],           // bottom-left
    [x + half + 8.0, y - half - 10.0],    // bottom-right
  ];

  for (let q = 0; q < 4; q++) {
    const words = config.quadrantWords[q];
    const bx = positions[q][0];
    let wy = positions[q][1];

    for (const word of words) {
      page.drawText(word, {
        x: bx,
        y: wy,
        font: fonts.regular,
        size: 7.5,
        color: d.TEXT_COLOR,
      });
      wy -= 11.0;
    }
  }

  return y - size - d.units(1.0);
}
