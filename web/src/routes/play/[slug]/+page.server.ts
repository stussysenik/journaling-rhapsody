import { error } from '@sveltejs/kit';
import { resolveTemplate } from '$lib/schema/resolve.js';
import { db } from '$lib/db/client';
import { templates as templatesTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const template = resolveTemplate(params.slug);

	// Also check DB for custom templates
	let dbTemplate = null;
	try {
		const [row] = await db
			.select()
			.from(templatesTable)
			.where(eq(templatesTable.slug, params.slug))
			.limit(1);
		if (row) {
			const schema = JSON.parse(row.schema);
			dbTemplate = {
				slug: row.slug,
				title: row.title,
				description: row.description ?? '',
				psychology: row.psychology ?? '',
				category: row.category ?? '',
				estimatedMinutes: 5,
				status: row.status,
				accessToken: row.accessToken,
				blanks: schema.blanks ?? [],
				sections: schema.sections ?? [],
			};
		}
	} catch {
		// DB not available — use built-in only
	}

	const resolved = dbTemplate ?? (template ? { ...template, status: template.status, accessToken: null } : null);

	if (!resolved) {
		throw error(404, `Worksheet "${params.slug}" not found`);
	}

	// Access control: hidden templates require a valid token
	if (resolved.status === 'hidden') {
		const token = url.searchParams.get('token');
		if (!token || token !== resolved.accessToken) {
			throw error(404, `Worksheet "${params.slug}" not found`);
		}
	}

	// Draft templates are not accessible to the public
	if (resolved.status === 'draft') {
		throw error(404, `Worksheet "${params.slug}" not found`);
	}

	return {
		template: {
			slug: resolved.slug,
			title: resolved.title,
			description: resolved.description,
			psychology: resolved.psychology,
			category: resolved.category,
			estimatedMinutes: resolved.estimatedMinutes,
			blanks: resolved.blanks,
			sections: resolved.sections,
		},
	};
};
