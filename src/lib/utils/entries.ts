const MIN_ENTRY_LENGTH = 10;

export function validateEntry(rawInput: string) {
	const trimmed = rawInput.trim();

	if (trimmed.length < MIN_ENTRY_LENGTH) {
		return 'Write at least 10 characters about what you worked on today.';
	}

	return null;
}
