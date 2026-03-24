<script lang="ts">
	import type { LogEntry } from '$lib/convex';
	import { getDaySummaryBody } from '$lib/today';
	import { formatEntryDateCompact } from '$lib/utils/date';

	let {
		entries,
		timezone,
	}: {
		entries: LogEntry[];
		timezone?: string;
	} = $props();

	const groupedByMonth = $derived(
		(() => {
			const groups = new Map<string, { label: string; entries: LogEntry[] }>();
			for (const entry of entries) {
				const monthKey = entry.entryDate.slice(0, 7); // 'YYYY-MM'
				if (!groups.has(monthKey)) {
					const [year, month] = monthKey.split('-');
					const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-US', {
						month: 'long',
						year: 'numeric',
					});
					groups.set(monthKey, { label, entries: [] });
				}
				groups.get(monthKey)!.entries.push(entry);
			}
			return [...groups.values()];
		})()
	);
</script>

<section class="timeline-view">
	{#if entries.length === 0}
		<div class="empty-state">
			<p class="empty-message">No receipts yet.</p>
			<a href="/dashboard" class="empty-link">Start with Today</a>
		</div>
	{:else}
		{#each groupedByMonth as group}
			<div class="month-group">
				<div class="month-header">
					<h3 class="month-label">{group.label}</h3>
					<div class="month-divider" aria-hidden="true"></div>
				</div>
				<div class="entry-list">
					{#each group.entries as entry (entry._id)}
						<article class="entry-card">
							<div class="entry-meta">
								<span class="entry-date">{formatEntryDateCompact(entry.entryDate)}</span>
							</div>
							<div class="entry-content">
								<p class="entry-summary">{entry.summary}</p>
								{#if entry.tags?.length}
									<div class="entry-tags">
										{#each entry.tags as tag}
											<span class="entry-tag">{tag}</span>
										{/each}
									</div>
								{/if}
								{#if getDaySummaryBody(entry)}
									<p class="entry-body">{getDaySummaryBody(entry)}</p>
								{/if}
							</div>
						</article>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</section>

<style>
.timeline-view {
	display: flex;
	flex-direction: column;
	gap: 3rem;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 3rem 2rem;
	border: 2px dashed var(--color-border);
	border-radius: var(--radius-card);
	text-align: center;
}

.empty-message {
	margin: 0;
	font-size: 1rem;
	color: var(--color-muted);
}

.empty-link {
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--color-brand);
	text-decoration: none;
	padding: 0.4rem 0.875rem;
	border-radius: 9999px;
	background: var(--color-brand-soft);
	transition: background-color 0.15s ease, color 0.15s ease;
}

.empty-link:hover {
	background: var(--color-brand);
	color: var(--color-surface);
}

.month-group {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.month-header {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.month-label {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.5rem;
	font-weight: 400;
	color: var(--color-muted);
	white-space: nowrap;
	flex-shrink: 0;
}

.month-divider {
	flex: 1;
	height: 1px;
	background: var(--color-border);
}

.entry-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.entry-card {
	display: flex;
	gap: 1rem;
	padding: 1rem 1.25rem;
	border-radius: var(--radius-card);
	border: 1px solid var(--color-border);
	background: var(--color-surface);
	transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
	cursor: default;
}

.entry-card:hover {
	transform: translateY(-1px);
	border-color: var(--color-brand-soft);
	box-shadow: var(--shadow-sm);
}

.entry-meta {
	flex-shrink: 0;
	padding-top: 0.1rem;
}

.entry-date {
	display: inline-block;
	font-size: var(--font-size-eyebrow);
	font-weight: 700;
	letter-spacing: var(--letter-spacing-eyebrow);
	text-transform: uppercase;
	color: var(--color-surface);
	background: var(--color-brand);
	padding: 0.2rem 0.5rem;
	border-radius: 0.35rem;
	white-space: nowrap;
}

.entry-content {
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	min-width: 0;
}

.entry-summary {
	margin: 0;
	font-size: 1rem;
	font-weight: 500;
	color: var(--color-ink);
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	line-clamp: 1;
	-webkit-box-orient: vertical;
	box-orient: vertical;
	overflow: hidden;
}

.entry-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem;
}

.entry-tag {
	display: inline-flex;
	align-items: center;
	padding: 0.2rem 0.48rem;
	border-radius: 9999px;
	background: color-mix(in srgb, var(--color-brand-soft) 84%, white);
	font-size: 0.72rem;
	font-weight: 600;
	color: var(--color-brand-strong);
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
</style>
