export function getTodayLocalDate() {
	const now = new Date();
	const year = now.getFullYear();
	const month = `${now.getMonth() + 1}`.padStart(2, '0');
	const day = `${now.getDate()}`.padStart(2, '0');

	return `${year}-${month}-${day}`;
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

export function startOfWeek(entryDate: string) {
	const parsed = parseLocalDate(entryDate);
	const day = parsed.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	parsed.setDate(parsed.getDate() + diff);

	return toLocalDateString(parsed);
}

export function endOfWeek(entryDate: string) {
	return addDays(startOfWeek(entryDate), 6);
}

export function getWeekRange(entryDate: string) {
	const start = startOfWeek(entryDate);

	return {
		start,
		end: addDays(start, 6),
	};
}

export function listWeekDates(entryDate: string) {
	const start = startOfWeek(entryDate);

	return Array.from({ length: 7 }, (_, index) => addDays(start, index));
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

export function listMonthGridDates(entryDate: string) {
	const parsed = parseLocalDate(entryDate);
	const monthStart = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
	const monthEnd = new Date(parsed.getFullYear(), parsed.getMonth() + 1, 0);
	const firstGridDate = parseLocalDate(
		startOfWeek(toLocalDateString(monthStart)),
	);
	const lastGridDate = parseLocalDate(endOfWeek(toLocalDateString(monthEnd)));
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

export function formatRelativeEntryDate(entryDate: string) {
	const today = getTodayLocalDate();

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
