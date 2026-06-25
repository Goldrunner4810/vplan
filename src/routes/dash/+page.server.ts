import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth');
	}

	const result = await db.execute(`
		SELECT id, title, content, zeit
		FROM posts
		WHERE status = 'published'
		ORDER BY created_at DESC
	`);

	return {
		user: event.locals.user,
		events: result
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
