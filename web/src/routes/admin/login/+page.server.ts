import { fail, redirect } from '@sveltejs/kit';
import { verifyPassword } from '$lib/auth/password';
import { createSession } from '$lib/auth/session';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (!password || typeof password !== 'string') {
			return fail(400, { error: 'Password is required' });
		}

		const valid = await verifyPassword(password);
		if (!valid) {
			return fail(401, { error: 'Invalid password' });
		}

		await createSession(cookies);
		throw redirect(303, '/admin');
	},
};
