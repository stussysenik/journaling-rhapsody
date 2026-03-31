/**
 * Template Schema Types for feelcheck
 *
 * These types define the JSON template format that drives the MadLibs-style
 * worksheet renderer. Each template maps 1:1 to a printable PDF worksheet
 * from the original Zig codebase.
 *
 * Blank types correspond to interactive fill-in fields.
 * Section types correspond to visual components (from components.zig).
 */

// ---------------------------------------------------------------------------
// Blank Types — interactive fields the user fills in
// ---------------------------------------------------------------------------

/** The kind of input a blank expects from the user. */
export type BlankType = 'text' | 'textarea' | 'choice' | 'multi' | 'scale' | 'date';

/**
 * A single fillable blank in the template.
 *
 * - `text`: short single-line input
 * - `textarea`: multi-line freeform input
 * - `choice`: pick one from `options`
 * - `multi`: pick many from `options` (checkboxes)
 * - `scale`: numeric rating from `min` to `max`
 * - `date`: date picker
 */
export interface Blank {
  /** Unique identifier within this template (e.g. "trigger", "mood_energy"). */
  id: string;
  /** Human-readable prompt shown to the user. */
  prompt: string;
  /** Input type. */
  type: BlankType;
  /** Placeholder hint text for text/textarea inputs. */
  placeholder?: string;
  /** Whether the blank must be filled before submission. */
  required?: boolean;
  /** Available options for choice/multi blanks. */
  options?: string[];
  /** Minimum value for scale blanks (default 1). */
  min?: number;
  /** Maximum value for scale blanks. */
  max?: number;
  /** Label shown at the low end of a scale. */
  lowLabel?: string;
  /** Label shown at the high end of a scale. */
  highLabel?: string;
}

// ---------------------------------------------------------------------------
// Section Types — visual components that render on the worksheet
// ---------------------------------------------------------------------------

/**
 * Every section type that the renderer understands.
 *
 * Standard types map to functions in components.zig:
 *   drawHeader         → "header"
 *   drawSectionHeader  → "section_header"
 *   drawLinedBox        → "lined_box"
 *   drawPromptLines     → "prompt_lines"
 *   drawScale           → "scale"
 *   drawLabeledScale    → "labeled_scale"
 *   drawCheckboxRow     → "checkbox_row"
 *   drawMoodGrid        → "mood_grid"
 *   drawBodyFigure      → "body_figure"
 *   drawVenn2           → "venn2"
 *   drawVenn3           → "venn3"
 *   drawEisenhower      → "eisenhower"
 *   drawTimeline        → "timeline"
 *   drawConnectedBoxes  → "connected_boxes"
 *   drawConcentricCircles → "concentric_circles"
 *   drawDualBox         → "dual_box"
 *   drawMomentumMeter   → "momentum_meter"
 *   drawPairedColumns   → "paired_columns"
 *   drawFooter          → "footer"
 *
 * Extended types (derived from worksheet analysis):
 *   mini_mood_tracker   → 7-day mini mood grid (weekly.zig custom render)
 *   okr_breakdown       → OKR objectives + key results (goals.zig custom render)
 *   multi_column_boxes  → N equal-width boxes in a row (decide.zig second-order)
 *   layout              → horizontal/vertical split wrapper
 */
export type SectionType =
  | 'header'
  | 'section_header'
  | 'lined_box'
  | 'prompt_lines'
  | 'scale'
  | 'labeled_scale'
  | 'checkbox_row'
  | 'mood_grid'
  | 'body_figure'
  | 'venn2'
  | 'venn3'
  | 'eisenhower'
  | 'timeline'
  | 'connected_boxes'
  | 'concentric_circles'
  | 'dual_box'
  | 'momentum_meter'
  | 'paired_columns'
  | 'footer'
  | 'mini_mood_tracker'
  | 'okr_breakdown'
  | 'multi_column_boxes'
  | 'layout';

// --- Individual section config interfaces ---

export interface HeaderSection {
  type: 'header';
  title: string;
}

export interface SectionHeaderSection {
  type: 'section_header';
  title: string;
}

export interface LinedBoxSection {
  type: 'lined_box';
  prompt: string;
  lines: number;
  /** ID of the blank this box binds to (for MadLibs fill-in). */
  blankId?: string;
}

export interface PromptLinesSection {
  type: 'prompt_lines';
  prompt: string;
  lines: number;
  blankId?: string;
}

export interface ScaleSection {
  type: 'scale';
  label: string;
  max: number;
  blankId?: string;
}

