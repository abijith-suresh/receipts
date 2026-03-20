import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getCurrentUserInfo } from './lib/auth';

const MIN_ENTRY_LENGTH = 10;

function deriveSummary(rawInput: string) {
	const cleaned = rawInput.trim().replace(/\s+/g, ' ');
	const [firstSentence] = cleaned.split(/(?<=[.!?])\s+/);

	if (firstSentence && firstSentence.length <= 140) {
		return firstSentence;
	}

	return `${cleaned.slice(0, 137).trimEnd()}${cleaned.length > 137 ? '...' : ''}`;
}

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { clerkId } = await getCurrentUserInfo(ctx);

		return await ctx.db
			.query('logEntries')
			.withIndex('by_clerk_id', (query) => query.eq('clerkId', clerkId))
			.order('desc')
			.collect();
	},
});

export const getByDate = query({
	args: {
		entryDate: v.string(),
	},
	handler: async (ctx, args) => {
		const { clerkId } = await getCurrentUserInfo(ctx);

		return await ctx.db
			.query('logEntries')
			.withIndex('by_clerk_id_entry_date', (query) =>
				query.eq('clerkId', clerkId).eq('entryDate', args.entryDate),
			)
			.unique();
	},
});

export const listByRange = query({
	args: {
		startDate: v.string(),
		endDate: v.string(),
	},
	handler: async (ctx, args) => {
		const { clerkId } = await getCurrentUserInfo(ctx);
		const rows = await ctx.db
			.query('logEntries')
			.withIndex('by_clerk_id_entry_date', (query) =>
				query
					.eq('clerkId', clerkId)
					.gte('entryDate', args.startDate)
					.lte('entryDate', args.endDate),
			)
			.order('desc')
			.collect();

		return rows;
	},
});

export const listRecent = query({
	args: {
		limit: v.number(),
	},
	handler: async (ctx, args) => {
		const { clerkId } = await getCurrentUserInfo(ctx);

		return await ctx.db
			.query('logEntries')
			.withIndex('by_clerk_id', (query) => query.eq('clerkId', clerkId))
			.order('desc')
			.take(args.limit);
	},
});

export const listArchiveMonths = query({
	args: {},
	handler: async (ctx) => {
		const { clerkId } = await getCurrentUserInfo(ctx);
		const rows = await ctx.db
			.query('logEntries')
			.withIndex('by_clerk_id', (query) => query.eq('clerkId', clerkId))
			.order('desc')
			.collect();

		const months = new Map<
			string,
			{ count: number; latestEntryDate: string }
		>();

		for (const row of rows) {
			const monthKey = row.entryDate.slice(0, 7);
			const existing = months.get(monthKey);

			if (existing) {
				existing.count += 1;
				if (row.entryDate > existing.latestEntryDate) {
					existing.latestEntryDate = row.entryDate;
				}
			} else {
				months.set(monthKey, {
					count: 1,
					latestEntryDate: row.entryDate,
				});
			}
		}

		return Array.from(months.entries()).map(([month, value]) => ({
			month,
			count: value.count,
			latestEntryDate: value.latestEntryDate,
		}));
	},
});

export const create = mutation({
	args: {
		entryDate: v.string(),
		rawInput: v.string(),
	},
	handler: async (ctx, args) => {
		const trimmedInput = args.rawInput.trim();

		if (trimmedInput.length < MIN_ENTRY_LENGTH) {
			throw new Error('Please write at least 10 characters about your day.');
		}

		const { clerkId } = await getCurrentUserInfo(ctx);
		const now = Date.now();

		return await ctx.db.insert('logEntries', {
			clerkId,
			entryDate: args.entryDate,
			rawInput: trimmedInput,
			summary: deriveSummary(trimmedInput),
			createdAt: now,
			updatedAt: now,
		});
	},
});

export const upsert = mutation({
	args: {
		entryDate: v.string(),
		rawInput: v.string(),
	},
	handler: async (ctx, args) => {
		const trimmedInput = args.rawInput.trim();

		if (trimmedInput.length < MIN_ENTRY_LENGTH) {
			throw new Error('Please write at least 10 characters about your day.');
		}

		const { clerkId } = await getCurrentUserInfo(ctx);
		const now = Date.now();
		const existing = await ctx.db
			.query('logEntries')
			.withIndex('by_clerk_id_entry_date', (query) =>
				query.eq('clerkId', clerkId).eq('entryDate', args.entryDate),
			)
			.unique();

		if (existing) {
			await ctx.db.patch(existing._id, {
				rawInput: trimmedInput,
				summary: deriveSummary(trimmedInput),
				updatedAt: now,
			});

			return existing._id;
		}

		return await ctx.db.insert('logEntries', {
			clerkId,
			entryDate: args.entryDate,
			rawInput: trimmedInput,
			summary: deriveSummary(trimmedInput),
			createdAt: now,
			updatedAt: now,
		});
	},
});
