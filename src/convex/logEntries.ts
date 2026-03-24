import { v } from 'convex/values';
import { query } from './_generated/server';

import { getCurrentUserInfo } from './lib/auth';
import { normalizeEntryDate } from './lib/dayCapture';
import { getLogEntryByDate } from './lib/dayCaptureDb';

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { clerkId } = await getCurrentUserInfo(ctx);

		return await ctx.db
			.query('logEntries')
			.withIndex('by_clerk_id', (builder) => builder.eq('clerkId', clerkId))
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

		return await getLogEntryByDate(
			ctx,
			clerkId,
			normalizeEntryDate(args.entryDate),
		);
	},
});

export const listByRange = query({
	args: {
		startDate: v.string(),
		endDate: v.string(),
	},
	handler: async (ctx, args) => {
		const { clerkId } = await getCurrentUserInfo(ctx);

		return await ctx.db
			.query('logEntries')
			.withIndex('by_clerk_id_and_entry_date', (builder) =>
				builder
					.eq('clerkId', clerkId)
					.gte('entryDate', normalizeEntryDate(args.startDate))
					.lte('entryDate', normalizeEntryDate(args.endDate)),
			)
			.order('desc')
			.collect();
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
			.withIndex('by_clerk_id', (builder) => builder.eq('clerkId', clerkId))
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
			.withIndex('by_clerk_id', (builder) => builder.eq('clerkId', clerkId))
			.order('desc')
			.collect();

		const months = new Map<
			string,
			{ count: number; latestEntryDate: string }
		>();

		for (const row of rows) {
			const monthKey = row.entryDate.slice(0, 7);
			const current = months.get(monthKey);

			if (current) {
				current.count += 1;
				if (row.entryDate > current.latestEntryDate) {
					current.latestEntryDate = row.entryDate;
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
