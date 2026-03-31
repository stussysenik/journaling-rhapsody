import bcrypt from 'bcryptjs';

const HASH_ENV = 'ADMIN_PASSWORD_HASH';

export async function verifyPassword(password: string): Promise<boolean> {
	const hash = process.env[HASH_ENV] ?? import.meta.env?.[HASH_ENV];
	if (!hash) {
		console.error(`${HASH_ENV} environment variable is not set`);
		return false;
	}
	return bcrypt.compare(password, hash);
}
