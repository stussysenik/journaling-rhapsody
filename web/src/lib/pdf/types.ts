/**
 * Shared types for the PDF rendering engine.
 */

import type { PDFFont } from 'pdf-lib';

/**
 * The three Helvetica font variants used throughout all worksheets.
 * These must be embedded into the PDFDocument before rendering.
 */
export interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
  oblique: PDFFont;
}

/**
 * A template section describes one visual component to render.
 * The `type` field selects which component renderer to call,
 * and `config` carries the component-specific parameters.
 */
export interface TemplateSection {
  type: string;
  config: Record<string, unknown>;
}

/**
 * A worksheet template: metadata + ordered list of sections.
 */
export interface Template {
  title: string;
  sections: TemplateSection[];
}
