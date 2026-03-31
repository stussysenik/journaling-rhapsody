/**
 * Main PDF renderer orchestrator — creates complete worksheet PDFs.
 *
 * Takes a Template (title + ordered sections), user answers, and a mode
 * (filled vs blank), then produces a complete PDF as a Uint8Array.
 *
 * This is the primary public API for the PDF rendering engine.
 */

import {
  PDFDocument,
  StandardFonts,
} from 'pdf-lib';

import type { Template, Fonts, TemplateSection } from './types.js';
import * as d from './design.js';
import { interpolateConfig } from './interpolate.js';

// Import all component renderers
import {
  renderHeader,
  renderSectionHeader,
  renderLinedBox,
  renderPromptLines,
  renderScale,
  renderLabeledScale,
  renderCheckboxRow,
  renderMoodGrid,
  renderBodyFigure,
  renderVenn2,
  renderVenn3,
  renderEisenhower,
  renderTimeline,
  renderConcentricCircles,
  renderConnectedBoxes,
  renderDualBox,
  renderPairedColumns,
  renderMomentumMeter,
  renderFooter,
} from './components/index.js';

import type {
  HeaderConfig,
  SectionHeaderConfig,
  LinedBoxConfig,
  PromptLinesConfig,
  ScaleConfig,
  LabeledScaleConfig,
  CheckboxRowConfig,
  MoodGridConfig,
  BodyFigureConfig,
  Venn2Config,
  Venn3Config,
  EisenhowerConfig,
  TimelineConfig,
  ConcentricCirclesConfig,
  ConnectedBoxesConfig,
  DualBoxConfig,
  PairedColumnsConfig,
  MomentumMeterConfig,
  FooterConfig,
} from './components/index.js';

/**
 * Render a complete worksheet PDF from a template.
 *
 * @param template  The worksheet template definition
 * @param answers   User answers keyed by blank_id (used in 'filled' mode)
 * @param mode      'filled' renders with answers; 'blank' renders empty worksheets
 * @returns         The PDF file as a Uint8Array
 */
export async function renderTemplate(
  template: Template,
  answers: Record<string, string> = {},
  mode: 'filled' | 'blank' = 'blank'
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed the three Helvetica font variants
  const [regular, bold, oblique] = await Promise.all([
    pdfDoc.embedFont(StandardFonts.Helvetica),
    pdfDoc.embedFont(StandardFonts.HelveticaBold),
    pdfDoc.embedFont(StandardFonts.HelveticaOblique),
  ]);

  const fonts: Fonts = { regular, bold, oblique };

  // Add a US Letter page
  const page = pdfDoc.addPage([d.PAGE_W, d.PAGE_H]);

  // Start the y cursor at the top of the content area.
  // The header component ignores the incoming y and uses CONTENT_TOP,
  // but subsequent components use the returned y.
  let y = d.CONTENT_TOP;

  // Iterate through template sections and render each
  for (const section of template.sections) {
    // Interpolate any {{blank_id}} patterns in the section config
    const config = interpolateConfig(
      section.config as Record<string, unknown>,
      answers,
      mode
    );

    y = renderSection(page, fonts, section.type, config, y);
  }

  // Serialize to bytes
  return await pdfDoc.save();
}

/**
 * Dispatch a single section to its component renderer.
 * Returns the updated y cursor position.
 */
function renderSection(
  page: Parameters<typeof renderHeader>[0],
  fonts: Fonts,
  type: string,
  config: Record<string, unknown>,
  y: number
): number {
  switch (type) {
    case 'header':
      return renderHeader(page, fonts, config as unknown as HeaderConfig, y);

    case 'section-header':
      return renderSectionHeader(page, fonts, config as unknown as SectionHeaderConfig, y);

    case 'lined-box':
      return renderLinedBox(page, fonts, config as unknown as LinedBoxConfig, y);

    case 'prompt-lines':
      return renderPromptLines(page, fonts, config as unknown as PromptLinesConfig, y);

    case 'scale':
      return renderScale(page, fonts, config as unknown as ScaleConfig, y);

    case 'labeled-scale':
      return renderLabeledScale(page, fonts, config as unknown as LabeledScaleConfig, y);

    case 'checkbox-row':
      return renderCheckboxRow(page, fonts, config as unknown as CheckboxRowConfig, y);

    case 'mood-grid':
      return renderMoodGrid(page, fonts, config as unknown as MoodGridConfig, y);

    case 'body-figure':
      renderBodyFigure(page, fonts, config as unknown as BodyFigureConfig, y);
      // Body figure doesn't return a new y — it's positioned absolutely.
      // Caller should manage y via subsequent section configs.
      return y;

    case 'venn2':
      renderVenn2(page, fonts, config as unknown as Venn2Config);
      return y; // Fixed-position component

    case 'venn3':
      renderVenn3(page, fonts, config as unknown as Venn3Config);
      return y; // Fixed-position component

    case 'eisenhower':
      return renderEisenhower(page, fonts, config as unknown as EisenhowerConfig, y);

    case 'timeline':
      return renderTimeline(page, fonts, config as unknown as TimelineConfig, y);

    case 'concentric-circles':
      renderConcentricCircles(page, fonts, config as unknown as ConcentricCirclesConfig);
      return y; // Fixed-position component

    case 'connected-boxes':
      return renderConnectedBoxes(page, fonts, config as unknown as ConnectedBoxesConfig, y);

    case 'dual-box':
      return renderDualBox(page, fonts, config as unknown as DualBoxConfig, y);

    case 'paired-columns':
      return renderPairedColumns(page, fonts, config as unknown as PairedColumnsConfig, y);

    case 'momentum-meter':
      return renderMomentumMeter(page, fonts, config as unknown as MomentumMeterConfig, y);

    case 'footer':
      renderFooter(page, fonts, config as unknown as FooterConfig);
      return y; // Footer is always at the bottom

    case 'y-adjust': {
      // Utility: adjust the y cursor by a delta (positive = up, negative = down)
      const delta = (config as { delta?: number }).delta ?? 0;
      return y + delta;
    }

    default:
      console.warn(`Unknown section type: "${type}" — skipping`);
      return y;
  }
}
