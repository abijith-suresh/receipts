import type { LogEntry } from '$lib/convex';

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
