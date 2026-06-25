import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {

	if (!event.locals.user) {
		throw redirect(302, '/auth');
	}

	const id = event.params.id;

	const result = await db.execute(`
		SELECT id, title, content, created_at
		FROM posts
		WHERE id = ${id}
	`);

	return {
		user: event.locals.user,
		events: result
	};
};
