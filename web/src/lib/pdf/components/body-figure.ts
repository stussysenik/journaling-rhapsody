/**
 * Body figure component — ported from components.zig drawBodyFigure
 *
 * Renders a geometric stick figure for body scan exercises.
 * The figure has annotation lines pointing to head, chest,
 * stomach, hands, and feet for the user to note sensations.
 */

import type { PDFPage } from 'pdf-lib';
import type { Fonts } from '../types.js';
import * as d from '../design.js';

export interface BodyFigureConfig {
  x?: number;
  y?: number;
}

/**
 * Draw the geometric body figure with annotation labels.
 * This is a fixed-position component — it does not return a y cursor.
 * Caller manages layout.
 */
export function renderBodyFigure(
  page: PDFPage,
  fonts: Fonts,
  config: BodyFigureConfig,
  y: number
): void {
  const x = config.x ?? (d.CONTENT_RIGHT - 80.0);
  const figY = config.y ?? (y + 5.0);

  const color = d.DIVIDER_COLOR;
  const thickness = 0.8;

  // Head (circle)
  page.drawCircle({
    x,
    y: figY,
    size: 12.0,
    borderColor: color,
    borderWidth: thickness,
  });

  // Neck
  page.drawLine({
    start: { x, y: figY - 12.0 },
    end: { x, y: figY - 18.0 },
    thickness,
    color,
  });

  // Torso (rectangle)
  page.drawRectangle({
    x: x - 18.0,
    y: figY - 60.0,
    width: 36.0,
    height: 42.0,
    borderColor: color,
    borderWidth: thickness,
  });

  // Arms
  page.drawLine({
    start: { x: x - 18.0, y: figY - 22.0 },
    end: { x: x - 38.0, y: figY - 48.0 },
    thickness,
    color,
  });
  page.drawLine({
    start: { x: x + 18.0, y: figY - 22.0 },
    end: { x: x + 38.0, y: figY - 48.0 },
    thickness,
    color,
  });

  // Legs
  page.drawLine({
    start: { x: x - 10.0, y: figY - 60.0 },
    end: { x: x - 20.0, y: figY - 90.0 },
    thickness,
    color,
  });
  page.drawLine({
    start: { x: x + 10.0, y: figY - 60.0 },
    end: { x: x + 20.0, y: figY - 90.0 },
    thickness,
    color,
  });

  // Annotation lines and labels for 5 body points
  const points: [number, number][] = [
    [x + 14.0, figY],            // head
    [x + 20.0, figY - 30.0],    // chest
    [x + 20.0, figY - 50.0],    // stomach
    [x - 40.0, figY - 48.0],    // left hand
    [x + 22.0, figY - 90.0],    // feet
  ];
  const lineLabels = ['Head', 'Chest', 'Stomach', 'Hands', 'Feet'];

  for (let i = 0; i < 5; i++) {
    const px = points[i][0];
    const py = points[i][1];
    // For hands (i===3), annotation extends left; otherwise right
    const lx = i === 3 ? px - 60.0 : px + 20.0;

    // Leader line from body point to annotation
    page.drawLine({
      start: { x: px, y: py },
      end: { x: lx, y: py },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });
    // Annotation line (for writing)
    page.drawLine({
      start: { x: lx, y: py },
      end: { x: lx + 40.0, y: py },
      thickness: 0.3,
      color: d.GRID_COLOR,
    });

    // Label text
    page.drawText(lineLabels[i], {
      x: lx + 2.0,
      y: py + 3.0,
      font: fonts.oblique,
      size: d.CAPTION_SIZE,
      color: d.CAPTION_COLOR,
    });
  }
}
