import { error } from '@sveltejs/kit';
import { resolveTemplate } from '$lib/schema/resolve.js';
import { renderTemplate } from '$lib/pdf/renderer.js';
import { adaptTemplate } from '$lib/pdf/adapter.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
	const template = resolveTemplate(params.slug);
	if (!template) {
		throw error(404, `Worksheet "${params.slug}" not found`);
	}

	const mode = (url.searchParams.get('mode') as 'filled' | 'blank') || 'blank';
	const answersParam = url.searchParams.get('answers');

	let answers: Record<string, string> = {};
	if (mode === 'filled' && answersParam) {
		try {
			answers = JSON.parse(answersParam);
		} catch {
			throw error(400, 'Invalid answers JSON');
		}
	}

	const pdfTemplate = adaptTemplate(template);
	const pdfBytes = await renderTemplate(pdfTemplate, answers, mode);

	return new Response(pdfBytes as unknown as BodyInit, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="feelcheck-${params.slug}.pdf"`,
			'Cache-Control': 'no-cache',
		},
	});
};
