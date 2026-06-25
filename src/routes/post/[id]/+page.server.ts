import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/auth');
	}

	const id = Number(event.params.id);

	if (!Number.isInteger(id)) {
		return {
			user: event.locals.user,
			event: null,
			comments: [],
			coming: [],
			notComing: [],
			myStatus: null
		};
	}

	const result = await db.execute(sql`
		SELECT id, title, content, zeit, created_at
		FROM posts
		WHERE id = ${id}
		LIMIT 1
	`);

	const comments = await db.execute(sql`
		SELECT comments.id, comments.content, comments.created_at, "user".name AS user_name
		FROM comments
		LEFT JOIN "user" ON "user".id = comments.user_id
		WHERE comments.post_id = ${id}
		ORDER BY comments.created_at ASC
	`);

	const participants = await db.execute(sql`
		SELECT event_teilnehmer.status, "user".id AS user_id, "user".name AS user_name
		FROM event_teilnehmer
		LEFT JOIN "user" ON "user".id = event_teilnehmer.user_id
		WHERE event_teilnehmer.post_id = ${id}
		ORDER BY "user".name ASC
	`);

	const myResponse = participants.find((participant) => participant.user_id === event.locals.user?.id);

	return {
		user: event.locals.user,
		event: result[0] ?? null,
		comments,
		coming: participants.filter((participant) => participant.status === 'kommen'),
		notComing: participants.filter((participant) => participant.status === 'absagen'),
		myStatus: myResponse?.status ?? null
	};
};

export const actions: Actions = {
	comment: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth');
		}

		const postId = Number(event.params.id);
		const formData = await event.request.formData();
		const content = String(formData.get('content') ?? '').trim();

		if (!Number.isInteger(postId)) {
			return fail(400, { message: 'Invalid post.' });
		}

		if (!content) {
			return fail(400, { message: 'Comment cannot be empty.' });
		}

		await db.execute(sql`
			INSERT INTO comments (post_id, user_id, content)
			VALUES (${postId}, ${event.locals.user.id}, ${content})
		`);

		return { success: true };
	},

	attendance: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth');
		}

		const postId = Number(event.params.id);
		const formData = await event.request.formData();
		const status = String(formData.get('status') ?? '');

		if (!Number.isInteger(postId)) {
			return fail(400, { message: 'Invalid post.' });
		}

		if (status !== 'kommen' && status !== 'absagen') {
			return fail(400, { message: 'Invalid attendance status.' });
		}

		await db.execute(sql`
			INSERT INTO event_teilnehmer (post_id, user_id, status, geändert_am)
			VALUES (${postId}, ${event.locals.user.id}, ${status}, CURRENT_TIMESTAMP)
			ON CONFLICT (post_id, user_id)
			DO UPDATE SET status = ${status}, geändert_am = CURRENT_TIMESTAMP
		`);

		return { success: true };
	}
};
