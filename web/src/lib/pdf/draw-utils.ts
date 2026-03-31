/**
 * Low-level drawing helpers — ported from lib/zpdf/page.zig
 *
 * pdf-lib does NOT have native rounded rectangles. This module provides
 * that primitive using the exact same KAPPA constant and cubic Bezier
 * curve construction as the Zig rendering engine, ensuring identical
 * output geometry.
 *
 * All coordinates follow PDF convention: origin at bottom-left, y up.
 */

import {
  type PDFPage,
  type Color,
  type PDFFont,
  pushGraphicsState,
  popGraphicsState,
  moveTo,
  lineTo,
  appendBezierCurve,
  setFillingRgbColor,
  setStrokingRgbColor,
  setLineWidth,
  fill,
  stroke,
  fillAndStroke,
  endPath,
  rgb,
} from 'pdf-lib';

// ---------------------------------------------------------------------------
// Kappa constant — magic number for approximating circular arcs with cubics.
// Four Bezier segments with this control-point offset produce a
// near-perfect circle (max radial error ~0.027%).
// ---------------------------------------------------------------------------

const KAPPA = 0.5522847498;

// ---------------------------------------------------------------------------
// Color helper
// ---------------------------------------------------------------------------

/**
 * Extract r, g, b components (0-1) from a pdf-lib Color object.
 *
 * pdf-lib's rgb() returns a Color with a `type` of 'RGB' and
 * properties `red`, `green`, `blue` in 0-1 range.
 */
export function colorComponents(color: Color): [number, number, number] {
  const c = color as unknown as { red: number; green: number; blue: number };
  return [c.red, c.green, c.blue];
}

// ---------------------------------------------------------------------------
// Rounded rectangle — faithful port of buildRoundedRectPath from page.zig
// ---------------------------------------------------------------------------

export interface RoundedRectOptions {
  /** Fill color (omit for no fill) */
  fillColor?: Color;
  /** Stroke/border color (omit for no stroke) */
  borderColor?: Color;
  /** Stroke line width (default 0.5) */
  borderWidth?: number;
}

/**
 * Draws a rounded rectangle at (x, y) with dimensions w x h and corner
 * radius r.  The (x, y) coordinate is the BOTTOM-LEFT corner of the rect
 * (matching PDF / Zig convention).
 *
 * Internally builds a closed path with four cubic Bezier corner arcs,
 * then fills and/or strokes based on options.
 */
export function drawRoundedRect(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  opts: RoundedRectOptions = {}
): void {
  const k = r * KAPPA;

  const hasFill = opts.fillColor !== undefined;
  const hasStroke = opts.borderColor !== undefined;
  const lw = opts.borderWidth ?? 0.5;

  // Build the operator list matching page.zig's buildRoundedRectPath exactly
  const ops = [pushGraphicsState()];

  // Set colors
  if (hasFill) {
    const [fr, fg, fb] = colorComponents(opts.fillColor!);
    ops.push(setFillingRgbColor(fr, fg, fb));
  }
  if (hasStroke) {
    const [sr, sg, sb] = colorComponents(opts.borderColor!);
    ops.push(setStrokingRgbColor(sr, sg, sb));
  }
  ops.push(setLineWidth(lw));

  // Start at bottom-left, just past the corner radius
  ops.push(moveTo(x + r, y));

  // Bottom edge -> bottom-right corner
  ops.push(lineTo(x + w - r, y));
  ops.push(appendBezierCurve(
    x + w - r + k, y,
    x + w, y + r - k,
    x + w, y + r
  ));

  // Right edge -> top-right corner
  ops.push(lineTo(x + w, y + h - r));
  ops.push(appendBezierCurve(
    x + w, y + h - r + k,
    x + w - r + k, y + h,
    x + w - r, y + h
  ));

  // Top edge -> top-left corner
  ops.push(lineTo(x + r, y + h));
  ops.push(appendBezierCurve(
    x + r - k, y + h,
    x, y + h - r + k,
    x, y + h - r
  ));

  // Left edge -> bottom-left corner (close)
  ops.push(lineTo(x, y + r));
  ops.push(appendBezierCurve(
    x, y + r - k,
    x + r - k, y,
    x + r, y
  ));

  // Close the path with the appropriate paint operator
  if (hasFill && hasStroke) {
    ops.push(fillAndStroke());
  } else if (hasFill) {
    ops.push(fill());
  } else if (hasStroke) {
    ops.push(stroke());
  } else {
    ops.push(endPath());
  }

  ops.push(popGraphicsState());

  page.pushOperators(...ops);
}

// ---------------------------------------------------------------------------
// Circle via Bezier curves — port of buildCirclePath from page.zig
//
// Note: pdf-lib has a built-in drawCircle, but we also expose this
// low-level version for cases where we need fill+stroke in a single
// graphics-state block (matching the Zig output exactly).
// ---------------------------------------------------------------------------

export interface CircleOptions {
  fillColor?: Color;
  borderColor?: Color;
  borderWidth?: number;
}

/**
 * Draws a circle centered at (cx, cy) with radius r using four cubic
 * Bezier segments (the standard KAPPA approximation).
 */
export function drawCirclePath(
  page: PDFPage,
  cx: number,
  cy: number,
  r: number,
  opts: CircleOptions = {}
): void {
  const k = r * KAPPA;
  const hasFill = opts.fillColor !== undefined;
  const hasStroke = opts.borderColor !== undefined;
  const lw = opts.borderWidth ?? 0.5;

  const ops = [pushGraphicsState()];

  if (hasFill) {
    const [fr, fg, fb] = colorComponents(opts.fillColor!);
    ops.push(setFillingRgbColor(fr, fg, fb));
  }
  if (hasStroke) {
    const [sr, sg, sb] = colorComponents(opts.borderColor!);
    ops.push(setStrokingRgbColor(sr, sg, sb));
  }
  ops.push(setLineWidth(lw));

  // Start at rightmost point
  ops.push(moveTo(cx + r, cy));

  // Quadrant 1: right -> top
  ops.push(appendBezierCurve(cx + r, cy + k, cx + k, cy + r, cx, cy + r));

  // Quadrant 2: top -> left
  ops.push(appendBezierCurve(cx - k, cy + r, cx - r, cy + k, cx - r, cy));

  // Quadrant 3: left -> bottom
  ops.push(appendBezierCurve(cx - r, cy - k, cx - k, cy - r, cx, cy - r));

  // Quadrant 4: bottom -> right (closes the circle)
  ops.push(appendBezierCurve(cx + k, cy - r, cx + r, cy - k, cx + r, cy));

  if (hasFill && hasStroke) {
    ops.push(fillAndStroke());
  } else if (hasFill) {
    ops.push(fill());
  } else if (hasStroke) {
    ops.push(stroke());
  } else {
    ops.push(endPath());
  }

  ops.push(popGraphicsState());

  page.pushOperators(...ops);
}
