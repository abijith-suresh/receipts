<script lang="ts">
	import type { LogEntry } from '$lib/convex';
	import {
		formatEntryDateCompact,
		formatWeekday,
		getTodayLocalDate,
	} from '$lib/utils/date';
	import { fade } from 'svelte/transition';

	import EntryCard from './EntryCard.svelte';

	let {
		weekDates,
		entries,
		selectedDate,
		timezone,
		onSelectDate,
	}: {
		weekDates: string[];
		entries: LogEntry[];
		selectedDate: string;
		timezone?: string;
		onSelectDate?: (date: string) => void;
	} = $props();

	const today = $derived(getTodayLocalDate(timezone));
	const entriesByDate = $derived.by(() => {
		const map = new Map<string, LogEntry[]>();

		for (const date of weekDates) {
			map.set(date, []);
		}

		for (const entry of entries) {
			map.set(entry.entryDate, [...(map.get(entry.entryDate) ?? []), entry]);
		}

		return map;
	});

	function getEntriesForDate(date: string) {
		return entriesByDate.get(date) ?? [];
	}

	function getSelectedDateDisplay(date: string): string {
		const dateObj = new Date(date + 'T00:00:00');
		const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
		const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
		const day = dateObj.getDate();
		return `${weekday}, ${month} ${day}`;
	}

	const selectedEntries = $derived(entriesByDate.get(selectedDate) ?? []);
</script>

<section class="history-container">
	<!-- Horizontal Week Strip -->
	<div class="week-strip" role="tablist" aria-label="Select a day from this week">
		{#each weekDates as date}
			<button
				type="button"
				role="tab"
				aria-selected={date === selectedDate}
				class:selected={date === selectedDate}
				class:today={date === today}
				class="day-pill"
				onclick={() => onSelectDate?.(date)}
			>
				<span class="day-name">{formatWeekday(date)}</span>
				<span class="day-date">{formatEntryDateCompact(date)}</span>
				<span class="day-count">
					{#if getEntriesForDate(date).length}
						{getEntriesForDate(date).length} receipt{getEntriesForDate(date).length === 1 ? '' : 's'}
					{:else}
						No receipt
					{/if}
				</span>
			</button>
		{/each}
	</div>

	<!-- Selected Day Content -->
	{#key selectedDate}
		<div class="selected-content" in:fade={{ duration: 180 }}>
			<header class="selected-header">
				<h2 class="selected-title">Selected: {getSelectedDateDisplay(selectedDate)}</h2>
			</header>

			{#if selectedEntries.length}
				<div class="entries-list">
					{#each selectedEntries as entry (entry._id)}
						<EntryCard {entry} variant="history" />
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<p>No receipt saved for this day yet.</p>
					<p class="empty-hint">Keep the date selected as an anchor for backfilling when you need the record later.</p>
				</div>
			{/if}
		</div>
	{/key}
</section>

<style>
	.history-container {
		background: var(--color-surface);
		border-radius: var(--radius-card);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Horizontal Week Strip */
	.week-strip {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding: 0.5rem 0.25rem 0.25rem;
		margin: -0.5rem -0.25rem -0.25rem;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}

	.week-strip::-webkit-scrollbar {
		height: 4px;
	}

	.week-strip::-webkit-scrollbar-track {
		background: transparent;
	}

	.week-strip::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 2px;
	}

	.day-pill {
		flex: 0 0 auto;
		min-width: 8rem;
		scroll-snap-align: start;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		padding: 0.875rem 1.125rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		background: var(--color-canvas);
		text-align: left;
		cursor: pointer;
		transition: all 0.15s ease;
		overflow: visible;
	}

	.day-pill:hover {
		border-color: color-mix(in srgb, var(--color-brand) 35%, var(--color-border));
		transform: translateY(-1px);
	}

	.day-pill.selected {
		background: var(--color-brand);
		border-color: var(--color-brand);
	}

	.day-pill.selected .day-name,
	.day-pill.selected .day-date,
	.day-pill.selected .day-count {
		color: var(--color-surface);
	}

	.day-pill.today {
		border-style: dashed;
		border-color: var(--color-brand);
	}

	.day-pill.selected.today {
		border-style: solid;
	}

	.day-name {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-muted);
		font-family: var(--font-body);
		line-height: 1.4;
	}

	.day-date {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-ink);
		font-family: var(--font-body);
		line-height: 1.3;
	}

	.day-count {
		font-size: 0.75rem;
		color: var(--color-muted);
		font-family: var(--font-body);
		line-height: 1.4;
	}

	/* Selected Day Content */
	.selected-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.selected-header {
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.selected-title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 400;
		color: var(--color-ink);
		margin: 0;
		line-height: 1.4;
		overflow-wrap: break-word;
	}

	/* Entries List - max 3 visible */
	.entries-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-height: calc(3 * 5rem + 2 * 0.5rem + 0.5rem); /* Approximate 3 cards + gaps + padding */
		overflow-y: auto;
		padding: 0.25rem;
		margin: -0.25rem;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}

	.entries-list::-webkit-scrollbar {
		width: 4px;
	}

	.entries-list::-webkit-scrollbar-track {
		background: transparent;
	}

	.entries-list::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 2px;
	}

	/* Empty State */
	.empty-state {
		padding: 1.5rem;
		text-align: center;
		border-radius: var(--radius-md);
		border: 1px dashed var(--color-border);
		background: var(--color-canvas);
	}

	.empty-state p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-muted);
		font-family: var(--font-body);
		line-height: 1.5;
	}

	.empty-state .empty-hint {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		opacity: 0.8;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.history-container {
			padding: 1rem;
			gap: 0.875rem;
		}

		.day-pill {
			min-width: 7rem;
			padding: 0.625rem 0.875rem;
		}

		.selected-title {
			font-size: 1.125rem;
		}
	}
</style>
