<script lang="ts">
import { useQuery } from 'convex-svelte';

import EntryTimeline from '$lib/components/EntryTimeline.svelte';
import { api } from '$lib/convex';

const entries = useQuery(api.logEntries.list, {});
</script>

<section class="space-y-6">
	<div class="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-strong)]">Daily proof of work</p>
			<h2 class="mt-2 font-display text-3xl text-[var(--color-ink)]">Your timeline</h2>
			<p class="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
				Log quickly, revisit before reviews, and build a body of evidence one calm workday at a time.
			</p>
		</div>
		<a class="inline-flex items-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-strong)]" href="/entry/new">
			New entry
		</a>
	</div>

	{#if entries.isLoading}
		<div class="rounded-[2rem] border border-white/70 bg-white/80 p-8 text-sm text-[var(--color-muted)] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
			Loading your timeline...
		</div>
	{:else if entries.error}
		<div class="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.25)]">
			{entries.error.message}
		</div>
	{:else}
		<EntryTimeline entries={entries.data ?? []} />
	{/if}
</section>
