<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { useQuery } from 'convex-svelte';
	import { useClerkContext } from 'svelte-clerk';

	import { convexAuthReady } from '$lib/auth/convexAuth';
	import HistoryMonthView from '$lib/components/HistoryMonthView.svelte';
	import HistoryTimelineView from '$lib/components/HistoryTimelineView.svelte';
	import HistoryWeekView from '$lib/components/HistoryWeekView.svelte';
	import { api } from '$lib/convex';
	import { getHistoryPreferences, resolveHistoryView } from '$lib/history/preferences';
	import {
		addMonths,
		addDays,
		formatMonthLabel,
		formatWeekRangeLabel,
		getMonthRange,
		getTodayLocalDate,
		getWeekRange,
		listMonthGridDates,
		listWeekdayLabels,
		listWeekDates,
	} from '$lib/utils/date';

	const clerk = useClerkContext();
	const ready = $derived(clerk.isLoaded && !!clerk.auth.userId && $convexAuthReady);
	const settings = useQuery(api.users.settings, () => (ready ? {} : 'skip'));
	const historyPreferences = $derived(
		getHistoryPreferences({
			weekStartsOn: settings.data?.weekStartsOn,
			defaultHistoryView: settings.data?.defaultHistoryView,
		}),
	);
	const preferredTimezone = $derived(settings.data?.timezone);
	const view = $derived(
		resolveHistoryView($page.url.searchParams.get('view'), historyPreferences.defaultHistoryView),
	);
	const activeDate = $derived(
		$page.url.searchParams.get('date') || getTodayLocalDate(preferredTimezone),
	);

	// Stabilize to the first of the month to prevent same-month date clicks
	// from re-firing the Convex query and remounting the component
	const activeMonthStart = $derived(`${activeDate.slice(0, 7)}-01`);
	const monthRange = $derived(getMonthRange(activeMonthStart));

	const weekRange = $derived(getWeekRange(activeDate, historyPreferences.weekStartsOn));
	const weekDates = $derived(listWeekDates(activeDate, historyPreferences.weekStartsOn));
	const weekdayLabels = $derived(listWeekdayLabels(historyPreferences.weekStartsOn));

	const weekEntries = useQuery(
		api.logEntries.listByRange,
		() => (ready ? { startDate: weekRange.start, endDate: weekRange.end } : 'skip'),
	);
	const monthEntries = useQuery(
		api.logEntries.listByRange,
		() => (ready ? { startDate: monthRange.start, endDate: monthRange.end } : 'skip'),
	);
	const timelineEntries = useQuery(api.logEntries.list, () => (ready ? {} : 'skip'));

	const isLoading = $derived(
		!ready ||
		(view === 'week' && weekEntries.isLoading) ||
		(view === 'month' && monthEntries.isLoading) ||
		(view === 'timeline' && timelineEntries.isLoading) ||
		settings.isLoading,
	);

	const hasError = $derived(
		(view === 'week' && !!weekEntries.error) ||
		(view === 'month' && !!monthEntries.error) ||
		(view === 'timeline' && !!timelineEntries.error),
	);

	function updateSearch(params: Record<string, string>) {
		const search = new URLSearchParams($page.url.searchParams);
		for (const [key, value] of Object.entries(params)) {
			search.set(key, value);
		}

		void goto(`/history?${search.toString()}`, { keepFocus: true, noScroll: true });
	}

	function changeView(nextView: 'week' | 'month' | 'timeline') {
		if (nextView === 'timeline') {
			void goto('/history?view=timeline', { keepFocus: true, noScroll: true });
			return;
		}

		updateSearch({ view: nextView, date: activeDate });
	}

	function shiftPeriod(direction: -1 | 1) {
		if (view === 'week') {
			updateSearch({ date: addDays(activeDate, direction * 7) });
			return;
		}

		if (view === 'month') {
			updateSearch({ date: addMonths(activeDate, direction) });
		}
	}
</script>

<div class="history-page">
	<header class="history-header">
		<span class="view-label">{view}</span>

		{#if view !== 'timeline'}
			<div class="period-nav">
				<button type="button" onclick={() => shiftPeriod(-1)} aria-label="Previous period">←</button>
				<span class="period-label">
					{view === 'week'
						? formatWeekRangeLabel(activeDate, historyPreferences.weekStartsOn)
						: formatMonthLabel(activeMonthStart)}
				</span>
				<button type="button" onclick={() => shiftPeriod(1)} aria-label="Next period">→</button>
			</div>
		{/if}
	</header>

	{#if isLoading}
		<div class="status-card">Loading your history…</div>
	{:else if hasError}
		<div class="error-card">Unable to load your history right now.</div>
	{:else if view === 'week'}
		<HistoryWeekView
			weekDates={weekDates}
			entries={weekEntries.data ?? []}
			selectedDate={activeDate}
			timezone={preferredTimezone}
			onSelectDate={(date) => updateSearch({ date })}
		/>
	{:else if view === 'month'}
		<HistoryMonthView
			entryDate={activeMonthStart}
			gridDates={listMonthGridDates(activeMonthStart, historyPreferences.weekStartsOn)}
			entries={monthEntries.data ?? []}
			selectedDate={activeDate}
			timezone={preferredTimezone}
			weekdayLabels={weekdayLabels}
			onSelectDate={(date) => updateSearch({ date })}
		/>
	{:else if view === 'timeline'}
		<HistoryTimelineView entries={timelineEntries.data ?? []} timezone={preferredTimezone} />
	{/if}
</div>

<style>
	.history-page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--color-border);
		min-height: 3.5rem;
	}

	.view-label {
		font-family: var(--font-body);
		font-size: 1.25rem;
		font-weight: 400;
		color: var(--color-ink);
		line-height: 1.3;
		text-transform: capitalize;
	}

	.period-nav {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: 9999px;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.period-nav button {
		padding: 0.4rem 0.6rem;
		border: none;
		border-radius: 9999px;
		background: transparent;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-muted);
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.period-nav button:hover {
		color: var(--color-ink);
	}

	.period-label {
		padding: 0 0.5rem;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-ink);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 12rem;
	}

	.status-card,
	.error-card {
		padding: 1.25rem 1.4rem;
		border-radius: 1rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		font-size: 0.9rem;
		color: var(--color-muted);
	}

	.error-card {
		border-color: #fecaca;
		background: #fef2f2;
		color: #b91c1c;
	}

	@media (max-width: 640px) {
		.history-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}
</style>
