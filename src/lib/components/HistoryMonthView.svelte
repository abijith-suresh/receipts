<script lang="ts">
	import type { LogEntry } from '$lib/convex';
	import { formatEntryDateCompact, formatMonthLabel, formatRelativeEntryDate } from '$lib/utils/date';

	let {
		entryDate,
		gridDates,
		entries,
		selectedDate,
		onSelectDate,
	}: {
		entryDate: string;
		gridDates: Array<{ date: string; inMonth: boolean }>;
		entries: LogEntry[];
		selectedDate: string;
		onSelectDate?: (date: string) => void;
	} = $props();

	const entriesByDate = $derived(
		new Map(entries.map((entry) => [entry.entryDate, entry])),
	);
	const selectedEntry = $derived(entriesByDate.get(selectedDate) ?? null);
</script>

<section class="month-view">
	<div class="calendar-panel">
		<div class="month-heading">
			<h3>{formatMonthLabel(entryDate)}</h3>
			<p>See your logging rhythm without falling into an endless feed.</p>
		</div>

		<div class="weekday-row">
			{#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as label}
				<span>{label}</span>
			{/each}
		</div>

		<div class="calendar-grid">
			{#each gridDates as item}
				<button
					type="button"
					class="calendar-day"
					class:selected={item.date === selectedDate}
					class:muted={!item.inMonth}
					onclick={() => onSelectDate?.(item.date)}
				>
					<span class="calendar-day-number">{item.date.slice(-2).replace(/^0/, '')}</span>
					{#if entriesByDate.has(item.date)}
						<span class="calendar-day-indicator">Logged</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div class="selected-panel">
		<p class="selected-label">Selected day</p>
		<h3>{formatRelativeEntryDate(selectedDate)}</h3>

		{#if selectedEntry}
			<div class="selected-entry">
				<p class="selected-summary">{selectedEntry.summary}</p>
				<p class="selected-body">{selectedEntry.rawInput}</p>
			</div>
		{:else}
			<div class="selected-empty">
				<p>No receipt saved for {formatEntryDateCompact(selectedDate)}.</p>
				<p>Use Today to backfill when you need it.</p>
			</div>
		{/if}
	</div>
</section>

<style>
.month-view {
	display: grid;
	grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
	gap: 1rem;
}

.calendar-panel,
.selected-panel {
	padding: 1.2rem;
	border-radius: 1.2rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 92%, white 8%);
}

.month-heading h3,
.selected-panel h3 {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.65rem;
	font-weight: 400;
	color: var(--color-ink);
}

.month-heading p,
.selected-label,
.selected-empty p,
.selected-body {
	margin: 0;
	color: var(--color-muted);
	line-height: 1.65;
}

.month-heading {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	margin-bottom: 1rem;
}

.weekday-row,
.calendar-grid {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 0.5rem;
}

.weekday-row {
	margin-bottom: 0.5rem;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--color-muted);
}

.calendar-day {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	min-height: 5.5rem;
	padding: 0.7rem;
	border-radius: 0.95rem;
	border: 1px solid var(--color-border);
	background: var(--color-canvas);
	cursor: pointer;
	transition:
		border-color 0.15s ease,
		transform 0.15s ease,
		background-color 0.15s ease;
}

.calendar-day:hover,
.calendar-day.selected {
	transform: translateY(-1px);
	border-color: color-mix(in srgb, var(--color-brand) 38%, var(--color-border));
	background: color-mix(in srgb, var(--color-brand-soft) 52%, white 48%);
}

.calendar-day.muted {
	opacity: 0.55;
}

.calendar-day-number {
	font-size: 0.92rem;
	font-weight: 600;
	color: var(--color-ink);
}

.calendar-day-indicator {
	font-size: 0.7rem;
	font-weight: 600;
	color: var(--color-brand-strong);
}

.selected-panel {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.selected-label {
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.16em;
	text-transform: uppercase;
}

.selected-summary {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	color: var(--color-ink);
	line-height: 1.5;
}

.selected-entry,
.selected-empty {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
	padding: 1rem;
	border-radius: 1rem;
	background: var(--color-canvas);
	border: 1px solid var(--color-border);
}

@media (max-width: 980px) {
	.month-view {
		grid-template-columns: 1fr;
	}
}
</style>
