<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { useClerkContext } from 'svelte-clerk';
	import type { LogEntry } from '$lib/convex';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import { convexAuthReady } from '$lib/auth/convexAuth';
	import TodayCaptureForm from '$lib/components/TodayCaptureForm.svelte';
	import { api } from '$lib/convex';
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

	const currentEntry = $derived((todayEntry.data as LogEntry | null | undefined) ?? null);

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
</script>

<div class="today-page">
	<header class="page-header">
		<h1 class="page-title">{formatRelativeEntryDate(resolvedActiveDate, preferredTimezone)}</h1>
		<p class="date-label">{formatEntryDate(resolvedActiveDate)}</p>
	</header>

	{#if !todayEntry.isLoading}
		<div class="capture-card" in:fly={{ y: 10, duration: 280, easing: cubicOut }}>
			<div class="card-header">
				<h2 class="card-title">What moved forward today?</h2>
				<p class="card-subtitle">Write it the way you would say it. Keep the facts while they are still fresh.</p>
			</div>

			<TodayCaptureForm entryDate={resolvedActiveDate} entry={currentEntry} onSaved={handleSaved} />

			<div class="status-bar">
				{#key `${todayEntry.isLoading}-${savedToast}-${!!currentEntry}`}
					<span
						class="status-text"
						class:error={!!todayEntry.error}
						in:fade={{ duration: 200 }}
					>
						{#if todayEntry.error}
							{todayEntry.error.message}
						{:else if savedToast && currentEntry}
							Saved {formatDateTime(currentEntry.updatedAt)}
						{:else if currentEntry}
							Last updated {formatDateTime(currentEntry.updatedAt)}
						{:else}
							Your receipt stays private.
						{/if}
					</span>
				{/key}
			</div>
		</div>
	{:else}
		<div class="capture-card capture-card--skeleton" aria-busy="true">
			<div class="skeleton-line skeleton-line--wide"></div>
			<div class="skeleton-line skeleton-line--narrow"></div>
		</div>
	{/if}
</div>

<style>
.today-page {
	max-width: 48rem;
	margin: 0 auto;
	padding: 0;
}

/* Header */
.page-header {
	padding: 2.5rem 0 1.75rem;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.page-title {
	font-family: var(--font-display);
	font-size: 2rem;
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.15;
	letter-spacing: -0.01em;
}

.date-label {
	font-size: 0.875rem;
	color: var(--color-muted);
	margin: 0;
	letter-spacing: 0.01em;
}

/* Capture Card */
.capture-card {
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-card);
	box-shadow: var(--shadow-card);
	padding: 1.75rem;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.card-header {
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
}

.card-title {
	font-family: var(--font-display);
	font-size: 1.25rem;
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.3;
}

.card-subtitle {
	font-size: 0.875rem;
	color: var(--color-muted);
	margin: 0;
	line-height: 1.6;
}

/* Status Bar */
.status-bar {
	padding-top: 0.75rem;
	border-top: 1px solid var(--color-border);
}

.status-text {
	font-size: 0.75rem;
	color: var(--color-muted);
}

.status-text.error {
	color: var(--color-error);
}

/* Mobile */
@media (max-width: 600px) {
	.today-page {
		padding: 0 0.25rem;
	}

	.page-header {
		padding: 1.5rem 0 1.25rem;
	}

	.page-title {
		font-size: 1.5rem;
	}

	.capture-card {
		padding: 1.25rem;
	}}

.capture-card--skeleton {
	min-height: 12rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.75rem;
	padding: 1.75rem;
}

.skeleton-line {
	height: 0.875rem;
	border-radius: var(--radius-sm);
	background: linear-gradient(
		90deg,
		color-mix(in srgb, var(--color-border) 70%, transparent),
		color-mix(in srgb, var(--color-border) 40%, transparent),
		color-mix(in srgb, var(--color-border) 70%, transparent)
	);
	background-size: 200% 100%;
	animation: shimmer 1.6s ease-in-out infinite;
}

.skeleton-line--wide  { width: 75%; }
.skeleton-line--narrow { width: 45%; }

@keyframes shimmer {
	0%   { background-position: 200% 0; }
	100% { background-position: -200% 0; }
}
</style>
