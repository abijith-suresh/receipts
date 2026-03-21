<script lang="ts">
	import type { LogEntry } from '$lib/convex';
	import { formatEntryDateCompact, formatMonthLabel, formatRelativeEntryDate } from '$lib/utils/date';

	let {
		entryDate,
		gridDates,
		entries,
		selectedDate,
		timezone,
		weekdayLabels,
		onSelectDate,
	}: {
		entryDate: string;
		gridDates: Array<{ date: string; inMonth: boolean }>;
		entries: LogEntry[];
		selectedDate: string;
		timezone?: string;
		weekdayLabels: string[];
		onSelectDate?: (date: string) => void;
	} = $props();

	const entriesByDate = $derived(
		new Map(entries.map((entry) => [entry.entryDate, entry])),
	);
	const selectedEntry = $derived(entriesByDate.get(selectedDate) ?? null);

	const today = $derived(
		timezone 
			? new Date(new Date().toLocaleString('en-US', { timeZone: timezone })).toISOString().split('T')[0]
			: new Date().toISOString().split('T')[0]
	);
</script>

<section class="month-view">
	<div class="month-header">
		<h3>{formatMonthLabel(entryDate)}</h3>
	</div>

	<div class="weekday-row">
		{#each weekdayLabels as label}
			<span>{label}</span>
		{/each}
	</div>

	<div class="calendar-grid">
		{#each gridDates as item}
			{@const isToday = item.date === today}
			{@const hasEntry = entriesByDate.has(item.date)}
			{@const isSelected = item.date === selectedDate}
			<button
				type="button"
				class="calendar-day"
				class:selected={isSelected}
				class:today={isToday}
				class:muted={!item.inMonth}
				onclick={() => onSelectDate?.(item.date)}
				aria-label={hasEntry ? `${item.date} - Logged` : item.date}
				aria-pressed={isSelected}
			>
				<span class="calendar-day-number">{item.date.slice(-2).replace(/^0/, '')}</span>
				{#if hasEntry}
					<span class="entry-indicator" aria-hidden="true"></span>
				{/if}
			</button>
		{/each}
	</div>

	<div class="selected-panel">
		<div class="selected-header">
			<span class="selected-date">{formatRelativeEntryDate(selectedDate, timezone)}</span>
		</div>
		
		{#if selectedEntry}
			<div class="selected-entry">
				<p class="entry-summary">{selectedEntry.summary}</p>
				<p class="entry-body">{selectedEntry.rawInput}</p>
			</div>
		{:else}
			<div class="selected-empty">
				<p>No receipt for {formatEntryDateCompact(selectedDate)}</p>
				<a href="/dashboard" class="add-link">Add entry</a>
			</div>
		{/if}
	</div>
</section>

<style>
.month-view {
	padding: 1.25rem;
	border-radius: var(--radius-card);
	border: 1px solid var(--color-border);
	background: var(--color-surface);
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.month-header h3 {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.25rem;
	font-weight: 400;
	color: var(--color-ink);
}

.weekday-row {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 0.35rem;
	font-size: 0.75rem;
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-muted);
}

.weekday-row span {
	text-align: center;
	padding: 0.35rem 0;
}

.calendar-grid {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 0.35rem;
}

.calendar-day {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	min-height: 3.5rem;
	padding: 0.4rem;
	border-radius: var(--radius-sm);
	border: 1px solid transparent;
	background: transparent;
	cursor: pointer;
	transition:
		background-color 0.15s ease,
		border-color 0.15s ease;
}

.calendar-day:hover {
	background: var(--color-canvas);
}

.calendar-day.selected {
	background: var(--color-brand);
	border-color: var(--color-brand);
}

.calendar-day.selected .calendar-day-number {
	color: var(--color-surface);
}

.calendar-day.selected .entry-indicator {
	background: rgba(255, 255, 255, 0.9);
}

.calendar-day.today {
	border: 1px dashed var(--color-border);
}

.calendar-day.today:hover {
	border-color: var(--color-muted);
}

.calendar-day.muted {
	opacity: 0.4;
}

.calendar-day-number {
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--color-ink);
	line-height: 1.2;
}

.entry-indicator {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--color-brand);
	flex-shrink: 0;
}

.selected-panel {
	padding-top: 1rem;
	border-top: 1px solid var(--color-border);
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.selected-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.selected-date {
	font-family: var(--font-display);
	font-size: 1rem;
	color: var(--color-ink);
}

.selected-entry {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 0.875rem 1rem;
	border-radius: var(--radius-md);
	background: var(--color-canvas);
	border: 1px solid var(--color-border);
}

.entry-summary {
	margin: 0;
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--color-ink);
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	box-orient: vertical;
	overflow: hidden;
}

.entry-body {
	margin: 0;
	font-size: 0.875rem;
	color: var(--color-muted);
	line-height: 1.5;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	box-orient: vertical;
	overflow: hidden;
}

.selected-empty {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.875rem 1rem;
	border-radius: var(--radius-md);
	background: var(--color-canvas);
	border: 1px solid var(--color-border);
}

.selected-empty p {
	margin: 0;
	font-size: 0.875rem;
	color: var(--color-muted);
}

.add-link {
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--color-brand);
	text-decoration: none;
	padding: 0.35rem 0.75rem;
	border-radius: var(--radius-sm);
	background: var(--color-brand-soft);
	transition: background-color 0.15s ease;
}

.add-link:hover {
	background: var(--color-brand);
	color: var(--color-surface);
}
</style>
