/**
 * Runtime validation for template objects.
 *
 * Provides a simple structural check that a plain object conforms to the
 * Template interface. This is useful when loading user-created or external
 * JSON templates that bypass TypeScript's compile-time checks.
 */

import type { Template, Blank, Section, BlankType, SectionType, TemplateCategory, TemplateStatus } from './types.js';

// ---------------------------------------------------------------------------
// Valid enum values
// ---------------------------------------------------------------------------

const BLANK_TYPES: ReadonlySet<BlankType> = new Set([
  'text', 'textarea', 'choice', 'multi', 'scale', 'date',
]);

const SECTION_TYPES: ReadonlySet<SectionType> = new Set([
  'header', 'section_header', 'lined_box', 'prompt_lines', 'scale',
  'labeled_scale', 'checkbox_row', 'mood_grid', 'body_figure', 'venn2',
  'venn3', 'eisenhower', 'timeline', 'connected_boxes', 'concentric_circles',
  'dual_box', 'momentum_meter', 'paired_columns', 'footer',
  'mini_mood_tracker', 'okr_breakdown', 'multi_column_boxes', 'layout',
]);

const CATEGORIES: ReadonlySet<TemplateCategory> = new Set([
  'mood', 'reflection', 'goals', 'decision', 'resilience', 'progress',
]);

const STATUSES: ReadonlySet<TemplateStatus> = new Set([
  'draft', 'published', 'archived',
]);

// ---------------------------------------------------------------------------
// Validation result
// ---------------------------------------------------------------------------

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isArrayOf<T>(value: unknown, check: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(check);
}

function isStringArray(value: unknown): value is string[] {
  return isArrayOf(value, (v): v is string => typeof v === 'string');
}

// ---------------------------------------------------------------------------
// Blank validation
// ---------------------------------------------------------------------------

