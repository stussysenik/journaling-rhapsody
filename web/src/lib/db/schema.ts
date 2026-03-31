import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const templates = sqliteTable('templates', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	description: text('description'),
	psychology: text('psychology'),
	category: text('category'),
	version: integer('version').default(1),
	status: text('status', { enum: ['published', 'draft', 'hidden'] }).default('draft'),
	schema: text('schema').notNull(), // JSON string of { blanks, sections }
	accessToken: text('access_token'),
	isBuiltinOverride: integer('is_builtin_override', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});
