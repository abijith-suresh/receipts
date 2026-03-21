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
	import {
		addMonths,
		addDays,
		formatMonthLabel,
		getMonthRange,
		getTodayLocalDate,
		getWeekRange,
		listMonthGridDates,
		listWeekDates,
	} from '$lib/utils/date';

	const clerk = useClerkContext();
	const view = $derived(($page.url.searchParams.get('view') as 'week' | 'month' | 'archive' | null) || 'week');
	const activeDate = $derived($page.url.searchParams.get('date') || getTodayLocalDate());
	const activeMonth = $derived($page.url.searchParams.get('month') || activeDate.slice(0, 7));
	const ready = $derived(clerk.isLoaded && !!clerk.auth.userId && $convexAuthReady);
	const weekRange = $derived(getWeekRange(activeDate));
	const monthRange = $derived(getMonthRange(activeDate));

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
		updateSearch({ view: nextView });
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
	<div class="history-header">
		<div>
			<p class="eyebrow">History</p>
			<h1 class="title">Browse your receipts without the endless feed.</h1>
			<p class="desc">
				Move through your work by week, month, or archive when you need review prep instead of raw scrolling.
			</p>
		</div>

		<div class="header-controls">
			<div class="view-switcher">
				{#each ['week', 'month', 'archive'] as option}
					<button type="button" class:selected={view === option} onclick={() => changeView(option as 'week' | 'month' | 'archive')}>
						{option}
					</button>
				{/each}
			</div>

			<div class="period-nav">
				<button type="button" onclick={() => shiftPeriod(-1)}>←</button>
				<span>{view === 'archive' ? formatMonthLabel(`${activeMonth}-01`) : formatMonthLabel(activeDate)}</span>
				<button type="button" onclick={() => shiftPeriod(1)}>→</button>
			</div>
		</div>
	</div>

	{#if !ready || weekEntries.isLoading || monthEntries.isLoading || archiveMonths.isLoading || archiveEntries.isLoading}
		<div class="status-card">Loading your history…</div>
	{:else if weekEntries.error || monthEntries.error || archiveMonths.error || archiveEntries.error}
		<div class="error-card">Unable to load your history right now.</div>
	{:else if view === 'week'}
		<HistoryWeekView
			weekDates={listWeekDates(activeDate)}
			entries={weekEntries.data ?? []}
			selectedDate={activeDate}
			onSelectDate={(date) => updateSearch({ date })}
		/>
	{:else if view === 'month'}
		<HistoryMonthView
			entryDate={activeDate}
			gridDates={listMonthGridDates(activeDate)}
			entries={monthEntries.data ?? []}
			selectedDate={activeDate}
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
	align-items: flex-end;
	gap: 1.5rem;
	padding-bottom: 1.4rem;
	border-bottom: 1px solid var(--color-border);
	flex-wrap: wrap;
}

.eyebrow {
	margin: 0 0 0.4rem;
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.title {
	margin: 0;
	font-family: var(--font-display);
	font-size: 2.35rem;
	font-weight: 400;
	line-height: 1.08;
	color: var(--color-ink);
	max-width: 42rem;
}

.desc {
	margin: 0.65rem 0 0;
	max-width: 42rem;
	font-size: 0.95rem;
	line-height: 1.8;
	color: var(--color-muted);
}

.header-controls {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
	align-items: flex-end;
}

.view-switcher,
.period-nav {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0.3rem;
	border-radius: 9999px;
	border: 1px solid var(--color-border);
	background: var(--color-surface);
}

.view-switcher button,
.period-nav button {
	padding: 0.5rem 0.85rem;
	border: none;
	border-radius: 9999px;
	background: transparent;
	font-size: 0.82rem;
	font-weight: 600;
	color: var(--color-muted);
	cursor: pointer;
	text-transform: capitalize;
}

.view-switcher button.selected,
.period-nav button:hover {
	background: var(--color-canvas);
	color: var(--color-ink);
}

.period-nav span {
	padding: 0 0.4rem;
	font-size: 0.82rem;
	font-weight: 600;
	color: var(--color-ink);
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
</style>
