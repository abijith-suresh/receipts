<script lang="ts">
import { useConvexClient } from 'convex-svelte';
import { goto } from '$app/navigation';

import { api } from '$lib/convex';
import { getTodayLocalDate } from '$lib/utils/date';
import { validateEntry } from '$lib/utils/entries';
import Button from '$lib/components/ui/Button.svelte';

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

<form class="form" onsubmit={handleSubmit}>
	<div class="form-grid">
		<div class="form-field">
			<label class="field-label" for="entry-date">Entry date</label>
			<input
				id="entry-date"
				class="field-input"
				type="date"
				bind:value={entryDate}
			/>
		</div>

		<div class="form-field">
			<label class="field-label" for="raw-input">What moved forward today?</label>
			<textarea
				id="raw-input"
				class="field-textarea"
				placeholder="Shipped the billing retry fix, reviewed two PRs, and finally unblocked the analytics migration. Still waiting on product sign-off for the dashboard copy."
				bind:value={rawInput}
			></textarea>
			<div class="field-hint">
				<span>Keep it natural. No special format needed.</span>
				<span class="char-count">{rawInput.trim().length} chars</span>
			</div>
		</div>
	</div>

	{#if errorMessage}
		<p class="error-msg">{errorMessage}</p>
	{/if}

	<div class="form-footer">
		<a class="back-link" href="/dashboard">← Back to timeline</a>
		<Button type="submit" disabled={isSaving}>
			{isSaving ? 'Saving…' : 'Save entry'}
		</Button>
	</div>
</form>

<style>
.form {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 1.75rem;
	border-radius: 1rem;
	border: 1px solid var(--color-border);
	background-color: var(--color-surface);
}

@media (min-width: 640px) {
	.form {
		padding: 2rem;
	}
}

/* ── Form grid ───────────────────────────────────────────── */
.form-grid {
	display: grid;
	gap: 1.5rem;
}

@media (min-width: 640px) {
	.form-grid {
		grid-template-columns: 13rem minmax(0, 1fr);
		align-items: start;
	}
}

.form-field {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

/* ── Labels ──────────────────────────────────────────────── */
.field-label {
	font-size: 0.6875rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

/* ── Inputs ──────────────────────────────────────────────── */
.field-input,
.field-textarea {
	width: 100%;
	padding: 0.6875rem 0.875rem;
	border-radius: 0.625rem;
	border: 1px solid var(--color-border);
	background-color: var(--color-canvas);
	color: var(--color-ink);
	font-size: 0.9375rem;
	outline: none;
	transition: border-color 0.15s ease, box-shadow 0.15s ease;
	box-sizing: border-box;
}

.field-input:focus,
.field-textarea:focus {
	border-color: var(--color-brand);
	box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 15%, transparent);
}

.field-textarea {
	min-height: 14rem;
	resize: vertical;
	line-height: 1.75;
}

.field-textarea::placeholder {
	color: var(--color-muted);
	opacity: 0.7;
}

/* ── Hint row ────────────────────────────────────────────── */
.field-hint {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.8125rem;
	color: var(--color-muted);
}

.char-count {
	font-variant-numeric: tabular-nums;
}

/* ── Error message ───────────────────────────────────────── */
.error-msg {
	padding: 0.75rem 1rem;
	border-radius: 0.625rem;
	border: 1px solid #fecaca;
	background-color: #fef2f2;
	font-size: 0.875rem;
	color: #b91c1c;
	margin: 0;
}

/* ── Form footer ─────────────────────────────────────────── */
.form-footer {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding-top: 0.25rem;
	border-top: 1px solid var(--color-border);
}

.back-link {
	font-size: 0.875rem;
	color: var(--color-muted);
	text-decoration: none;
	transition: color 0.15s ease;
}

.back-link:hover {
	color: var(--color-ink);
}
</style>
