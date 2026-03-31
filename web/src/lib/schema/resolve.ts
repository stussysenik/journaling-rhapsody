/**
 * Template resolution — find and return a Template by slug.
 *
 * Resolution order:
 *   1. (Future) Check database for custom user templates
 *   2. Check built-in JSON templates bundled at build time
 *   3. Return null if not found
 *
 * Built-in templates are statically imported so Vite/SvelteKit can
 * bundle them without dynamic filesystem access at runtime.
 */

import type { Template } from './types.js';
import { assertTemplate } from './validate.js';

// Static imports of all built-in template JSON files.
// These are resolved at build time by Vite's JSON module support.
import dailyMood from '../../../../templates/daily-mood.json';
import weeklyReflection from '../../../../templates/weekly-reflection.json';
import goalSetting from '../../../../templates/goal-setting.json';
import decisionPlanning from '../../../../templates/decision-planning.json';
import founderResilience from '../../../../templates/founder-resilience.json';
import progressCheckin from '../../../../templates/progress-checkin.json';

// ---------------------------------------------------------------------------
// Built-in template registry (slug → template data)
// ---------------------------------------------------------------------------

const builtInRaw: Record<string, unknown> = {
  'daily-mood': dailyMood,
  'weekly-reflection': weeklyReflection,
  'goal-setting': goalSetting,
  'decision-planning': decisionPlanning,
  'founder-resilience': founderResilience,
  'progress-checkin': progressCheckin,
};

/**
 * Lazily validated cache of built-in templates. Each template is validated
 * once on first access and then cached as a typed Template.
 */
const cache = new Map<string, Template>();

function getBuiltIn(slug: string): Template | null {
  if (cache.has(slug)) {
    return cache.get(slug)!;
  }

  const raw = builtInRaw[slug];
  if (!raw) return null;

  // Validate and cache
  assertTemplate(raw);
  cache.set(slug, raw);
  return raw;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve a template by its slug.
 *
 * @param slug - URL-safe template identifier (e.g. "daily-mood")
 * @returns The Template object, or null if no template with that slug exists.
 */
export function resolveTemplate(slug: string): Template | null {
  // Step 1: (Future) Check DB for custom templates
  // const custom = await db.templates.findBySlug(slug);
  // if (custom) return custom;

  // Step 2: Check built-in templates
  return getBuiltIn(slug);
}

/**
 * List all available built-in template slugs.
 */
export function listBuiltInSlugs(): string[] {
  return Object.keys(builtInRaw);
}

/**
 * List all built-in templates (validated).
 */
export function listBuiltInTemplates(): Template[] {
  return Object.keys(builtInRaw)
    .map((slug) => getBuiltIn(slug))
    .filter((t): t is Template => t !== null);
}
