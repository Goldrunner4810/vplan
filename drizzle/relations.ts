import { relations } from "drizzle-orm/relations";
import { user, account, session, posts, roles, eventTeilnehmer, images, comments } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({one, many}) => ({
	accounts: many(account),
	sessions: many(session),
	posts: many(posts),
	role: one(roles, {
		fields: [user.roleId],
		references: [roles.id]
	}),
	eventTeilnehmers: many(eventTeilnehmer),
	comments: many(comments),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const postsRelations = relations(posts, ({one, many}) => ({
	user: one(user, {
		fields: [posts.userId],
		references: [user.id]
	}),
	eventTeilnehmers: many(eventTeilnehmer),
	images: many(images),
	comments: many(comments),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	users: many(user),
}));

export const eventTeilnehmerRelations = relations(eventTeilnehmer, ({one}) => ({
	post: one(posts, {
		fields: [eventTeilnehmer.postId],
		references: [posts.id]
	}),
	user: one(user, {
		fields: [eventTeilnehmer.userId],
		references: [user.id]
	}),
}));

export const imagesRelations = relations(images, ({one}) => ({
	post: one(posts, {
		fields: [images.postId],
		references: [posts.id]
	}),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id]
	}),
	user: one(user, {
		fields: [comments.userId],
		references: [user.id]
	}),
}));