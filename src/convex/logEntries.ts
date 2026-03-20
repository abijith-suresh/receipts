import { mutationGeneric, queryGeneric } from 'convex/server';
import { v } from 'convex/values';

import { getCurrentUserInfo } from './lib/auth';

const mutation = mutationGeneric;
const query = queryGeneric;

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
