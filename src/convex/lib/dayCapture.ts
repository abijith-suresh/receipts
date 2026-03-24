import { v } from 'convex/values';

import type { Doc, Id } from '../_generated/dataModel';

export const MIN_DAY_NOTE_LENGTH = 3;
export const MAX_DAY_NOTE_LENGTH = 600;
export const MAX_DAY_NOTES_PER_DAY = 50;

export const structuredSynthesisValidator = v.object({
	summary: v.string(),
	tasksCompleted: v.array(v.string()),
	skillsDemonstrated: v.array(v.string()),
	impact: v.union(v.string(), v.null()),
	blockers: v.union(v.string(), v.null()),
	tags: v.array(v.string()),
});

export type StructuredSynthesis = {
	summary: string;
	tasksCompleted: string[];
	skillsDemonstrated: string[];
	impact: string | null;
	blockers: string | null;
	tags: string[];
};

export type SynthesisMode = 'single' | 'multi';

export type DayNoteRecord = Doc<'dayNotes'>;

export type DayCaptureSynthesisContext = {
	clerkId: string;
	entryDate: string;
	noteCount: number;
	rawInput: string;
	mode: SynthesisMode;
	dayNotes: DayNoteRecord[];
	activeNoteIds: Id<'dayNotes'>[];
	dirtyPromptDigest: string | null;
};

export type DayNoteLike = {
	_id: string;
	content: string;
	createdAt: number;
	isArchived: boolean;
};

export function normalizeEntryDate(entryDate: string) {
	const normalized = entryDate.trim();

	if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
		throw new Error('Use a valid date in YYYY-MM-DD format.');
	}

	return normalized;
}

export function normalizeDayNoteBody(body: string) {
	return body.trim().replace(/\s+/g, ' ');
}

export function assertValidDayNoteBody(body: string) {
	if (body.length < MIN_DAY_NOTE_LENGTH) {
		throw new Error('Please write at least 3 characters for each note.');
	}

	if (body.length > MAX_DAY_NOTE_LENGTH) {
		throw new Error('Keep each note under 600 characters.');
	}
}

export function deriveSummary(rawInput: string) {
	const cleaned = rawInput.trim().replace(/\s+/g, ' ');
	const [firstSentence] = cleaned.split(/(?<=[.!?])\s+/);

	if (firstSentence && firstSentence.length <= 140) {
		return firstSentence;
	}

	return `${cleaned.slice(0, 137).trimEnd()}${cleaned.length > 137 ? '...' : ''}`;
}

export function buildCombinedRawInput(
	notes: Array<Pick<DayNoteLike, 'content'>>,
) {
	return notes.map((note) => note.content).join('\n');
}

export function getDayNotesSnapshot(notes: DayNoteLike[]) {
	const sortedNotes = [...notes].sort(
		(left, right) => left.createdAt - right.createdAt,
	);
	const noteCount = sortedNotes.length;
	const latestCreatedAt = sortedNotes.reduce(
		(latest, note) => Math.max(latest, note.createdAt),
		0,
	);

	return {
		noteCount,
		latestCreatedAt,
		dirtyPromptDigest: buildDirtyPromptDigest(noteCount, latestCreatedAt),
		rawInput: buildCombinedRawInput(sortedNotes),
		sortedNotes,
	};
}

function buildDirtyPromptDigest(noteCount: number, latestCreatedAt: number) {
	if (noteCount === 0 || latestCreatedAt === 0) {
		return null;
	}

	return `${noteCount}:${latestCreatedAt}`;
}
