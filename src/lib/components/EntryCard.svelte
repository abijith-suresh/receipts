<script lang="ts">
import type { LogEntry } from '$lib/convex';
import { formatDateTime, formatEntryDate } from '$lib/utils/date';

const { entry, variant = 'default' } = $props<{ entry: LogEntry; variant?: 'default' | 'today' | 'history' }>();
</script>

<article class:today={variant === 'today'} class:history={variant === 'history'} class="entry-card">
	<div class="card-meta">
		<div class="card-meta-copy">
			<span class="card-date">{formatEntryDate(entry.entryDate)}</span>
			<span class="card-updated">Updated {formatDateTime(entry.updatedAt)}</span>
		</div>
		<span class="card-badge">Private</span>
	</div>

	<h3 class="card-summary">{entry.summary}</h3>

	<p class="card-body">{entry.rawInput}</p>
</article>

<style>
.entry-card {
	padding: 1.5rem;
	border-radius: 1rem;
	border: 1px solid var(--color-border);
	background-color: var(--color-surface);
	display: flex;
	flex-direction: column;
	gap: 0.875rem;
	transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.entry-card.today {
	padding: 1.7rem;
	border-radius: 1.25rem;
	background: color-mix(in srgb, var(--color-surface) 88%, white 12%);
	box-shadow: 0 24px 50px -38px rgba(15, 23, 42, 0.18);
}

.entry-card.history {
	padding: 1.1rem 1.15rem;
	border-radius: 1rem;
	background: var(--color-canvas);
	box-shadow: none;
}

.entry-card:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 24px -8px rgba(15, 23, 42, 0.12);
}

.card-meta {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 0.75rem;
}

.card-meta-copy {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.card-date {
	font-size: 0.6875rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.card-updated {
	font-size: 0.78rem;
	color: var(--color-muted);
}

.card-badge {
	font-size: 0.6875rem;
	font-weight: 600;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: var(--color-muted);
	padding: 0.1875rem 0.5rem;
	border-radius: 9999px;
	border: 1px solid var(--color-border);
}

.card-summary {
	font-family: var(--font-display);
	font-size: 1.375rem;
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.35;
}

.entry-card.history .card-summary {
	font-size: 1.08rem;
	line-height: 1.4;
}

.card-body {
	font-size: 0.9375rem;
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
	line-height: 1.7;
}
</style>
