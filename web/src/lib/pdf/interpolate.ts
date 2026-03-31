/**
 * Template interpolation — replaces {{blank_id}} patterns in strings.
 *
 * Two modes:
 *   - "filled" mode: replaces with the user's answer text
 *   - "blank" mode: replaces with an underline placeholder for printing
 */

/** Default underline placeholder width (in characters) */
const BLANK_PLACEHOLDER = '___________';

/**
 * Replace all {{blank_id}} patterns in a template string.
 *
 * @param template  The template string with {{blank_id}} placeholders
 * @param answers   A map of blank_id -> user answer
 * @param mode      'filled' uses user answers; 'blank' uses underline placeholders
 * @returns         The interpolated string
 */
export function interpolate(
  template: string,
  answers: Record<string, string>,
  mode: 'filled' | 'blank'
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, blankId: string) => {
    if (mode === 'filled') {
      return answers[blankId] ?? BLANK_PLACEHOLDER;
    }
    return BLANK_PLACEHOLDER;
  });
}

/**
 * Recursively interpolate all string values in a config object.
 * Returns a new object with all {{blank_id}} patterns replaced.
 */
export function interpolateConfig<T extends Record<string, unknown>>(
  config: T,
  answers: Record<string, string>,
  mode: 'filled' | 'blank'
): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'string') {
      result[key] = interpolate(value, answers, mode);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'string'
          ? interpolate(item, answers, mode)
          : item
      );
    } else if (value !== null && typeof value === 'object') {
      result[key] = interpolateConfig(
        value as Record<string, unknown>,
        answers,
        mode
      );
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
