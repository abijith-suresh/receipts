export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function getTodayLocalDate(timeZone?: string) {
	const now = new Date();

	if (timeZone) {
		try {
			return formatDatePartsAsEntryDate(
				new Intl.DateTimeFormat('en', {
					timeZone,
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
				}).formatToParts(now),
			);
		} catch {
			return toLocalDateString(now);
		}
	}

	return toLocalDateString(now);
}

export function parseLocalDate(entryDate: string) {
	const [year, month, day] = entryDate.split('-').map(Number);

	return new Date(year, month - 1, day);
}

export function addDays(entryDate: string, amount: number) {
	const parsed = parseLocalDate(entryDate);
	parsed.setDate(parsed.getDate() + amount);

	return toLocalDateString(parsed);
}

export function addMonths(entryDate: string, amount: number) {
	const parsed = parseLocalDate(entryDate);
	parsed.setMonth(parsed.getMonth() + amount);

	return toLocalDateString(parsed);
}

export function startOfWeek(entryDate: string, weekStartsOn: WeekStartsOn = 1) {
	const parsed = parseLocalDate(entryDate);
	const day = parsed.getDay();
	const offset = (day - normalizeWeekStartsOn(weekStartsOn) + 7) % 7;
	parsed.setDate(parsed.getDate() - offset);

	return toLocalDateString(parsed);
}

export function endOfWeek(entryDate: string, weekStartsOn: WeekStartsOn = 1) {
	return addDays(startOfWeek(entryDate, weekStartsOn), 6);
}

export function getWeekRange(
	entryDate: string,
	weekStartsOn: WeekStartsOn = 1,
) {
	const start = startOfWeek(entryDate, weekStartsOn);

	return {
		start,
		end: addDays(start, 6),
	};
}

export function listWeekDates(
	entryDate: string,
	weekStartsOn: WeekStartsOn = 1,
) {
	const start = startOfWeek(entryDate, weekStartsOn);

	return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function listWeekdayLabels(weekStartsOn: WeekStartsOn = 1) {
	const normalizedWeekStart = normalizeWeekStartsOn(weekStartsOn);
	const sunday = new Date(2024, 0, 7);

	return Array.from({ length: 7 }, (_, index) => {
		const date = new Date(sunday);
		date.setDate(sunday.getDate() + normalizedWeekStart + index);

		return new Intl.DateTimeFormat('en', {
			weekday: 'short',
		}).format(date);
	});
}

export function getMonthRange(entryDate: string) {
	const parsed = parseLocalDate(entryDate);
	const monthStart = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
	const monthEnd = new Date(parsed.getFullYear(), parsed.getMonth() + 1, 0);

	return {
		start: toLocalDateString(monthStart),
		end: toLocalDateString(monthEnd),
	};
}

export function listMonthGridDates(
	entryDate: string,
	weekStartsOn: WeekStartsOn = 1,
) {
	const parsed = parseLocalDate(entryDate);
	const monthStart = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
	const monthEnd = new Date(parsed.getFullYear(), parsed.getMonth() + 1, 0);
	const firstGridDate = parseLocalDate(
		startOfWeek(toLocalDateString(monthStart), weekStartsOn),
	);
	const lastGridDate = parseLocalDate(
		endOfWeek(toLocalDateString(monthEnd), weekStartsOn),
	);
	const dates: Array<{ date: string; inMonth: boolean }> = [];

	for (
		let cursor = new Date(firstGridDate);
		cursor <= lastGridDate;
		cursor.setDate(cursor.getDate() + 1)
	) {
		dates.push({
			date: toLocalDateString(cursor),
			inMonth: cursor.getMonth() === parsed.getMonth(),
		});
	}

	return dates;
}

export function formatWeekRangeLabel(
	entryDate: string,
	weekStartsOn: WeekStartsOn = 1,
) {
	const { start, end } = getWeekRange(entryDate, weekStartsOn);
	const startDate = parseLocalDate(start);
	const endDate = parseLocalDate(end);

	if (
		startDate.getFullYear() === endDate.getFullYear() &&
		startDate.getMonth() === endDate.getMonth()
	) {
		return `${new Intl.DateTimeFormat('en', { month: 'long' }).format(startDate)} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
	}

	if (startDate.getFullYear() === endDate.getFullYear()) {
		return `${formatEntryDateCompact(start)} - ${formatEntryDateCompact(end)}, ${startDate.getFullYear()}`;
	}

	return `${formatEntryDate(start)} - ${formatEntryDate(end)}`;
}

export function formatRelativeEntryDate(entryDate: string, timeZone?: string) {
	const today = getTodayLocalDate(timeZone);

	if (entryDate === today) {
		return 'Today';
	}

	if (entryDate === addDays(today, -1)) {
		return 'Yesterday';
	}

	return formatEntryDateCompact(entryDate);
}

export function formatEntryDate(entryDate: string) {
	const parsed = parseLocalDate(entryDate);

	return new Intl.DateTimeFormat('en', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(parsed);
}

export function formatEntryDateCompact(entryDate: string) {
	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
	}).format(parseLocalDate(entryDate));
}

export function formatWeekday(entryDate: string) {
	return new Intl.DateTimeFormat('en', {
		weekday: 'short',
	}).format(parseLocalDate(entryDate));
}

export function formatMonthLabel(entryDate: string) {
	return new Intl.DateTimeFormat('en', {
		month: 'long',
		year: 'numeric',
	}).format(parseLocalDate(entryDate));
}

export function formatDateTime(timestamp: number) {
	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	}).format(new Date(timestamp));
}

export function getMonthKey(entryDate: string) {
	return entryDate.slice(0, 7);
}

export function formatMonthKey(monthKey: string) {
	return formatMonthLabel(`${monthKey}-01`);
}

function toLocalDateString(date: Date) {
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');

	return `${year}-${month}-${day}`;
}

function formatDatePartsAsEntryDate(parts: Intl.DateTimeFormatPart[]) {
	const year = parts.find((part) => part.type === 'year')?.value;
	const month = parts.find((part) => part.type === 'month')?.value;
	const day = parts.find((part) => part.type === 'day')?.value;

	if (!year || !month || !day) {
		throw new Error('Unable to resolve date parts for timezone.');
	}

	return `${year}-${month}-${day}`;
}

function normalizeWeekStartsOn(weekStartsOn: WeekStartsOn) {
	return (((weekStartsOn % 7) + 7) % 7) as WeekStartsOn;
}
