import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		email: v.optional(v.string()),
		name: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
		timezone: v.optional(v.string()),
		weekStartsOn: v.optional(
			v.union(
				v.literal(0),
				v.literal(1),
				v.literal(2),
				v.literal(3),
				v.literal(4),
				v.literal(5),
				v.literal(6),
			),
		),
		defaultHistoryView: v.optional(
			v.union(v.literal('week'), v.literal('month'), v.literal('archive')),
		),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index('by_clerk_id', ['clerkId']),

	logEntries: defineTable({
		clerkId: v.string(),
		entryDate: v.string(),
		rawInput: v.string(),
		summary: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index('by_clerk_id', ['clerkId'])
		.index('by_clerk_id_entry_date', ['clerkId', 'entryDate']),
});