function validateBlank(blank: unknown, index: number): string[] {
  const errors: string[] = [];
  const prefix = `blanks[${index}]`;

  if (typeof blank !== 'object' || blank === null) {
    return [`${prefix}: must be an object`];
  }

  const b = blank as Record<string, unknown>;

  if (!isNonEmptyString(b.id)) {
    errors.push(`${prefix}.id: must be a non-empty string`);
  }
  if (!isNonEmptyString(b.prompt)) {
    errors.push(`${prefix}.prompt: must be a non-empty string`);
  }
  if (!isNonEmptyString(b.type) || !BLANK_TYPES.has(b.type as BlankType)) {
    errors.push(`${prefix}.type: must be one of ${[...BLANK_TYPES].join(', ')}`);
  }

  // Type-specific checks
  const type = b.type as BlankType;
  if ((type === 'choice' || type === 'multi') && !isStringArray(b.options)) {
    errors.push(`${prefix}.options: required for type "${type}" and must be a string array`);
  }
  if (type === 'scale') {
    if (typeof b.max !== 'number' || b.max < 1) {
      errors.push(`${prefix}.max: required for type "scale" and must be a positive number`);
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Section validation
// ---------------------------------------------------------------------------

function validateSection(section: unknown, index: number): string[] {
  const errors: string[] = [];
  const prefix = `sections[${index}]`;

  if (typeof section !== 'object' || section === null) {
    return [`${prefix}: must be an object`];
  }

  const s = section as Record<string, unknown>;

  if (!isNonEmptyString(s.type) || !SECTION_TYPES.has(s.type as SectionType)) {
    errors.push(`${prefix}.type: must be one of ${[...SECTION_TYPES].join(', ')}`);
    return errors; // Can't do type-specific checks without a valid type.
  }

  const type = s.type as SectionType;

  switch (type) {
    case 'header':
    case 'section_header':
      if (!isNonEmptyString(s.title)) {
        errors.push(`${prefix}.title: required for type "${type}"`);
      }
      break;

    case 'lined_box':
      if (typeof s.prompt !== 'string') {
        errors.push(`${prefix}.prompt: must be a string for type "lined_box"`);
      }
      if (typeof s.lines !== 'number' || s.lines < 0) {
        errors.push(`${prefix}.lines: must be a non-negative number`);
      }
      break;

    case 'prompt_lines':
      if (typeof s.prompt !== 'string') {
        errors.push(`${prefix}.prompt: must be a string for type "prompt_lines"`);
      }
      if (typeof s.lines !== 'number' || s.lines < 0) {
        errors.push(`${prefix}.lines: must be a non-negative number`);
      }
      break;

    case 'scale':
      if (!isNonEmptyString(s.label)) {
        errors.push(`${prefix}.label: required for type "scale"`);
      }
      if (typeof s.max !== 'number' || s.max < 1) {
        errors.push(`${prefix}.max: must be a positive number`);
      }
      break;

    case 'labeled_scale':
      if (!isNonEmptyString(s.label)) {
        errors.push(`${prefix}.label: required for type "labeled_scale"`);
      }
      if (typeof s.max !== 'number' || s.max < 1) {
        errors.push(`${prefix}.max: must be a positive number`);
      }
      if (!isNonEmptyString(s.lowLabel)) {
        errors.push(`${prefix}.lowLabel: required for type "labeled_scale"`);
      }
      if (!isNonEmptyString(s.highLabel)) {
        errors.push(`${prefix}.highLabel: required for type "labeled_scale"`);
      }
      break;

    case 'checkbox_row':
      if (!isStringArray(s.labels)) {
        errors.push(`${prefix}.labels: must be a string array`);
      }
      break;

    case 'mood_grid':
      if (!Array.isArray(s.quadrants) || s.quadrants.length !== 4) {
        errors.push(`${prefix}.quadrants: must be an array of 4 string arrays`);
      }
      break;

    case 'body_figure':
      if (!isStringArray(s.annotations)) {
        errors.push(`${prefix}.annotations: must be a string array`);
      }
      break;

    case 'venn2':
      if (!isNonEmptyString(s.labelA)) errors.push(`${prefix}.labelA: required`);
      if (!isNonEmptyString(s.labelB)) errors.push(`${prefix}.labelB: required`);
      break;

    case 'venn3':
      if (!Array.isArray(s.labels) || s.labels.length !== 3) {
        errors.push(`${prefix}.labels: must be an array of exactly 3 strings`);
      }
      break;

    case 'timeline':
      if (typeof s.points !== 'number' || s.points < 1) {
        errors.push(`${prefix}.points: must be a positive number`);
      }
      break;

    case 'connected_boxes':
      if (!isStringArray(s.labels) || (s.labels as string[]).length === 0) {
        errors.push(`${prefix}.labels: must be a non-empty string array`);
      }
      break;

    case 'concentric_circles':
      if (!isNonEmptyString(s.innerLabel)) errors.push(`${prefix}.innerLabel: required`);
      if (!isNonEmptyString(s.outerLabel)) errors.push(`${prefix}.outerLabel: required`);
      break;

    case 'dual_box':
      if (!isNonEmptyString(s.labelA)) errors.push(`${prefix}.labelA: required`);
      if (!isNonEmptyString(s.labelB)) errors.push(`${prefix}.labelB: required`);
      if (typeof s.linesPerBox !== 'number') errors.push(`${prefix}.linesPerBox: must be a number`);
      break;

    case 'momentum_meter':
      if (!isStringArray(s.labels)) {
        errors.push(`${prefix}.labels: must be a string array`);
      }
      break;

    case 'paired_columns':
      if (!isNonEmptyString(s.labelA)) errors.push(`${prefix}.labelA: required`);
      if (!isNonEmptyString(s.labelB)) errors.push(`${prefix}.labelB: required`);
      if (typeof s.rows !== 'number') errors.push(`${prefix}.rows: must be a number`);
      break;

    case 'mini_mood_tracker':
      if (!isStringArray(s.days)) {
        errors.push(`${prefix}.days: must be a string array`);
      }
      break;

    case 'okr_breakdown':
      if (typeof s.objectives !== 'number') errors.push(`${prefix}.objectives: must be a number`);
      if (typeof s.keyResultsPerObjective !== 'number') errors.push(`${prefix}.keyResultsPerObjective: must be a number`);
      break;

    case 'multi_column_boxes':
      if (!Array.isArray(s.columns)) {
        errors.push(`${prefix}.columns: must be an array`);
      }
      break;

    case 'layout':
      if (s.direction !== 'horizontal' && s.direction !== 'vertical') {
        errors.push(`${prefix}.direction: must be "horizontal" or "vertical"`);
      }
      if (!Array.isArray(s.children)) {
        errors.push(`${prefix}.children: must be an array of sections`);
      } else {
        (s.children as unknown[]).forEach((child, ci) => {
          errors.push(...validateSection(child, ci).map((e) => `${prefix}.children.${e}`));
        });
      }
      break;

    case 'footer':
    case 'eisenhower':
      // No additional fields required.
      break;
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Template validation
// ---------------------------------------------------------------------------

/**
 * Validates a plain object against the Template schema.
 *
 * Returns `{ valid: true, errors: [] }` if the object is a valid template,
 * or `{ valid: false, errors: [...] }` with human-readable error messages.
 */
export function validateTemplate(obj: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof obj !== 'object' || obj === null) {
    return { valid: false, errors: ['Template must be a non-null object'] };
  }

  const t = obj as Record<string, unknown>;

  // Required string fields
  if (!isNonEmptyString(t.slug)) errors.push('slug: must be a non-empty string');
  if (!isNonEmptyString(t.title)) errors.push('title: must be a non-empty string');
  if (!isNonEmptyString(t.description)) errors.push('description: must be a non-empty string');
  if (!isNonEmptyString(t.psychology)) errors.push('psychology: must be a non-empty string');
  if (!isNonEmptyString(t.version)) errors.push('version: must be a non-empty string');

  // Enum fields
  if (!isNonEmptyString(t.category) || !CATEGORIES.has(t.category as TemplateCategory)) {
    errors.push(`category: must be one of ${[...CATEGORIES].join(', ')}`);
  }
  if (!isNonEmptyString(t.status) || !STATUSES.has(t.status as TemplateStatus)) {
    errors.push(`status: must be one of ${[...STATUSES].join(', ')}`);
  }

  // Numeric fields
  if (typeof t.estimatedMinutes !== 'number' || t.estimatedMinutes < 0) {
    errors.push('estimatedMinutes: must be a non-negative number');
  }

  // Blanks array
  if (!Array.isArray(t.blanks)) {
    errors.push('blanks: must be an array');
  } else {
    (t.blanks as unknown[]).forEach((blank, i) => {
      errors.push(...validateBlank(blank, i));
    });

    // Check for duplicate blank IDs
    const ids = new Set<string>();
    for (const blank of t.blanks as Array<Record<string, unknown>>) {
      if (typeof blank?.id === 'string') {
        if (ids.has(blank.id)) {
          errors.push(`blanks: duplicate id "${blank.id}"`);
        }
        ids.add(blank.id);
      }
    }
  }

  // Sections array
  if (!Array.isArray(t.sections)) {
    errors.push('sections: must be an array');
  } else {
    (t.sections as unknown[]).forEach((section, i) => {
      errors.push(...validateSection(section, i));
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Type guard that narrows an unknown value to Template.
 * Throws if validation fails.
 */
export function assertTemplate(obj: unknown): asserts obj is Template {
  const result = validateTemplate(obj);
  if (!result.valid) {
    throw new Error(`Invalid template:\n  ${result.errors.join('\n  ')}`);
  }
}
