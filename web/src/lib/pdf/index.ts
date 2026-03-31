/**
 * feelcheck PDF rendering engine — JavaScript port of the Zig renderer.
 *
 * Public API:
 *   renderTemplate(template, answers, mode) -> Promise<Uint8Array>
 *
 * Usage:
 *   import { renderTemplate } from '$lib/pdf';
 *
 *   const pdfBytes = await renderTemplate(myTemplate, {}, 'blank');
 *   // pdfBytes is a Uint8Array ready to download or display
 */

export { renderTemplate } from './renderer.js';
export type { Template, TemplateSection, Fonts } from './types.js';
export { interpolate, interpolateConfig } from './interpolate.js';

// Re-export design constants for consumers that need direct access
export * as design from './design.js';

// Re-export all components for direct use (advanced)
export * from './components/index.js';
