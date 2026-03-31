import { db } from '$lib/db/client';
import { sessions } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE = 'feelcheck_session';
const SESSION_DAYS = 7;

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(cookies: Cookies): Promise<void> {
	const id = generateId();
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

	await db.insert(sessions).values({ id, expiresAt });

	cookies.set(SESSION_COOKIE, id, {
		path: '/admin',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: SESSION_DAYS * 24 * 60 * 60,
	});
}

export async function validateSession(cookies: Cookies): Promise<boolean> {
	const id = cookies.get(SESSION_COOKIE);
	if (!id) return false;

	const [session] = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
	if (!session) return false;

	if (session.expiresAt < new Date()) {
		await db.delete(sessions).where(eq(sessions.id, id));
		cookies.delete(SESSION_COOKIE, { path: '/admin' });
		return false;
	}

	return true;
}

export async function destroySession(cookies: Cookies): Promise<void> {
	const id = cookies.get(SESSION_COOKIE);
	if (id) {
		await db.delete(sessions).where(eq(sessions.id, id));
	}
	cookies.delete(SESSION_COOKIE, { path: '/admin' });
}
