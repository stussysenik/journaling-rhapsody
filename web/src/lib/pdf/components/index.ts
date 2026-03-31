/**
 * Component barrel export.
 *
 * Re-exports all component renderers so the orchestrator can
 * import them from a single path.
 */

export { renderHeader, type HeaderConfig } from './header.js';
export { renderSectionHeader, type SectionHeaderConfig } from './section-header.js';
export { renderLinedBox, type LinedBoxConfig } from './lined-box.js';
export { renderPromptLines, type PromptLinesConfig } from './prompt-lines.js';
export { renderScale, renderLabeledScale, type ScaleConfig, type LabeledScaleConfig } from './scale.js';
export { renderCheckboxRow, type CheckboxRowConfig } from './checkbox-row.js';
export { renderMoodGrid, type MoodGridConfig } from './mood-grid.js';
export { renderBodyFigure, type BodyFigureConfig } from './body-figure.js';
export { renderVenn2, renderVenn3, type Venn2Config, type Venn3Config } from './venn.js';
export { renderEisenhower, type EisenhowerConfig } from './eisenhower.js';
export { renderTimeline, type TimelineConfig } from './timeline.js';
export { renderConcentricCircles, type ConcentricCirclesConfig } from './concentric-circles.js';
export { renderConnectedBoxes, type ConnectedBoxesConfig } from './connected-boxes.js';
export { renderDualBox, type DualBoxConfig } from './dual-box.js';
export { renderPairedColumns, type PairedColumnsConfig } from './paired-columns.js';
export { renderMomentumMeter, type MomentumMeterConfig } from './momentum-meter.js';
export { renderFooter, type FooterConfig } from './footer.js';
