<script lang="ts">
import { useConvexClient } from 'convex-svelte';
import { goto } from '$app/navigation';

import { api } from '$lib/convex';
import { getTodayLocalDate } from '$lib/utils/date';
import { validateEntry } from '$lib/utils/entries';

const convex = useConvexClient();

let entryDate = $state(getTodayLocalDate());
let rawInput = $state('');
let errorMessage = $state<string | null>(null);
let isSaving = $state(false);

async function handleSubmit(event: SubmitEvent) {
	event.preventDefault();

	errorMessage = validateEntry(rawInput);

	if (errorMessage) {
		return;
	}

	isSaving = true;

	try {
		await convex.mutation(api.logEntries.create, {
			entryDate,
			rawInput,
		});

		await goto('/dashboard');
	} catch (error) {
		errorMessage =
			error instanceof Error
				? error.message
				: 'Unable to save your entry right now.';
	} finally {
		isSaving = false;
	}
}
</script>

<form class="space-y-6 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8" onsubmit={handleSubmit}>
	<div class="grid gap-6 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-start">
		<div>
			<label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-strong)]" for="entry-date">
				Entry date
			</label>
			<input
				id="entry-date"
				class="mt-3 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] shadow-sm outline-none transition focus:border-[var(--color-brand-strong)] focus:ring-4 focus:ring-[var(--color-brand-soft)]"
				type="date"
				bind:value={entryDate}
			/>
		</div>

		<div>
			<label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-strong)]" for="raw-input">
				What moved forward today?
			</label>
			<textarea
				id="raw-input"
				class="mt-3 min-h-64 w-full rounded-[1.5rem] border border-[var(--color-border)] bg-white px-5 py-4 text-sm leading-7 text-[var(--color-ink)] shadow-sm outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand-strong)] focus:ring-4 focus:ring-[var(--color-brand-soft)] sm:text-base"
				placeholder="Shipped the billing retry fix, reviewed two PRs, and finally unblocked the analytics migration. Still waiting on product sign-off for the dashboard copy."
				bind:value={rawInput}
			></textarea>

			<div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
				<p>Keep it natural. No special format needed.</p>
				<p>{rawInput.trim().length} characters</p>
			</div>
		</div>
	</div>

	{#if errorMessage}
		<p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
			{errorMessage}
		</p>
	{/if}

	<div class="flex flex-wrap items-center justify-between gap-3">
		<p class="max-w-xl text-sm text-[var(--color-muted)]">
			Phase 1 saves your raw note and a lightweight summary so you can build the logging habit before AI structure lands.
		</p>
		<button class="inline-flex items-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-strong)] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSaving}>
			{isSaving ? 'Saving entry...' : 'Save entry'}
		</button>
	</div>
</form>
