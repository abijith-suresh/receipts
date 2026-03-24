<script lang="ts">
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { useClerkContext } from 'svelte-clerk';
	import { fade } from 'svelte/transition';

	import { convexAuthReady } from '$lib/auth/convexAuth';
	import TodayCaptureForm from '$lib/components/TodayCaptureForm.svelte';
	import TodayDirtyBanner from '$lib/components/today/TodayDirtyBanner.svelte';
	import TodayNotesList from '$lib/components/today/TodayNotesList.svelte';
	import TodaySummaryCard from '$lib/components/today/TodaySummaryCard.svelte';
	import { api, type TodayState } from '$lib/convex';
	import {
		formatDateTime,
		formatEntryDate,
		formatRelativeEntryDate,
		getTodayLocalDate,
	} from '$lib/utils/date';

	const clerk = useClerkContext();
	const convex = useConvexClient();
	let flashMessage = $state<string | null>(null);
	let flashTimeout: ReturnType<typeof setTimeout> | null = null;
	let isSynthesizing = $state(false);
	let isDismissingDirtyPrompt = $state(false);
	const ready = $derived(clerk.isLoaded && !!clerk.auth.userId && $convexAuthReady);
	const settings = useQuery(api.users.settings, () => (ready ? {} : 'skip'));
	const preferredTimezone = $derived(settings.data?.timezone);
	const resolvedActiveDate = $derived(getTodayLocalDate(preferredTimezone));

	const todayStateQuery = useQuery(api.dayCapture.getTodayState, () =>
		ready ? { entryDate: resolvedActiveDate } : 'skip',
	);

	const todayState = $derived(
		(todayStateQuery.data as TodayState | null | undefined) ?? null,
	);
	const notes = $derived(
		[...(todayState?.dayNotes ?? [])].sort(
			(left, right) => right.createdAt - left.createdAt,
		),
	);
	const summary = $derived(todayState?.logEntry ?? null);
	const pageState = $derived(todayState?.state ?? 'empty');
	const isDirty = $derived(todayState?.dirtyPrompt?.isDirty ?? false);
	const canSynthesize = $derived((todayState?.noteCount ?? 0) > 0);
	const lastUpdatedAt = $derived(
		Math.max(
			todayState?.dirtyPrompt?.latestUpdatedAt ?? 0,
			summary?.updatedAt ?? 0,
		) || null,
	);

	function showFlash(message: string) {
		flashMessage = message;

		if (flashTimeout) {
			clearTimeout(flashTimeout);
		}

		flashTimeout = setTimeout(() => {
			flashMessage = null;
		}, 2400);
	}

	function handleSaved() {
		showFlash('Note added');
	}

	async function dismissDirtyPrompt() {
		isDismissingDirtyPrompt = true;

		try {
			await convex.mutation(api.dayCapture.dismissDirtyPrompt, {
				entryDate: resolvedActiveDate,
			});
			showFlash('Prompt dismissed');
		} catch (error) {
			showFlash(
				error instanceof Error
					? error.message
					: 'Unable to dismiss this reminder right now.',
			);
		} finally {
			isDismissingDirtyPrompt = false;
		}
	}

	async function triggerSynthesis() {
		isSynthesizing = true;

		try {
			await convex.action(api.dayCaptureActions.synthesizeDayCapture, {
				entryDate: resolvedActiveDate,
			});
			showFlash('Day summary generated');
		} catch (error) {
			showFlash(
				error instanceof Error
					? error.message
					: 'Unable to generate your day summary right now.',
			);
		} finally {
			isSynthesizing = false;
		}
	}
</script>

<div class="today-page">
	<header class="page-header">
		<h1 class="page-title">
			{formatRelativeEntryDate(resolvedActiveDate, preferredTimezone)}
		</h1>
		<p class="date-label">{formatEntryDate(resolvedActiveDate)}</p>
	</header>

	{#if !todayStateQuery.isLoading}
		<div class="capture-card" in:fade={{ duration: 200 }}>
			<div class="card-header">
				<div>
					<p class="state-chip">{pageState}</p>
					<h2 class="card-title">Capture your day in notes, then synthesize on demand.</h2>
				</div>
				<p class="card-subtitle">
					Add quick notes as work happens. When you are ready, roll them into one
					clean day summary for your timeline.
				</p>
			</div>

			{#if pageState === 'summarized'}
				<div class="composer-inline">
					<span class="inline-label">Have something new?</span>
				</div>
			{/if}

			<TodayCaptureForm entryDate={resolvedActiveDate} onSaved={handleSaved} />

			<TodayDirtyBanner
				visible={todayState?.dirtyPrompt?.shouldPrompt ?? false}
				isSynthesizing={isSynthesizing}
				isDismissing={isDismissingDirtyPrompt}
				onDismiss={dismissDirtyPrompt}
				onSynthesize={triggerSynthesis}
			/>

			<div class="today-grid">
				<TodayNotesList notes={notes} />
				<TodaySummaryCard
					summary={summary}
					canSynthesize={canSynthesize}
					isDirty={isDirty}
					isSynthesizing={isSynthesizing}
					onSynthesize={triggerSynthesis}
				/>
			</div>

			<div class="status-bar">
				{#key `${todayStateQuery.isLoading}-${flashMessage}-${notes.length}-${!!summary}`}
					<span class="status-text" class:error={!!todayStateQuery.error} in:fade={{ duration: 200 }}>
						{#if todayStateQuery.error}
							{todayStateQuery.error.message}
						{:else if flashMessage}
							{flashMessage}
						{:else if lastUpdatedAt}
							Last activity {formatDateTime(lastUpdatedAt)}
						{:else}
							Your notes stay private.
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
	max-width: 72rem;
	margin: 0 auto;
	padding: 0;
}

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
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
}

.state-chip {
	display: inline-flex;
	align-items: center;
	margin: 0 0 0.55rem;
	padding: 0.3rem 0.55rem;
	border-radius: 9999px;
	background: color-mix(in srgb, var(--color-brand-soft) 84%, white);
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.card-title {
	font-family: var(--font-display);
	font-size: 1.4rem;
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.3;
}

.card-subtitle {
	max-width: 34rem;
	font-size: 0.875rem;
	color: var(--color-muted);
	margin: 0;
	line-height: 1.6;
}

.composer-inline {
	display: flex;
	justify-content: flex-end;
}

.inline-label {
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--color-brand-strong);
}

.today-grid {
	display: grid;
	grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 0.95fr);
	gap: 1rem;
}

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

@media (max-width: 900px) {
	.card-header {
		flex-direction: column;
	}

	.today-grid {
		grid-template-columns: 1fr;
	}
}

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
	}
}

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

.skeleton-line--wide {
	width: 75%;
}

.skeleton-line--narrow {
	width: 45%;
}

@keyframes shimmer {
	0% {
		background-position: 200% 0;
	}

	100% {
		background-position: -200% 0;
	}
}
</style>
