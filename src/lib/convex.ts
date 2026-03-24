export { api } from '../convex/_generated/api';

import type { HistoryView } from '$lib/history/preferences';
import type { WeekStartsOn } from '$lib/utils/date';
import type { Doc } from '../convex/_generated/dataModel';

export type TodayNote = Doc<'dayNotes'>;
export type LogEntry = Doc<'logEntries'>;
export type UserRecord = Doc<'users'>;

export type TodayState = {
	entryDate: string;
	dayNotes: TodayNote[];
	logEntry: LogEntry | null;
	noteCount: number;
	hasSynthesizedEntry: boolean;
	state: 'empty' | 'collecting' | 'summarized';
	dirtyPrompt: {
		isDirty: boolean;
		isDismissed: boolean;
		shouldPrompt: boolean;
		digest: string | null;
		latestUpdatedAt: number;
	};
};

export type UserSettings = {
	timezone: string;
	weekStartsOn: WeekStartsOn;
	defaultHistoryView: HistoryView;
};
