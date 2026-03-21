import type { HistoryView } from '$lib/history/preferences';
import type { WeekStartsOn } from '$lib/utils/date';

export const weekStartOptions: Array<{
	value: WeekStartsOn;
	label: string;
	description: string;
}> = [
	{
		value: 1,
		label: 'Monday',
		description: 'Matches the standard workweek in most teams.',
	},
	{
		value: 0,
		label: 'Sunday',
		description: 'Useful when your planning cycle resets on Sunday.',
	},
	{
		value: 6,
		label: 'Saturday',
		description: 'Useful when your week resets before Sunday.',
	},
	{
		value: 2,
		label: 'Tuesday',
		description: 'Keeps review windows aligned to a Tuesday start.',
	},
	{
		value: 3,
		label: 'Wednesday',
		description: 'Useful for teams that checkpoint midweek.',
	},
	{
		value: 4,
		label: 'Thursday',
		description: 'Works when reporting cycles anchor later in the week.',
	},
	{
		value: 5,
		label: 'Friday',
		description: 'Useful when the workweek rolls over on Friday.',
	},
];

export const historyViewOptions: Array<{
	value: HistoryView;
	label: string;
	description: string;
}> = [
	{
		value: 'week',
		label: 'Week',
		description: 'Open to the current week for review and backfill.',
	},
	{
		value: 'month',
		label: 'Month',
		description: 'See your logging rhythm at a glance.',
	},
	{
		value: 'timeline',
		label: 'Timeline',
		description: 'Browse all entries as a chronological log.',
	},
];

const fallbackTimezones = [
	'UTC',
	'America/Los_Angeles',
	'America/Denver',
	'America/Chicago',
	'America/New_York',
	'Europe/London',
	'Europe/Berlin',
	'Asia/Dubai',
	'Asia/Kolkata',
	'Asia/Singapore',
	'Asia/Tokyo',
	'Australia/Sydney',
];

export function getBrowserTimeZone() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
	} catch {
		return 'UTC';
	}
}

export function listTimezoneOptions(currentTimezone?: string) {
	const supported =
		typeof Intl.supportedValuesOf === 'function'
			? Intl.supportedValuesOf('timeZone')
			: fallbackTimezones;

	return Array.from(
		new Set([
			currentTimezone,
			getBrowserTimeZone(),
			...fallbackTimezones,
			...supported,
		]),
	).filter(
		(value): value is string => typeof value === 'string' && value.length > 0,
	);
}
