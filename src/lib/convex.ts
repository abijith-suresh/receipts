import { makeFunctionReference } from 'convex/server';

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
				createdAt: number;
				updatedAt: number;
			} | null
		>('users:current'),
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
	createdAt: number;
	updatedAt: number;
};

export type LogEntry = (typeof api.logEntries.list)['_returnType'][number];
