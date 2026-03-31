import { listBuiltInTemplates } from '$lib/schema/resolve.js';
import { db } from '$lib/db/client';
import { templates as templatesTable } from '$lib/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const builtIn = listBuiltInTemplates();

	// Load custom templates from DB
	let dbTemplates: typeof builtIn extends (infer _)[] ? Array<{
		id: string; slug: string; title: string; description: string;
		psychology: string; category: string; status: string;
		blankCount: number; isBuiltIn: boolean;
	}> : never = [];

	try {
		const rows = await db.select().from(templatesTable);
		dbTemplates = rows.map((r) => {
			const schema = JSON.parse(r.schema);
			return {
				id: r.id,
				slug: r.slug,
				title: r.title,
				description: r.description ?? '',
				psychology: r.psychology ?? '',
				category: r.category ?? '',
				status: r.status ?? 'draft',
				blankCount: schema.blanks?.length ?? 0,
				isBuiltIn: false,
			};
		});
	} catch {
		// DB may not be initialized yet — that's fine, just use built-in
	}

	const builtInMapped = builtIn.map((t) => ({
		id: t.slug,
		slug: t.slug,
		title: t.title,
		description: t.description,
		psychology: t.psychology,
		category: t.category,
		status: t.status as string,
		blankCount: t.blanks.length,
		isBuiltIn: true,
	}));

	// Merge: DB templates override built-in by slug
	const dbSlugs = new Set(dbTemplates.map((t) => t.slug));
	const merged = [
		...dbTemplates,
		...builtInMapped.filter((t) => !dbSlugs.has(t.slug)),
	];

	return { templates: merged };
};
