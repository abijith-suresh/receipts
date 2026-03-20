export function getTodayLocalDate() {
	const now = new Date();
	const year = now.getFullYear();
	const month = `${now.getMonth() + 1}`.padStart(2, '0');
	const day = `${now.getDate()}`.padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function formatEntryDate(entryDate: string) {
	const parsed = new Date(`${entryDate}T00:00:00`);

	return new Intl.DateTimeFormat('en', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(parsed);
}
