import { v } from 'convex/values';
import {
	internalMutation,
	internalQuery,
	mutation,
	query,
} from './_generated/server';

import { getCurrentUserInfo } from './lib/auth';
import {
	assertValidDayNoteBody,
	type DayCaptureSynthesisContext,
	deriveSummary,
	getDayNotesSnapshot,
	MAX_DAY_NOTES_PER_DAY,
	normalizeDayNoteBody,
	normalizeEntryDate,
	type StructuredSynthesis,
	structuredSynthesisValidator,
} from './lib/dayCapture';
import {
	buildDirtyPromptState,
	getDayNotesByDate,
	getLogEntryByDate,
} from './lib/dayCaptureDb';

export const addDayNote = mutation({
	args: {
		entryDate: v.string(),
		content: v.optional(v.string()),
		body: v.optional(v.string()),
		rawInput: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { clerkId } = await getCurrentUserInfo(ctx);
		const entryDate = normalizeEntryDate(args.entryDate);
		const content = normalizeDayNoteBody(
			args.content ?? args.body ?? args.rawInput ?? '',
		);

		assertValidDayNoteBody(content);

		const activeNotes = await getDayNotesByDate(
			ctx,
			clerkId,
			entryDate,
			false,
			MAX_DAY_NOTES_PER_DAY,
		);

		if (activeNotes.length >= MAX_DAY_NOTES_PER_DAY) {
			throw new Error('You have reached the 50 note limit for this day.');
		}

		const now = Date.now();
		const noteId = await ctx.db.insert('dayNotes', {
			clerkId,
			entryDate,
			content,
			createdAt: now,
			isArchived: false,
		});
		const logEntry = await getLogEntryByDate(ctx, clerkId, entryDate);

		if (logEntry) {
			await ctx.db.patch(logEntry._id, {
				isDirty: true,
				dirtyPromptDismissedDigest: null,
				updatedAt: now,
			});
		}

		return noteId;
	},
});

export const getDayNotes = query({
	args: {
		entryDate: v.string(),
	},
	handler: async (ctx, args) => {
		const { clerkId } = await getCurrentUserInfo(ctx);

		return await getDayNotesByDate(
			ctx,
			clerkId,
			normalizeEntryDate(args.entryDate),
			false,
			MAX_DAY_NOTES_PER_DAY,
		);
	},
});

export const getTodayState = query({
	args: {
		entryDate: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { clerkId } = await getCurrentUserInfo(ctx);
		const entryDate = normalizeEntryDate(args.entryDate ?? getTodayDate());
		const [dayNotes, logEntry] = await Promise.all([
			getDayNotesByDate(ctx, clerkId, entryDate, false, MAX_DAY_NOTES_PER_DAY),
			getLogEntryByDate(ctx, clerkId, entryDate),
		]);
		const snapshot = getDayNotesSnapshot(dayNotes);
		const dirtyPrompt = buildDirtyPromptState(
			logEntry,
			snapshot.dirtyPromptDigest,
		);
		const state =
			!logEntry && snapshot.noteCount === 0
				? 'empty'
				: !logEntry
					? 'collecting'
					: 'summarized';

		return {
			entryDate,
			dayNotes,
			logEntry,
			noteCount: snapshot.noteCount,
			hasSynthesizedEntry: Boolean(logEntry),
			state,
			dirtyPrompt: {
				isDirty: dirtyPrompt.isDirty,
				isDismissed: dirtyPrompt.dismissedForCurrentDigest,
				shouldPrompt: dirtyPrompt.shouldPrompt,
				digest: snapshot.dirtyPromptDigest,
				latestUpdatedAt: snapshot.latestCreatedAt,
			},
		};
	},
});

export const dismissDirtyPrompt = mutation({
	args: {
		entryDate: v.string(),
	},
	handler: async (ctx, args) => {
		const { clerkId } = await getCurrentUserInfo(ctx);
		const entryDate = normalizeEntryDate(args.entryDate);
		const logEntry = await getLogEntryByDate(ctx, clerkId, entryDate);

		if (!logEntry) {
			return null;
		}

		await ctx.db.patch(logEntry._id, {
			dirtyPromptDismissedDigest: getDayNotesSnapshot(
				await getDayNotesByDate(
					ctx,
					clerkId,
					entryDate,
					false,
					MAX_DAY_NOTES_PER_DAY,
				),
			).dirtyPromptDigest,
		});

		return null;
	},
});

export const loadSynthesisContext = internalQuery({
	args: {
		clerkId: v.string(),
		entryDate: v.string(),
	},
	handler: async (ctx, args): Promise<DayCaptureSynthesisContext> => {
		const entryDate = normalizeEntryDate(args.entryDate);
		const dayNotes = await getDayNotesByDate(
			ctx,
			args.clerkId,
			entryDate,
			undefined,
			MAX_DAY_NOTES_PER_DAY,
		);
		const snapshot = getDayNotesSnapshot(dayNotes);

		return {
			clerkId: args.clerkId,
			entryDate,
			noteCount: snapshot.noteCount,
			rawInput: snapshot.rawInput,
			mode: snapshot.noteCount <= 1 ? ('single' as const) : ('multi' as const),
			dayNotes,
			activeNoteIds: dayNotes
				.filter((note) => !note.isArchived)
				.map((note) => note._id),
			dirtyPromptDigest: snapshot.dirtyPromptDigest,
		};
	},
});

export const saveSynthesizedEntry = internalMutation({
	args: {
		clerkId: v.string(),
		entryDate: v.string(),
		rawInput: v.string(),
		structuredData: structuredSynthesisValidator,
		noteCount: v.number(),
		activeNoteIds: v.array(v.id('dayNotes')),
	},
	handler: async (ctx, args) => {
		const entryDate = normalizeEntryDate(args.entryDate);
		const now = Date.now();
		const existing = await getLogEntryByDate(ctx, args.clerkId, entryDate);
		const payload = toLogEntryPayload({
			clerkId: args.clerkId,
			entryDate,
			rawInput: args.rawInput,
			structuredData: args.structuredData,
			noteCount: args.noteCount,
			now,
			createdAt: existing?.createdAt ?? now,
		});

		if (existing) {
			await ctx.db.replace(existing._id, payload);
		} else {
			await ctx.db.insert('logEntries', payload);
		}

		for (const noteId of args.activeNoteIds) {
			await ctx.db.patch(noteId, { isArchived: true });
		}
	},
});

function toLogEntryPayload(args: {
	clerkId: string;
	entryDate: string;
	rawInput: string;
	structuredData: StructuredSynthesis;
	noteCount: number;
	now: number;
	createdAt: number;
}) {
	return {
		clerkId: args.clerkId,
		entryDate: args.entryDate,
		rawInput: args.rawInput,
		summary: deriveSummary(args.structuredData.summary),
		tasksCompleted: args.structuredData.tasksCompleted,
		skillsDemonstrated: args.structuredData.skillsDemonstrated,
		impact: args.structuredData.impact,
		blockers: args.structuredData.blockers,
		tags: args.structuredData.tags,
		isDirty: false,
		dirtyPromptDismissedDigest: null,
		lastSynthesizedAt: args.now,
		noteCount: args.noteCount,
		createdAt: args.createdAt,
		updatedAt: args.now,
	};
}

function getTodayDate() {
	const now = new Date();
	const year = now.getFullYear();
	const month = `${now.getMonth() + 1}`.padStart(2, '0');
	const day = `${now.getDate()}`.padStart(2, '0');

	return `${year}-${month}-${day}`;
}
