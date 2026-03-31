import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db/client';
import { templates } from '$lib/db/schema';
import type { Actions } from './$types';

function generateId(): string {
	const time = Date.now().toString(36);
	const rand = crypto.getRandomValues(new Uint8Array(8));
	const hex = Array.from(rand, (b) => b.toString(16).padStart(2, '0')).join('');
	return `${time}${hex}`;
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const psychology = data.get('psychology') as string;
		const category = data.get('category') as string;
		const blanksJson = data.get('blanks') as string;
		const sectionsJson = data.get('sections') as string;

		if (!title?.trim()) {
			return fail(400, { error: 'Title is required' });
		}

		let blanks = [];
		let sections = [];
		try {
			blanks = blanksJson ? JSON.parse(blanksJson) : [];
			sections = sectionsJson ? JSON.parse(sectionsJson) : [];
		} catch {
			return fail(400, { error: 'Invalid blanks or sections data' });
		}

		const id = generateId();
		const slug = slugify(title);
		const now = new Date();

		await db.insert(templates).values({
			id,
			slug,
			title: title.trim(),
			description: description?.trim() || null,
			psychology: psychology?.trim() || null,
			category: category || null,
			version: 1,
			status: 'draft',
			schema: JSON.stringify({ blanks, sections }),
			isBuiltinOverride: false,
			createdAt: now,
			updatedAt: now,
		});

		throw redirect(303, `/admin/templates/${id}`);
	},
};
