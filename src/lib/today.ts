import type { LogEntry, TodayNote, TodayState } from '$lib/convex';

export type TodayExperienceState = 'empty' | 'collecting' | 'summarized';

export function getTodayNotes(
	todayState: TodayState | null | undefined,
): TodayNote[] {
	return [...(todayState?.dayNotes ?? [])].sort(
		(left, right) => right.createdAt - left.createdAt,
	);
}

export function getTodaySummary(
	todayState: TodayState | null | undefined,
): LogEntry | null {
	return todayState?.logEntry ?? null;
}

export function getTodayExperienceState(
	todayState: TodayState | null | undefined,
): TodayExperienceState {
	if (todayState?.state === 'empty' || todayState?.state === 'collecting') {
		return todayState.state;
	}

	const notes = getTodayNotes(todayState);
	const summary = getTodaySummary(todayState);

	if (!summary && notes.length === 0) {
		return 'empty';
	}

	if (!summary) {
		return 'collecting';
	}

	return 'summarized';
}

export function getTodayCanSynthesize(
	todayState: TodayState | null | undefined,
) {
	return getTodayNotes(todayState).length > 0;
}

export function getTodayIsDirty(todayState: TodayState | null | undefined) {
	return todayState?.dirtyPrompt?.isDirty ?? false;
}

export function getTodayLastUpdatedAt(
	todayState: TodayState | null | undefined,
) {
	const latestNoteTimestamp = Math.max(
		...getTodayNotes(todayState).map((note) => note.createdAt),
		0,
	);
	const summaryTimestamp = getTodaySummary(todayState)?.updatedAt ?? 0;

	return Math.max(latestNoteTimestamp, summaryTimestamp, 0) || null;
}

export function getTodayNoteText(note: TodayNote | null | undefined) {
	return note?.content ?? '';
}

export function getTodayNoteUpdatedAt(note: TodayNote | null | undefined) {
	return note?.createdAt ?? note?._creationTime ?? 0;
}

export function getTodaySynthesisStatus() {
	return 'idle' as const;
}

export function getDaySummaryBody(summary: LogEntry | null | undefined) {
	if (!summary) {
		return '';
	}

	const sections = [
		summary.tasksCompleted?.length
			? `Tasks completed: ${summary.tasksCompleted.join('; ')}`
			: null,
		summary.skillsDemonstrated?.length
			? `Skills demonstrated: ${summary.skillsDemonstrated.join(', ')}`
			: null,
		summary.impact ? `Impact: ${summary.impact}` : null,
		summary.blockers ? `Blockers: ${summary.blockers}` : null,
	].filter(Boolean);

	return sections.join('\n');
}
