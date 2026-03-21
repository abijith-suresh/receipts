<script lang="ts">
	import type { LogEntry } from '$lib/convex';
	import { formatEntryDateCompact, formatRelativeEntryDate, formatWeekday } from '$lib/utils/date';

	import EntryCard from './EntryCard.svelte';

	let {
		weekDates,
		entries,
		selectedDate,
		onSelectDate,
	}: {
		weekDates: string[];
		entries: LogEntry[];
		selectedDate: string;
		onSelectDate?: (date: string) => void;
	} = $props();

	const entriesByDate = $derived(
		weekDates.map((date) => ({
			date,
			entries: entries.filter((entry) => entry.entryDate === date),
		})),
	);
</script>

<section class="history-view">
	<div class="week-strip">
		{#each weekDates as date}
			<button
				type="button"
				class:selected={date === selectedDate}
				class="day-pill"
				onclick={() => onSelectDate?.(date)}
			>
				<span class="day-pill-label">{formatWeekday(date)}</span>
				<span class="day-pill-date">{formatEntryDateCompact(date)}</span>
			</button>
		{/each}
	</div>

	<div class="day-columns">
		{#each entriesByDate as group}
			<section class="day-column">
				<div class="day-heading">
					<p class="day-title">{formatRelativeEntryDate(group.date)}</p>
					<p class="day-subtitle">{group.entries.length ? `${group.entries.length} receipt${group.entries.length === 1 ? '' : 's'}` : 'No receipt logged'}</p>
				</div>

				{#if group.entries.length}
					<div class="day-stack">
						{#each group.entries as entry (entry._id)}
							<EntryCard {entry} variant="history" />
						{/each}
					</div>
				{:else}
					<div class="empty-day">Quiet day. Nothing saved here yet.</div>
				{/if}
			</section>
		{/each}
	</div>
</section>

<style>
.history-view {
	display: flex;
	flex-direction: column;
	gap: 1.4rem;
}

.week-strip {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 0.6rem;
}

.day-pill {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.2rem;
	padding: 0.8rem 0.9rem;
	border-radius: 1rem;
	border: 1px solid var(--color-border);
	background: var(--color-surface);
	text-align: left;
	cursor: pointer;
	transition:
		border-color 0.15s ease,
		transform 0.15s ease,
		background-color 0.15s ease;
}

.day-pill:hover,
.day-pill.selected {
	border-color: color-mix(in srgb, var(--color-brand) 35%, var(--color-border));
	background: color-mix(in srgb, var(--color-brand-soft) 65%, white 35%);
	transform: translateY(-1px);
}

.day-pill-label {
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--color-muted);
}

.day-pill-date {
	font-size: 0.92rem;
	font-weight: 600;
	color: var(--color-ink);
}

.day-columns {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.day-column {
	display: flex;
	flex-direction: column;
	gap: 0.9rem;
	padding: 1.1rem;
	border-radius: 1.2rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 90%, white 10%);
}

.day-heading {
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
}

.day-title,
.day-subtitle {
	margin: 0;
}

.day-title {
	font-size: 1rem;
	font-weight: 600;
	color: var(--color-ink);
}

.day-subtitle,
.empty-day {
	font-size: 0.85rem;
	color: var(--color-muted);
	line-height: 1.6;
}

.day-stack {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
}

@media (max-width: 900px) {
	.week-strip {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.day-columns {
		grid-template-columns: 1fr;
	}
}
</style>
