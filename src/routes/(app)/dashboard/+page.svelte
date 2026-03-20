<script lang="ts">
import { useQuery } from 'convex-svelte';
import { useClerkContext } from 'svelte-clerk';

import { convexAuthReady } from '$lib/auth/convexAuth';
import EntryTimeline from '$lib/components/EntryTimeline.svelte';
import { api } from '$lib/convex';

const clerk = useClerkContext();

const entries = useQuery(
	api.logEntries.list,
	() =>
		clerk.isLoaded && !!clerk.auth.userId && $convexAuthReady ? {} : 'skip',
);
</script>

<div class="page">
	<div class="page-header">
		<div class="page-header-text">
			<p class="eyebrow">Daily proof of work</p>
			<h1 class="page-title">Your timeline</h1>
			<p class="page-desc">
				Log quickly, revisit before reviews, and build a body of evidence one calm workday at a time.
			</p>
		</div>
		<a class="btn-primary" href="/entry/new">New entry</a>
	</div>

	{#if entries.isLoading}
		<div class="status-card">
			<div class="loading-dot"></div>
			<span>Loading your timeline…</span>
		</div>
	{:else if entries.error}
		<div class="error-card">
			{entries.error.message}
		</div>
	{:else}
		<EntryTimeline entries={entries.data ?? []} />
	{/if}
</div>

<style>
.page {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

/* ── Page header ─────────────────────────────────────────── */
.page-header {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid var(--color-border);
}

@media (min-width: 640px) {
	.page-header {
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
	}
}

.page-header-text {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.eyebrow {
	font-size: 0.6875rem;
	font-weight: 700;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
	margin: 0;
}

.page-title {
	font-family: var(--font-display);
	font-size: 2rem;
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.2;
}

@media (min-width: 640px) {
	.page-title {
		font-size: 2.25rem;
	}
}

.page-desc {
	font-size: 0.9375rem;
	line-height: 1.7;
	color: var(--color-muted);
	margin: 0;
	max-width: 40rem;
}

/* ── Primary button ──────────────────────────────────────── */
.btn-primary {
	display: inline-flex;
	align-items: center;
	padding: 0.625rem 1.25rem;
	border-radius: 9999px;
	background-color: var(--color-ink);
	color: #fff;
	font-size: 0.875rem;
	font-weight: 600;
	text-decoration: none;
	transition: transform 0.15s ease, background-color 0.15s ease;
	white-space: nowrap;
	flex-shrink: 0;
}

.btn-primary:hover {
	transform: translateY(-1px);
	background-color: var(--color-brand-strong);
}

/* ── Status cards ────────────────────────────────────────── */
.status-card {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 2rem;
	border-radius: 1rem;
	border: 1px solid var(--color-border);
	background-color: var(--color-surface);
	font-size: 0.875rem;
	color: var(--color-muted);
}

.loading-dot {
	width: 0.4375rem;
	height: 0.4375rem;
	border-radius: 9999px;
	background-color: var(--color-brand);
	flex-shrink: 0;
	animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 0.3; transform: scale(0.9); }
	50%       { opacity: 1;   transform: scale(1.1); }
}

.error-card {
	padding: 1.25rem 1.5rem;
	border-radius: 1rem;
	border: 1px solid #fecaca;
	background-color: #fef2f2;
	font-size: 0.875rem;
	color: #b91c1c;
}
</style>
