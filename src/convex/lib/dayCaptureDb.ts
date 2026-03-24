import type { Doc } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

type DbCtx = QueryCtx | MutationCtx;

export async function getLogEntryByDate(
	ctx: DbCtx,
	clerkId: string,
	entryDate: string,
) {
	return await ctx.db
		.query('logEntries')
		.withIndex('by_clerk_id_and_entry_date', (query) =>
			query.eq('clerkId', clerkId).eq('entryDate', entryDate),
		)
		.unique();
}

export async function getDayNotesByDate(
	ctx: DbCtx,
	clerkId: string,
	entryDate: string,
	isArchived?: boolean,
	limit?: number,
) {
	const query = ctx.db
		.query('dayNotes')
		.withIndex(
			typeof isArchived === 'boolean'
				? 'by_clerk_id_and_entry_date_and_is_archived_and_created_at'
				: 'by_clerk_id_and_entry_date_and_created_at',
			(builder) => {
				const scoped = builder
					.eq('clerkId', clerkId)
					.eq('entryDate', entryDate);

				return typeof isArchived === 'boolean'
					? scoped.eq('isArchived', isArchived)
					: scoped;
			},
		)
		.order('asc');

	if (typeof limit === 'number') {
		return await query.take(limit);
	}

	return await query.collect();
}

export function buildDirtyPromptState(
	entry: Doc<'logEntries'> | null,
	hasActiveNotes: boolean,
) {
	const isDirty = Boolean(entry?.isDirty && hasActiveNotes);

	return {
		isDirty,
		dismissedForCurrentDigest: !isDirty,
		shouldPrompt: isDirty,
	};
}
