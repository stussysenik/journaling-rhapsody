/**
 * Adapts schema Template (from schema/types.ts) to PDF renderer Template (pdf/types.ts).
 *
 * The schema uses flat section objects with snake_case types.
 * The PDF renderer expects { type, config } sections with kebab-case types.
 */

import type { Template as SchemaTemplate, Section } from '$lib/schema/types.js';
import type { Template as PdfTemplate, TemplateSection } from './types.js';

/** Convert snake_case section type to kebab-case for the renderer. */
function toKebab(snakeType: string): string {
	return snakeType.replace(/_/g, '-');
}

/** Extract config from a flat section object (everything except `type`). */
function extractConfig(section: Section): Record<string, unknown> {
	const { type, ...config } = section as unknown as Record<string, unknown>;
	return config;
}

/** Convert a schema Section to a PDF TemplateSection. */
function adaptSection(section: Section): TemplateSection {
	return {
		type: toKebab(section.type),
		config: extractConfig(section),
	};
}

/** Convert a schema Template to a PDF-renderer-compatible Template. */
export function adaptTemplate(template: SchemaTemplate): PdfTemplate {
	return {
		title: template.title,
		sections: template.sections.map(adaptSection),
	};
}
