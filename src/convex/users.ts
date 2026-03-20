import { mutationGeneric, queryGeneric } from 'convex/server';

import { getCurrentUserInfo, requireAuth } from './lib/auth';

const mutation = mutationGeneric;
const query = queryGeneric;

export const ensureCurrentUser = mutation({
	args: {},
	handler: async (ctx) => {
		const { clerkId, email, name, imageUrl } = await getCurrentUserInfo(ctx);
		const now = Date.now();

		const existing = await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (query) => query.eq('clerkId', clerkId))
			.unique();

		if (existing) {
			await ctx.db.patch(existing._id, {
				email,
				name,
				imageUrl,
				updatedAt: now,
			});

			return existing._id;
		}

		return await ctx.db.insert('users', {
			clerkId,
			email,
			name,
			imageUrl,
			createdAt: now,
			updatedAt: now,
		});
	},
});

export const current = query({
	args: {},
	handler: async (ctx) => {
		const identity = await requireAuth(ctx);

		return await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (query) =>
				query.eq('clerkId', identity.subject),
			)
			.unique();
	},
});
