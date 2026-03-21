<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { useQuery } from 'convex-svelte';
	import { useClerkContext } from 'svelte-clerk';

	import { convexAuthReady } from '$lib/auth/convexAuth';
	import HistoryArchiveView from '$lib/components/HistoryArchiveView.svelte';
	import HistoryMonthView from '$lib/components/HistoryMonthView.svelte';
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
	const activeMonth = $derived($page.url.searchParams.get('month') || activeDate.slice(0, 7));
	const weekRange = $derived(getWeekRange(activeDate, historyPreferences.weekStartsOn));
	const monthRange = $derived(getMonthRange(activeDate));
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
	const archiveMonths = useQuery(api.logEntries.listArchiveMonths, () => (ready ? {} : 'skip'));
	const archiveEntries = useQuery(
		api.logEntries.listByRange,
		() =>
			ready
				? { startDate: `${activeMonth}-01`, endDate: getMonthRange(`${activeMonth}-01`).end }
				: 'skip',
	);

	function updateSearch(params: Record<string, string>) {
		const search = new URLSearchParams($page.url.searchParams);
		for (const [key, value] of Object.entries(params)) {
			search.set(key, value);
		}

		void goto(`/history?${search.toString()}`, { keepFocus: true, noScroll: true });
	}

	function changeView(nextView: 'week' | 'month' | 'archive') {
		if (nextView === 'archive') {
			updateSearch({ view: nextView, month: activeMonth });
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
			return;
		}

		updateSearch({ month: addMonths(`${activeMonth}-01`, direction).slice(0, 7) });
	}
</script>

<div class="history-page">
	<header class="history-header">
		<span class="eyebrow">History</span>
		
		<div class="controls">
			<div class="view-switcher">
				{#each ['week', 'month', 'archive'] as option}
					<button 
						type="button" 
						class:selected={view === option} 
						onclick={() => changeView(option as 'week' | 'month' | 'archive')}
					>
						{option}
					</button>
				{/each}
			</div>

			<div class="period-nav">
				<button type="button" onclick={() => shiftPeriod(-1)} aria-label="Previous period">←</button>
				<span class="period-label">
					{view === 'week'
						? formatWeekRangeLabel(activeDate, historyPreferences.weekStartsOn)
						: view === 'archive'
							? formatMonthLabel(`${activeMonth}-01`)
							: formatMonthLabel(activeDate)}
				</span>
				<button type="button" onclick={() => shiftPeriod(1)} aria-label="Next period">→</button>
			</div>
		</div>
	</header>

	{#if !ready || weekEntries.isLoading || monthEntries.isLoading || archiveMonths.isLoading || archiveEntries.isLoading}
		<div class="status-card">Loading your history…</div>
	{:else if weekEntries.error || monthEntries.error || archiveMonths.error || archiveEntries.error}
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
			entryDate={activeDate}
			gridDates={listMonthGridDates(activeDate, historyPreferences.weekStartsOn)}
			entries={monthEntries.data ?? []}
			selectedDate={activeDate}
			timezone={preferredTimezone}
			weekdayLabels={weekdayLabels}
			onSelectDate={(date) => updateSearch({ date })}
		/>
	{:else}
		<HistoryArchiveView
			months={archiveMonths.data ?? []}
			entries={archiveEntries.data ?? []}
			activeMonth={activeMonth}
			onSelectMonth={(month) => updateSearch({ month })}
		/>
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

	.eyebrow {
		font-family: var(--font-body);
		font-size: 1.25rem;
		font-weight: 400;
		color: var(--color-ink);
		line-height: 1.3;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.view-switcher,
	.period-nav {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: 9999px;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.view-switcher button,
	.period-nav button {
		padding: 0.4rem 0.75rem;
		border: none;
		border-radius: 9999px;
		background: transparent;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-muted);
		cursor: pointer;
		text-transform: capitalize;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.view-switcher button:hover,
	.period-nav button:hover {
		color: var(--color-ink);
	}

	.view-switcher button.selected {
		background: var(--color-canvas);
		color: var(--color-ink);
		font-weight: 600;
	}

	.period-nav button {
		padding: 0.4rem 0.6rem;
		font-weight: 500;
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

		.controls {
			width: 100%;
			justify-content: space-between;
		}
	}
</style>
