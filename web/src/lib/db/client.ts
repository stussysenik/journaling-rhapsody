import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

function createDb() {
	const url = process.env.TURSO_DATABASE_URL ?? import.meta.env?.TURSO_DATABASE_URL;
	const authToken = process.env.TURSO_AUTH_TOKEN ?? import.meta.env?.TURSO_AUTH_TOKEN;

	// Local development fallback: use file-based SQLite
	const client = createClient({
		url: url || 'file:local.db',
		authToken: authToken || undefined,
	});

	return drizzle(client, { schema });
}

export const db = createDb();
