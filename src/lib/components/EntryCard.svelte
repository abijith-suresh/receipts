<script lang="ts">
import type { LogEntry } from '$lib/convex';
import { formatEntryDate } from '$lib/utils/date';

const { entry } = $props<{ entry: LogEntry }>();
</script>

<article class="entry-card">
	<div class="card-meta">
		<span class="card-date">{formatEntryDate(entry.entryDate)}</span>
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

.entry-card:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 24px -8px rgba(15, 23, 42, 0.12);
}

.card-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
}

.card-date {
	font-size: 0.6875rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
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

.card-body {
	font-size: 0.9375rem;
	line-height: 1.75;
	color: var(--color-muted);
	margin: 0;
	white-space: pre-wrap;
}
</style>
