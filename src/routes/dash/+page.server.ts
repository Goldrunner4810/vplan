import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

const sortOptions = ['created', 'date'] as const;
type SortOption = (typeof sortOptions)[number];

async function isAdmin(userId: string) {
	const result = await db.execute(sql`
		SELECT roles.name
		FROM "user"
		JOIN roles ON roles.id = "user".role_id
		WHERE "user".id = ${userId}
		LIMIT 1
	`);

	return result[0]?.name === 'Admin';
}

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth');
	}

	const requestedSort = event.url.searchParams.get('sort');
	const sort: SortOption = sortOptions.includes(requestedSort as SortOption)
		? (requestedSort as SortOption)
		: 'created';
	const orderBy =
		sort === 'date' ? 'zeit ASC NULLS LAST, created_at DESC' : 'created_at DESC';

	const result = await db.execute(`
		SELECT id, title, content, zeit
		FROM posts
		WHERE status = 'published'
		ORDER BY ${orderBy}
	`);

	return {
		user: event.locals.user,
		events: result,
		sort,
		isAdmin: await isAdmin(event.locals.user.id)
	};
};

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		throw redirect(302, '/auth');
	}
};
