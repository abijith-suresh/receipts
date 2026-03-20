import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		email: v.optional(v.string()),
		name: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
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
