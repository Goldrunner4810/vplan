import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

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

	if (!(await isAdmin(event.locals.user.id))) {
		throw redirect(302, '/dash');
	}

	return {
		user: event.locals.user
	};
};

export const actions: Actions = {
	create: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth');
		}

		if (!(await isAdmin(event.locals.user.id))) {
			return fail(403, { message: 'Only admins can create posts.' });
		}

		const formData = await event.request.formData();
		const title = String(formData.get('title') ?? '').trim();
		const content = String(formData.get('content') ?? '').trim();
		const zeit = String(formData.get('zeit') ?? '').trim();

		if (!title || !content) {
			return fail(400, { title, content, zeit, message: 'Title and content are required.' });
		}

		const result = await db.execute(sql`
			INSERT INTO posts (user_id, title, content, zeit)
			VALUES (${event.locals.user.id}, ${title}, ${content}, ${zeit || null})
			RETURNING id
		`);

		throw redirect(303, `/post/${result[0].id}`);
	}
};
