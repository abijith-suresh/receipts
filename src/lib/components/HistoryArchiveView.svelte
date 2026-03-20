<script lang="ts">
	import type { LogEntry } from '$lib/convex';
	import { formatDateTime, formatMonthKey } from '$lib/utils/date';

	let {
		months,
		entries,
		activeMonth,
		onSelectMonth,
	}: {
		months: Array<{ month: string; count: number; latestEntryDate: string }>;
		entries: LogEntry[];
		activeMonth: string;
		onSelectMonth?: (month: string) => void;
	} = $props();
</script>

<section class="archive-view">
	<div class="archive-rail">
		{#each months as month}
			<button
				type="button"
				class="archive-month"
				class:selected={month.month === activeMonth}
				onclick={() => onSelectMonth?.(month.month)}
			>
				<span class="archive-month-label">{formatMonthKey(month.month)}</span>
				<span class="archive-month-meta">{month.count} receipt{month.count === 1 ? '' : 's'}</span>
			</button>
		{/each}
	</div>

	<div class="archive-list">
		{#if entries.length}
			{#each entries as entry (entry._id)}
				<article class="archive-row">
					<div>
						<p class="archive-row-date">{entry.entryDate}</p>
						<h3 class="archive-row-title">{entry.summary}</h3>
					</div>
					<p class="archive-row-meta">Updated {formatDateTime(entry.updatedAt)}</p>
				</article>
			{/each}
		{:else}
			<div class="archive-empty">No receipts found for this month.</div>
		{/if}
	</div>
</section>

<style>
.archive-view {
	display: grid;
	grid-template-columns: minmax(14rem, 16rem) minmax(0, 1fr);
	gap: 1rem;
}

.archive-rail,
.archive-list {
	padding: 1rem;
	border-radius: 1.2rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 92%, white 8%);
}

.archive-rail {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.archive-month {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.15rem;
	padding: 0.85rem 0.9rem;
	border-radius: 0.95rem;
	border: 1px solid transparent;
	background: transparent;
	cursor: pointer;
	transition:
		background-color 0.15s ease,
		border-color 0.15s ease;
}

.archive-month:hover,
.archive-month.selected {
	background: var(--color-canvas);
	border-color: color-mix(in srgb, var(--color-brand) 35%, var(--color-border));
}

.archive-month-label {
	font-size: 0.92rem;
	font-weight: 600;
	color: var(--color-ink);
}

.archive-month-meta,
.archive-row-meta,
.archive-empty,
.archive-row-date {
	font-size: 0.82rem;
	color: var(--color-muted);
}

.archive-list {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
}

.archive-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.9rem 1rem;
	border-radius: 1rem;
	border: 1px solid var(--color-border);
	background: var(--color-canvas);
}

.archive-row-title,
.archive-row-date {
	margin: 0;
}

.archive-row-title {
	margin-top: 0.25rem;
	font-size: 0.98rem;
	font-weight: 600;
	color: var(--color-ink);
	line-height: 1.45;
}

@media (max-width: 980px) {
	.archive-view {
		grid-template-columns: 1fr;
	}
}
</style>
