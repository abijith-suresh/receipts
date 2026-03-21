<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { goto } from '$app/navigation';
	import { useClerkContext } from 'svelte-clerk';
	import type { LogEntry } from '$lib/convex';

	import { convexAuthReady } from '$lib/auth/convexAuth';
	import TodayCaptureForm from '$lib/components/TodayCaptureForm.svelte';
	import { api } from '$lib/convex';
	import { getHistoryHref, getHistoryPreferences } from '$lib/history/preferences';
	import { formatDateTime, formatEntryDate, formatRelativeEntryDate, getTodayLocalDate } from '$lib/utils/date';

	const clerk = useClerkContext();
	let activeDate = $state<string | null>(null);
	let savedToast = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout> | null = null;
	const ready = $derived(clerk.isLoaded && !!clerk.auth.userId && $convexAuthReady);
	const settings = useQuery(api.users.settings, () => (ready ? {} : 'skip'));
	const preferredTimezone = $derived(settings.data?.timezone);
	const resolvedActiveDate = $derived(
		activeDate ?? getTodayLocalDate(preferredTimezone),
	);

	const todayEntry = useQuery(
		api.logEntries.getByDate,
		() => (ready ? { entryDate: resolvedActiveDate } : 'skip'),
	);
	const recentEntries = useQuery(
		api.logEntries.listRecent,
		() => (ready ? { limit: 4 } : 'skip'),
	);

	const currentEntry = $derived((todayEntry.data as LogEntry | null | undefined) ?? null);
	const currentRecentEntries = $derived((recentEntries.data as LogEntry[] | undefined) ?? []);
	const historyPreferences = $derived(
		getHistoryPreferences({
			weekStartsOn: settings.data?.weekStartsOn,
			defaultHistoryView: settings.data?.defaultHistoryView,
		}),
	);

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
		void goto(getHistoryHref(date, historyPreferences));
	}
</script>

<div class="today-page">
	<!-- Compact Header Row -->
	<header class="header-row">
		<div class="header-left">
			<h1 class="text-2xl">{formatRelativeEntryDate(resolvedActiveDate, preferredTimezone)}</h1>
		</div>
		<div class="header-right">
			<p class="text-sm text-muted">{formatEntryDate(resolvedActiveDate)}</p>
			<a href={getHistoryHref(resolvedActiveDate, historyPreferences)} class="text-sm link">Open history</a>
		</div>
	</header>

	<!-- Two-Column Layout -->
	<div class="content-grid">
		<!-- Left Column: Capture Form -->
		<div class="column-left">
			<div class="card capture-card">
				<div class="card-header">
					<h2 class="text-xl">What moved forward today?</h2>
					<p class="text-sm text-muted">Write it the way you would say it. Keep the facts while they are still fresh.</p>
				</div>

				<TodayCaptureForm entryDate={resolvedActiveDate} entry={currentEntry} onSaved={handleSaved} />

				<div class="status-bar">
					{#if todayEntry.isLoading}
						<span class="text-xs text-muted">Loading this day…</span>
					{:else if todayEntry.error}
						<span class="text-xs error">{todayEntry.error.message}</span>
					{:else if savedToast && currentEntry}
						<span class="text-xs text-muted">Saved {formatDateTime(currentEntry.updatedAt)}</span>
					{:else if currentEntry}
						<span class="text-xs text-muted">Last updated {formatDateTime(currentEntry.updatedAt)}</span>
					{:else}
						<span class="text-xs text-muted">Your receipt stays private.</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Right Column: Recent + Preview -->
		<div class="column-right">
			<!-- Recent Entries -->
			<div class="card recent-card">
				<div class="card-header compact">
					<h3 class="text-lg">Recent</h3>
					<a href={getHistoryHref(resolvedActiveDate, historyPreferences)} class="text-sm link">Browse all</a>
				</div>

				{#if recentEntries.isLoading}
					<p class="text-sm text-muted">Loading recent receipts…</p>
				{:else if recentEntries.error}
					<p class="text-sm error">{recentEntries.error.message}</p>
				{:else}
					<div class="recent-list">
						{#each currentRecentEntries as entry (entry._id)}
							<button type="button" class="recent-item" class:selected={entry.entryDate === resolvedActiveDate} onclick={() => openHistory(entry.entryDate)}>
								<span class="recent-date text-xs">{formatRelativeEntryDate(entry.entryDate, preferredTimezone)}</span>
								<span class="recent-summary text-sm">{entry.summary}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Saved Preview -->
			{#if currentEntry}
				<div class="card preview-card">
					<p class="text-xs label-upper">Saved receipt</p>
					<p class="text-base font-medium">{currentEntry.summary}</p>
					<p class="text-sm text-muted preview-body">{currentEntry.rawInput}</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
.today-page {
	--color-ink: #18181b;
	--color-muted: #71717a;
	--color-surface: #ffffff;
	--color-canvas: #fafaf8;
	--color-border: #e4e4e7;
	--color-brand: #0d9488;
	--color-brand-strong: #0f766e;
	--font-display: "Instrument Serif";
	--font-body: "DM Sans";
}

/* Typography Utilities */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }

.text-muted { color: var(--color-muted); }
.error { color: #b91c1c; }
.font-medium { font-weight: 600; }
.link { color: var(--color-ink); text-decoration: none; }
.link:hover { color: var(--color-brand-strong); }

.label-upper {
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

/* Layout */
.today-page {
	max-width: 64rem;
	padding: 0;
}

/* Compact Header */
.header-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem 1rem;
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: 1rem;
	max-height: 3rem;
}

.header-left h1 {
	font-family: var(--font-display);
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.2;
}

.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

/* Content Grid */
.content-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
	margin-top: 1rem;
}

@media (min-width: 900px) {
	.content-grid {
		grid-template-columns: 60% 1fr;
	}
}

/* Card Base Styles */
.card {
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: 1rem;
	padding: 1.25rem;
}

.card-header {
	margin-bottom: 1rem;
}

.card-header.compact {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	margin-bottom: 0.75rem;
}

.card-header h2,
.card-header h3 {
	font-family: var(--font-display);
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
}

.card-header p {
	margin: 0.25rem 0 0;
	line-height: 1.6;
}

/* Capture Card */
.capture-card {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.status-bar {
	padding-top: 0.5rem;
	border-top: 1px solid var(--color-border);
}

/* Recent Card */
.recent-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.recent-item {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 0.75rem 1rem;
	background: var(--color-canvas);
	border: 1px solid var(--color-border);
	border-radius: 0.75rem;
	text-align: left;
	cursor: pointer;
	transition: all 0.15s ease;
}

.recent-item:hover,
.recent-item.selected {
	border-color: var(--color-brand);
	background: rgba(13, 148, 136, 0.08);
	transform: translateY(-1px);
}

.recent-date {
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.recent-summary {
	color: var(--color-ink);
	font-weight: 500;
	line-height: 1.5;
	display: -webkit-box;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* Preview Card */
.preview-card {
	margin-top: 1rem;
}

.preview-card p {
	margin: 0;
}

.preview-card .text-base {
	margin: 0.5rem 0;
	line-height: 1.5;
}

.preview-body {
	line-height: 1.7;
	display: -webkit-box;
	line-clamp: 4;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* Right Column Layout */
.column-right {
	display: flex;
	flex-direction: column;
}

/* Mobile Adjustments */
@media (max-width: 899px) {
	.header-row {
		flex-wrap: wrap;
		height: auto;
		max-height: none;
		padding: 0.75rem;
	}

	.recent-item {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.recent-summary {
		line-clamp: 1;
		-webkit-line-clamp: 1;
	}
}
</style>
