import { error } from '@sveltejs/kit';
import { resolveTemplate } from '$lib/schema/resolve.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// For now, only built-in templates (by slug). Future: DB lookup by ID.
	const template = resolveTemplate(params.id);
	if (!template) {
		throw error(404, `Template "${params.id}" not found`);
	}

	return { template };
};
