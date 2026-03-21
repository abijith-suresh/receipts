import { v } from 'convex/values';

import type { Doc } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';
import { mutation, query } from './_generated/server';

import { getCurrentUserInfo } from './lib/auth';

const weekStartsOnValidator = v.union(
	v.literal(0),
	v.literal(1),
	v.literal(2),
	v.literal(3),
	v.literal(4),
	v.literal(5),
	v.literal(6),
);

const defaultHistoryViewValidator = v.union(
	v.literal('week'),
	v.literal('month'),
	v.literal('timeline'),
);

const DEFAULT_USER_SETTINGS = {
	timezone: 'UTC',
	weekStartsOn: 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
	defaultHistoryView: 'week' as 'week' | 'month' | 'timeline',
};

async function getUserByClerkId(ctx: QueryCtx | MutationCtx, clerkId: string) {
	return await ctx.db
		.query('users')
		.withIndex('by_clerk_id', (query) => query.eq('clerkId', clerkId))
		.unique();
}

function normalizeSettings(user: Doc<'users'> | null) {
	return {
		timezone: user?.timezone ?? DEFAULT_USER_SETTINGS.timezone,
		weekStartsOn: user?.weekStartsOn ?? DEFAULT_USER_SETTINGS.weekStartsOn,
		defaultHistoryView:
			user?.defaultHistoryView ?? DEFAULT_USER_SETTINGS.defaultHistoryView,
	};
}

export const ensureCurrentUser = mutation({
	args: {},
	handler: async (ctx) => {
		const { clerkId, email, name, imageUrl } = await getCurrentUserInfo(ctx);
		const now = Date.now();
		const existing = await getUserByClerkId(ctx, clerkId);

		if (existing) {
			await ctx.db.patch(existing._id, {
				email,
				name,
				imageUrl,
				timezone: existing.timezone ?? DEFAULT_USER_SETTINGS.timezone,
				weekStartsOn:
					existing.weekStartsOn ?? DEFAULT_USER_SETTINGS.weekStartsOn,
				defaultHistoryView:
					existing.defaultHistoryView ??
					DEFAULT_USER_SETTINGS.defaultHistoryView,
				updatedAt: now,
			});

			return existing._id;
		}

		return await ctx.db.insert('users', {
			clerkId,
			email,
			name,
			imageUrl,
			timezone: DEFAULT_USER_SETTINGS.timezone,
			weekStartsOn: DEFAULT_USER_SETTINGS.weekStartsOn,
			defaultHistoryView: DEFAULT_USER_SETTINGS.defaultHistoryView,
			createdAt: now,
			updatedAt: now,
		});
	},
});

export const current = query({
	args: {},
	handler: async (ctx) => {
		const { clerkId } = await getCurrentUserInfo(ctx);

		return await ctx.db
			.query('users')
			.withIndex('by_clerk_id', (query) => query.eq('clerkId', clerkId))
			.unique();
	},
});

export const settings = query({
	args: {},
	handler: async (ctx) => {
		const { clerkId } = await getCurrentUserInfo(ctx);
		const user = await getUserByClerkId(ctx, clerkId);

		return normalizeSettings(user);
	},
});

export const updateSettings = mutation({
	args: {
		timezone: v.string(),
		weekStartsOn: weekStartsOnValidator,
		defaultHistoryView: defaultHistoryViewValidator,
	},
	handler: async (ctx, args) => {
		const timezone = args.timezone.trim();

		if (!timezone) {
			throw new Error('Choose a valid timezone before saving.');
		}

		try {
			new Intl.DateTimeFormat('en', { timeZone: timezone }).format(new Date());
		} catch {
			throw new Error('Choose a supported timezone before saving.');
		}

		const { clerkId, email, name, imageUrl } = await getCurrentUserInfo(ctx);
		const now = Date.now();
		const existing = await getUserByClerkId(ctx, clerkId);

		if (existing) {
			await ctx.db.patch(existing._id, {
				timezone,
				weekStartsOn: args.weekStartsOn,
				defaultHistoryView: args.defaultHistoryView,
				updatedAt: now,
			});
		} else {
			await ctx.db.insert('users', {
				clerkId,
				email,
				name,
				imageUrl,
				timezone,
				weekStartsOn: args.weekStartsOn,
				defaultHistoryView: args.defaultHistoryView,
				createdAt: now,
				updatedAt: now,
			});
		}

		return {
			timezone,
			weekStartsOn: args.weekStartsOn,
			defaultHistoryView: args.defaultHistoryView,
		};
	},
});
