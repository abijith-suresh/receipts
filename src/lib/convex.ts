import { makeFunctionReference } from 'convex/server';

import type { HistoryView } from '$lib/history/preferences';
import type { WeekStartsOn } from '$lib/utils/date';

export type TodayNote = {
	_id: string;
	_creationTime: number;
	clerkId: string;
	entryDate: string;
	content: string;
	createdAt: number;
	isArchived: boolean;
};

export type LogEntry = {
	_id: string;
	_creationTime: number;
	clerkId: string;
	entryDate: string;
	rawInput: string;
	summary: string;
	tasksCompleted?: string[];
	skillsDemonstrated?: string[];
	impact?: string | null;
	blockers?: string | null;
	tags?: string[];
	isDirty: boolean;
	lastSynthesizedAt?: number;
	noteCount?: number;
	createdAt: number;
	updatedAt: number;
};

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

export const api = {
	users: {
		ensureCurrentUser: makeFunctionReference<
			'mutation',
			Record<string, never>,
			string
		>('users:ensureCurrentUser'),
		current: makeFunctionReference<
			'query',
			Record<string, never>,
			{
				_id: string;
				_creationTime: number;
				clerkId: string;
				email?: string;
				name?: string;
				imageUrl?: string;
				timezone?: string;
				weekStartsOn?: WeekStartsOn;
				defaultHistoryView?: HistoryView;
				createdAt: number;
				updatedAt: number;
			} | null
		>('users:current'),
		settings: makeFunctionReference<
			'query',
			Record<string, never>,
			{
				timezone: string;
				weekStartsOn: WeekStartsOn;
				defaultHistoryView: HistoryView;
			}
		>('users:settings'),
		updateSettings: makeFunctionReference<
			'mutation',
			{
				timezone: string;
				weekStartsOn: WeekStartsOn;
				defaultHistoryView: HistoryView;
			},
			{
				timezone: string;
				weekStartsOn: WeekStartsOn;
				defaultHistoryView: HistoryView;
			}
		>('users:updateSettings'),
	},
	dayCapture: {
		addDayNote: makeFunctionReference<
			'mutation',
			{ entryDate: string; content?: string; body?: string; rawInput?: string },
			string
		>('dayCapture:addDayNote'),
		getDayNotes: makeFunctionReference<
			'query',
			{ entryDate: string },
			TodayNote[]
		>('dayCapture:getDayNotes'),
		getTodayState: makeFunctionReference<
			'query',
			{ entryDate?: string },
			TodayState
		>('dayCapture:getTodayState'),
		dismissDirtyPrompt: makeFunctionReference<
			'mutation',
			{ entryDate: string },
			null
		>('dayCapture:dismissDirtyPrompt'),
		triggerSynthesis: makeFunctionReference<
			'action',
			{ entryDate: string },
			{ entryDate: string; noteCount: number }
		>('dayCaptureActions:synthesizeDayCapture'),
	},
	logEntries: {
		create: makeFunctionReference<
			'mutation',
			{ entryDate: string; rawInput: string },
			string
		>('dayCapture:addDayNote'),
		upsert: makeFunctionReference<
			'mutation',
			{ entryDate: string; rawInput: string },
			string
		>('dayCapture:addDayNote'),
		list: makeFunctionReference<'query', Record<string, never>, LogEntry[]>(
			'logEntries:list',
		),
		getByDate: makeFunctionReference<
			'query',
			{ entryDate: string },
			LogEntry | null
		>('logEntries:getByDate'),
		listByRange: makeFunctionReference<
			'query',
			{ startDate: string; endDate: string },
			LogEntry[]
		>('logEntries:listByRange'),
		listRecent: makeFunctionReference<'query', { limit: number }, LogEntry[]>(
			'logEntries:listRecent',
		),
		listArchiveMonths: makeFunctionReference<
			'query',
			Record<string, never>,
			Array<{ month: string; count: number; latestEntryDate: string }>
		>('logEntries:listArchiveMonths'),
	},
} as const;

export type UserRecord = {
	_id: string;
	_creationTime: number;
	clerkId: string;
	email?: string;
	name?: string;
	imageUrl?: string;
	timezone?: string;
	weekStartsOn?: WeekStartsOn;
	defaultHistoryView?: HistoryView;
	createdAt: number;
	updatedAt: number;
};

export type UserSettings = (typeof api.users.settings)['_returnType'];
