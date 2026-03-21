<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { goto } from '$app/navigation';
	import { useClerkContext } from 'svelte-clerk';
	import type { LogEntry } from '$lib/convex';

	import { convexAuthReady } from '$lib/auth/convexAuth';
	import TodayCaptureForm from '$lib/components/TodayCaptureForm.svelte';
	import { api } from '$lib/convex';
	import { formatDateTime, formatEntryDate, formatRelativeEntryDate, getTodayLocalDate } from '$lib/utils/date';

	const clerk = useClerkContext();
	let activeDate = $state(getTodayLocalDate());
	let savedToast = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout> | null = null;
	const ready = $derived(clerk.isLoaded && !!clerk.auth.userId && $convexAuthReady);

	const todayEntry = useQuery(
		api.logEntries.getByDate,
		() => (ready ? { entryDate: activeDate } : 'skip'),
	);
	const recentEntries = useQuery(
		api.logEntries.listRecent,
		() => (ready ? { limit: 4 } : 'skip'),
	);

	const currentEntry = $derived((todayEntry.data as LogEntry | null | undefined) ?? null);
	const currentRecentEntries = $derived((recentEntries.data as LogEntry[] | undefined) ?? []);

	function handleSaved(entryDate: string) {
		activeDate = entryDate;
		savedToast = true;
		if (toastTimeout) {
			clearTimeout(toastTimeout);
		}
		toastTimeout = setTimeout(() => {
			savedToast = false;
		}, 2200);
	}

	function openHistory(date: string) {
		void goto(`/history?view=week&date=${date}`);
	}
</script>

<div class="today-page">
	<div class="utility-row">
		<div class="utility-copy">
			<p class="eyebrow">Today</p>
			<h1>{formatRelativeEntryDate(activeDate)}</h1>
			<p>{formatEntryDate(activeDate)}</p>
		</div>

		<div class="utility-actions">
			<span class="privacy-pill">Private</span>
			<a href="/history?view=week&date={activeDate}">Open history</a>
		</div>
	</div>

	<section class="capture-block">
		<div class="capture-copy">
			<h2>What moved forward today?</h2>
			<p>Write it the way you would say it. Keep the facts while they are still fresh.</p>
		</div>

		<TodayCaptureForm entryDate={activeDate} entry={currentEntry} onSaved={handleSaved} />

		<div class="status-row">
			{#if todayEntry.isLoading}
				<span>Loading this day…</span>
			{:else if todayEntry.error}
				<span class="error">{todayEntry.error.message}</span>
			{:else if savedToast && currentEntry}
				<span>Saved {formatDateTime(currentEntry.updatedAt)}</span>
			{:else if currentEntry}
				<span>Last updated {formatDateTime(currentEntry.updatedAt)}</span>
			{:else}
				<span>Your receipt stays private.</span>
			{/if}
		</div>

		{#if currentEntry}
			<div class="saved-snapshot">
				<p class="snapshot-label">Saved receipt</p>
				<p class="snapshot-summary">{currentEntry.summary}</p>
				<p class="snapshot-body">{currentEntry.rawInput}</p>
			</div>
		{/if}
	</section>

	<section class="recent-block">
		<div class="recent-header">
			<div>
				<p class="recent-label">Recent</p>
				<p class="recent-copy">A short way back into your past few receipts.</p>
			</div>
			<a href="/history?view=week&date={activeDate}">Browse all</a>
		</div>

		{#if recentEntries.isLoading}
			<p class="recent-copy">Loading recent receipts…</p>
		{:else if recentEntries.error}
			<p class="recent-copy error">{recentEntries.error.message}</p>
		{:else}
			<div class="recent-list">
				{#each currentRecentEntries as entry (entry._id)}
					<button type="button" class:selected={entry.entryDate === activeDate} class="recent-item" onclick={() => openHistory(entry.entryDate)}>
						<span class="recent-item-date">{formatRelativeEntryDate(entry.entryDate)}</span>
						<span class="recent-item-summary">{entry.summary}</span>
					</button>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
.today-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	max-width: 52rem;
}

.utility-row,
.capture-block,
.recent-block {
	border-radius: 1.4rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 94%, white 6%);
}

.utility-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
	padding: 1rem 1.15rem;
	flex-wrap: wrap;
}

.utility-copy p,
.utility-copy h1,
.capture-copy h2,
.capture-copy p,
.status-row,
.snapshot-label,
.snapshot-summary,
.snapshot-body,
.recent-label,
.recent-copy,
.recent-item-date,
.recent-item-summary {
	margin: 0;
}

.eyebrow,
.snapshot-label,
.recent-label {
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.utility-copy h1,
.capture-copy h2 {
	font-family: var(--font-display);
	font-weight: 400;
	color: var(--color-ink);
	line-height: 1.06;
}

.utility-copy h1 {
	font-size: 1.9rem;
	margin-top: 0.2rem;
}

.utility-copy p:last-child,
.capture-copy p,
.status-row,
.snapshot-body,
.recent-copy {
	color: var(--color-muted);
	line-height: 1.7;
}

.utility-actions {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex-wrap: wrap;
}

.utility-actions a,
.recent-header a {
	font-size: 0.84rem;
	font-weight: 600;
	color: var(--color-ink);
	text-decoration: none;
}

.utility-actions a:hover,
.recent-header a:hover {
	color: var(--color-brand-strong);
}

.privacy-pill {
	display: inline-flex;
	align-items: center;
	padding: 0.4rem 0.72rem;
	border-radius: 9999px;
	background: color-mix(in srgb, var(--color-brand-soft) 68%, white 32%);
	font-size: 0.78rem;
	font-weight: 700;
	color: var(--color-brand-strong);
}

.capture-block,
.recent-block {
	padding: 1.2rem;
}

.capture-copy {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	margin-bottom: 1rem;
}

.capture-copy h2 {
	font-size: 2.2rem;
	letter-spacing: -0.02em;
}

.status-row {
	padding: 0.85rem 0.1rem 0;
	font-size: 0.84rem;
}

.saved-snapshot {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
	padding-top: 1rem;
	margin-top: 1rem;
	border-top: 1px solid var(--color-border);
}

.snapshot-summary {
	font-size: 1.08rem;
	font-weight: 600;
	color: var(--color-ink);
	line-height: 1.45;
}

.snapshot-body {
	font-size: 0.95rem;
	line-height: 1.75;
	max-width: 44rem;
	display: -webkit-box;
	line-clamp: 3;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.recent-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
	margin-bottom: 1rem;
	flex-wrap: wrap;
}

.recent-list {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
}

.recent-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.9rem 0.95rem;
	border-radius: 1rem;
	border: 1px solid var(--color-border);
	background: var(--color-canvas);
	text-align: left;
	cursor: pointer;
	transition:
		border-color 0.15s ease,
		transform 0.15s ease,
		background-color 0.15s ease;
}

.recent-item:hover,
.recent-item.selected {
	transform: translateY(-1px);
	border-color: color-mix(in srgb, var(--color-brand) 35%, var(--color-border));
	background: color-mix(in srgb, var(--color-brand-soft) 60%, white 40%);
}

.recent-item-date {
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.recent-item-summary {
	font-size: 0.92rem;
	font-weight: 500;
	color: var(--color-ink);
	line-height: 1.55;
}

.error {
	color: #b91c1c;
}

@media (max-width: 720px) {
	.capture-copy h2 {
		font-size: 1.8rem;
	}

	.recent-item {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
