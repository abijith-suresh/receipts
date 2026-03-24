<script lang="ts">
import type { LogEntry } from '$lib/convex';
import { formatDateTime, formatEntryDate } from '$lib/utils/date';

const { entry, variant = 'default' } = $props<{ entry: LogEntry; variant?: 'default' | 'today' | 'history' }>();
</script>

<article class:history={variant === 'history'} class="entry-card">
	<div class="card-meta">
		<span class="card-date">{formatEntryDate(entry.entryDate)}</span>
		<span class="card-updated">Updated {formatDateTime(entry.updatedAt)}</span>
	</div>

	<h3 class="card-summary">{entry.summary}</h3>

	<p class="card-body">{entry.rawInput}</p>
</article>

<style>
.entry-card {
	padding: 1rem;
	border-radius: 0.875rem;
	border: 1px solid var(--color-border);
	background-color: var(--color-surface);
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.entry-card:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 24px -8px rgba(15, 23, 42, 0.12);
}

.card-meta {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.card-date {
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.card-updated {
	font-size: 0.75rem;
	color: var(--color-muted);
}

.card-summary {
	font-family: var(--font-display);
	font-size: 1.125rem;
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.35;
}

.card-body {
	font-size: 0.875rem;
	line-height: 1.75;
	color: var(--color-muted);
	margin: 0;
	white-space: pre-wrap;
}

.entry-card.history .card-body {
	line-clamp: 4;
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
