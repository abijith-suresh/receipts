<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { goto } from '$app/navigation';
	import { useClerkContext } from 'svelte-clerk';
    import type { LogEntry } from '$lib/convex';

	import { convexAuthReady } from '$lib/auth/convexAuth';
	import EntryCard from '$lib/components/EntryCard.svelte';
	import TodayCaptureForm from '$lib/components/TodayCaptureForm.svelte';
	import { api } from '$lib/convex';
	import { formatEntryDate, formatRelativeEntryDate, getTodayLocalDate } from '$lib/utils/date';

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
		() => (ready ? { limit: 6 } : 'skip'),
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
		void goto(`/history?view=week&date=${date}`);
	}

	const currentEntry = $derived((todayEntry.data as LogEntry | null | undefined) ?? null);
	const currentRecentEntries = $derived((recentEntries.data as LogEntry[] | undefined) ?? []);
</script>

<div class="today-page">
	<div class="hero">
		<div class="hero-copy">
			<p class="eyebrow">Today</p>
			<h1 class="title">Capture what moved forward before the details disappear.</h1>
			<p class="desc">
				This is your private work log, not a dashboard full of widgets. Save the rough version now and return later when you need the proof.
			</p>
		</div>

		<div class="hero-rail">
			<div class="date-card">
				<p class="date-label">Active day</p>
				<p class="date-value">{formatRelativeEntryDate(activeDate)}</p>
				<p class="date-meta">{formatEntryDate(activeDate)}</p>
			</div>

			<div class="date-card muted">
				<p class="date-label">Future-ready</p>
				<p class="date-value small">Text today, voice later</p>
				<p class="date-meta">This composer is designed so voice input can land here without changing the flow.</p>
			</div>
		</div>
	</div>

	{#if savedToast}
		<div class="toast">Receipt saved for {formatRelativeEntryDate(activeDate)}.</div>
	{/if}

	<div class="workspace-grid">
		<section class="composer-panel">
			<TodayCaptureForm entryDate={activeDate} entry={todayEntry.data} onSaved={handleSaved} />
		</section>

		<section class="context-panel">
			<div class="panel-card">
				<p class="panel-label">For this day</p>
				{#if todayEntry.isLoading}
					<p class="panel-copy">Loading your receipt…</p>
				{:else if todayEntry.error}
					<p class="panel-copy error">{todayEntry.error.message}</p>
				{:else if currentEntry}
					<EntryCard entry={currentEntry} variant="today" />
				{:else}
					<div class="empty-card">
						<p class="empty-title">No receipt saved for this day yet.</p>
						<p class="panel-copy">Start with the rough version now. You can refine and browse it from History later.</p>
					</div>
				{/if}
			</div>

			<div class="panel-card">
				<div class="panel-header-row">
					<div>
						<p class="panel-label">Recent receipts</p>
						<p class="panel-copy">A small view back, not the whole archive.</p>
					</div>
					<a class="panel-link" href="/history?view=week&date={activeDate}">Open history</a>
				</div>

				{#if recentEntries.isLoading}
					<p class="panel-copy">Loading recent days…</p>
				{:else if recentEntries.error}
					<p class="panel-copy error">{recentEntries.error.message}</p>
				{:else}
					<div class="recent-list">
						{#each currentRecentEntries as entry (entry._id)}
							<div class:selected={entry.entryDate === activeDate} class="recent-item">
								<button type="button" class="recent-item-main" onclick={() => (activeDate = entry.entryDate)}>
									<div>
										<p class="recent-item-date">{formatRelativeEntryDate(entry.entryDate)}</p>
										<p class="recent-item-summary">{entry.summary}</p>
									</div>
								</button>
								<button type="button" class="recent-item-link" onclick={() => openHistory(entry.entryDate)}>Week view</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>

<style>
.today-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.hero {
	display: grid;
	grid-template-columns: minmax(0, 1.4fr) minmax(17rem, 0.85fr);
	gap: 1rem;
	align-items: end;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid var(--color-border);
}

.eyebrow {
	margin: 0 0 0.45rem;
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.title {
	margin: 0;
	max-width: 50rem;
	font-family: var(--font-display);
	font-size: clamp(2.2rem, 4vw, 3.7rem);
	font-weight: 400;
	line-height: 1.03;
	letter-spacing: -0.03em;
	color: var(--color-ink);
}

.desc,
.panel-copy,
.date-meta,
.recent-item-summary {
	margin: 0;
	color: var(--color-muted);
	line-height: 1.75;
}

.desc {
	margin-top: 0.9rem;
	max-width: 44rem;
	font-size: 0.98rem;
}

.hero-rail,
.context-panel {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.date-card,
.panel-card,
.toast {
	padding: 1.1rem 1.15rem;
	border-radius: 1.2rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 92%, white 8%);
}

.date-card.muted {
	background: color-mix(in srgb, var(--color-canvas) 90%, white 10%);
}

.date-label,
.panel-label,
.recent-item-date {
	margin: 0;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.date-value {
	margin: 0.35rem 0 0.2rem;
	font-family: var(--font-display);
	font-size: 1.9rem;
	font-weight: 400;
	line-height: 1.05;
	color: var(--color-ink);
}

.date-value.small {
	font-size: 1.25rem;
	line-height: 1.2;
}

.toast {
	padding: 0.85rem 1rem;
	font-size: 0.9rem;
	color: var(--color-brand-strong);
	background: color-mix(in srgb, var(--color-brand-soft) 65%, white 35%);
}

.workspace-grid {
	display: grid;
	grid-template-columns: minmax(0, 1.35fr) minmax(20rem, 0.95fr);
	gap: 1rem;
	align-items: start;
}

.composer-panel {
	min-width: 0;
}

.panel-card {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
}

.panel-header-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
}

.panel-link,
.recent-item-link {
	font-size: 0.82rem;
	font-weight: 600;
	color: var(--color-ink);
	text-decoration: none;
	border: none;
	background: transparent;
	cursor: pointer;
}

.panel-link:hover,
.recent-item-link:hover {
	color: var(--color-brand-strong);
}

.empty-card {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
	padding: 1rem;
	border-radius: 1rem;
	background: var(--color-canvas);
	border: 1px dashed var(--color-border);
}

.empty-title {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
	color: var(--color-ink);
}

.recent-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.recent-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.85rem 0.95rem;
	border-radius: 1rem;
	border: 1px solid var(--color-border);
	background: var(--color-canvas);
	text-align: left;
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

.recent-item-main {
	flex: 1;
	display: block;
	border: none;
	background: transparent;
	padding: 0;
	text-align: left;
	cursor: pointer;
}

.recent-item-summary {
	margin-top: 0.25rem;
	font-size: 0.9rem;
	color: var(--color-ink);
	line-height: 1.55;
}

.error {
	color: #b91c1c;
}

@media (max-width: 1100px) {
	.hero,
	.workspace-grid {
		grid-template-columns: 1fr;
	}
	}
</style>
