import { redirect } from '@sveltejs/kit';
import { validateSession } from '$lib/auth/session';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	// Don't require auth for the login page itself
	if (url.pathname === '/admin/login') return {};

	const valid = await validateSession(cookies);
	if (!valid) {
		throw redirect(303, '/admin/login');
	}

	return { authenticated: true };
};
