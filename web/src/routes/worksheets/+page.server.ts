import { listBuiltInTemplates } from '$lib/schema/resolve.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const templates = listBuiltInTemplates().filter((t) => t.status === 'published');

	return {
		templates: templates.map((t) => ({
			slug: t.slug,
			title: t.title,
			description: t.description,
			psychology: t.psychology,
			category: t.category,
			blankCount: t.blanks.length,
			estimatedMinutes: t.estimatedMinutes,
		})),
	};
};