export interface LabeledScaleSection {
  type: 'labeled_scale';
  label: string;
  max: number;
  lowLabel: string;
  highLabel: string;
  blankId?: string;
}

export interface CheckboxRowSection {
  type: 'checkbox_row';
  labels: string[];
  blankId?: string;
}

export interface MoodGridSection {
  type: 'mood_grid';
  /** Quadrant words: [highUnpleasant, highPleasant, lowUnpleasant, lowPleasant]. */
  quadrants: [string[], string[], string[], string[]];
  blankId?: string;
}

export interface BodyFigureSection {
  type: 'body_figure';
  /** Annotation points on the body figure. */
  annotations: string[];
}

export interface Venn2Section {
  type: 'venn2';
  labelA: string;
  labelB: string;
}

export interface Venn3Section {
  type: 'venn3';
  labels: [string, string, string];
}

export interface EisenhowerSection {
  type: 'eisenhower';
}

export interface TimelineSection {
  type: 'timeline';
  points: number;
}

export interface ConnectedBoxesSection {
  type: 'connected_boxes';
  labels: string[];
}

export interface ConcentricCirclesSection {
  type: 'concentric_circles';
  innerLabel: string;
  outerLabel: string;
}

export interface DualBoxSection {
  type: 'dual_box';
  labelA: string;
  labelB: string;
  linesPerBox: number;
}

export interface MomentumMeterSection {
  type: 'momentum_meter';
  labels: string[];
  blankId?: string;
}

export interface PairedColumnsSection {
  type: 'paired_columns';
  labelA: string;
  labelB: string;
  rows: number;
}

export interface FooterSection {
  type: 'footer';
}

/** 7-day mini mood tracker grid (from weekly.zig). */
export interface MiniMoodTrackerSection {
  type: 'mini_mood_tracker';
  days: string[];
}

/** OKR breakdown with objectives and key results (from goals.zig). */
export interface OkrBreakdownSection {
  type: 'okr_breakdown';
  objectives: number;
  keyResultsPerObjective: number;
}

/** N equal-width boxes in a row, each with a label and lines (from decide.zig). */
export interface MultiColumnBoxesSection {
  type: 'multi_column_boxes';
  columns: { label: string; lines: number }[];
}

/** Horizontal or vertical layout wrapper that contains child sections. */
export interface LayoutSection {
  type: 'layout';
  direction: 'horizontal' | 'vertical';
  children: Section[];
}

/**
 * Discriminated union of all section types.
 * The `type` field determines which config fields are present.
 */
export type Section =
  | HeaderSection
  | SectionHeaderSection
  | LinedBoxSection
  | PromptLinesSection
  | ScaleSection
  | LabeledScaleSection
  | CheckboxRowSection
  | MoodGridSection
  | BodyFigureSection
  | Venn2Section
  | Venn3Section
  | EisenhowerSection
  | TimelineSection
  | ConnectedBoxesSection
  | ConcentricCirclesSection
  | DualBoxSection
  | MomentumMeterSection
  | PairedColumnsSection
  | FooterSection
  | MiniMoodTrackerSection
  | OkrBreakdownSection
  | MultiColumnBoxesSection
  | LayoutSection;

// ---------------------------------------------------------------------------
// Template — the top-level document
// ---------------------------------------------------------------------------

/** Worksheet category for filtering/grouping. */
export type TemplateCategory =
  | 'mood'
  | 'reflection'
  | 'goals'
  | 'decision'
  | 'resilience'
  | 'progress';

/** Publication status of a template. */
export type TemplateStatus = 'draft' | 'published' | 'archived';

/**
 * A complete worksheet template.
 *
 * Templates are the data model that drives both the MadLibs fill-in UI
 * and the PDF renderer. Each template contains an ordered list of blanks
 * (user inputs) and sections (visual components).
 */
export interface Template {
  /** URL-safe identifier (e.g. "daily-mood"). */
  slug: string;
  /** Human-readable title. */
  title: string;
  /** Short description of what this worksheet helps with. */
  description: string;
  /** Psychology basis — the research backing this worksheet. */
  psychology: string;
  /** Worksheet category. */
  category: TemplateCategory;
  /** Semver-style version string. */
  version: string;
  /** Publication status. */
  status: TemplateStatus;
  /** Estimated minutes to complete. */
  estimatedMinutes: number;
  /** Ordered list of fillable blanks (user inputs). */
  blanks: Blank[];
  /** Ordered list of visual sections (layout + components). */
  sections: Section[];
}
