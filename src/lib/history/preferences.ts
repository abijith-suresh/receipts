import type { WeekStartsOn } from '$lib/utils/date';

export type HistoryView = 'week' | 'month' | 'timeline';

export type HistoryPreferences = {
	weekStartsOn: WeekStartsOn;
	defaultHistoryView: HistoryView;
};

const DEFAULT_HISTORY_PREFERENCES: HistoryPreferences = {
	weekStartsOn: 1,
	defaultHistoryView: 'week',
};

export function getHistoryPreferences(
	overrides?: Partial<HistoryPreferences>,
): HistoryPreferences {
	return {
		weekStartsOn:
			overrides?.weekStartsOn ?? DEFAULT_HISTORY_PREFERENCES.weekStartsOn,
		defaultHistoryView:
			overrides?.defaultHistoryView ??
			DEFAULT_HISTORY_PREFERENCES.defaultHistoryView,
	};
}

export function resolveHistoryView(
	value: string | null | undefined,
	fallback: HistoryView = DEFAULT_HISTORY_PREFERENCES.defaultHistoryView,
): HistoryView {
	if (value === 'week' || value === 'month' || value === 'timeline') {
		return value;
	}

	return fallback;
}

export function getHistoryHref(
	date: string,
	preferences: HistoryPreferences = DEFAULT_HISTORY_PREFERENCES,
) {
	const search = new URLSearchParams({
		view: preferences.defaultHistoryView,
	});

	if (preferences.defaultHistoryView === 'timeline') {
		search.set('month', date.slice(0, 7));
	} else {
		search.set('date', date);
	}

	return `/history?${search.toString()}`;
}
