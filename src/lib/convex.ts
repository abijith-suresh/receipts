import { makeFunctionReference } from 'convex/server';

import type { HistoryView } from '$lib/history/preferences';
import type { WeekStartsOn } from '$lib/utils/date';

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
	logEntries: {
		list: makeFunctionReference<
			'query',
			Record<string, never>,
			Array<{
				_id: string;
				_creationTime: number;
				clerkId: string;
				entryDate: string;
				rawInput: string;
				summary: string;
				createdAt: number;
				updatedAt: number;
			}>
		>('logEntries:list'),
		getByDate: makeFunctionReference<
			'query',
			{ entryDate: string },
			{
				_id: string;
				_creationTime: number;
				clerkId: string;
				entryDate: string;
				rawInput: string;
				summary: string;
				createdAt: number;
				updatedAt: number;
			} | null
		>('logEntries:getByDate'),
		listByRange: makeFunctionReference<
			'query',
			{ startDate: string; endDate: string },
			Array<{
				_id: string;
				_creationTime: number;
				clerkId: string;
				entryDate: string;
				rawInput: string;
				summary: string;
				createdAt: number;
				updatedAt: number;
			}>
		>('logEntries:listByRange'),
		listRecent: makeFunctionReference<
			'query',
			{ limit: number },
			Array<{
				_id: string;
				_creationTime: number;
				clerkId: string;
				entryDate: string;
				rawInput: string;
				summary: string;
				createdAt: number;
				updatedAt: number;
			}>
		>('logEntries:listRecent'),
		listArchiveMonths: makeFunctionReference<
			'query',
			Record<string, never>,
			Array<{
				month: string;
				count: number;
				latestEntryDate: string;
			}>
		>('logEntries:listArchiveMonths'),
		create: makeFunctionReference<
			'mutation',
			{ entryDate: string; rawInput: string },
			string
		>('logEntries:create'),
		upsert: makeFunctionReference<
			'mutation',
			{ entryDate: string; rawInput: string },
			string
		>('logEntries:upsert'),
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

export type LogEntry = (typeof api.logEntries.list)['_returnType'][number];
export type UserSettings = (typeof api.users.settings)['_returnType'];
