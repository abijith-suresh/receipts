<script lang="ts">
	import { useConvexClient } from 'convex-svelte';

	import { api, type LogEntry } from '$lib/convex';
	import { validateEntry } from '$lib/utils/entries';

	const convex = useConvexClient();

	let {
		entryDate,
		entry,
		onSaved,
	}: {
		entryDate: string;
		entry: LogEntry | null | undefined;
		onSaved?: (entryDate: string) => void;
	} = $props();

	let rawInput = $state('');
	let errorMessage = $state<string | null>(null);
	let isSaving = $state(false);
	let showDateField = $state(false);

	$effect(() => {
		rawInput = entry?.rawInput ?? '';
		errorMessage = null;
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		errorMessage = validateEntry(rawInput);

		if (errorMessage) {
			return;
		}

		isSaving = true;

		try {
			await convex.mutation(api.logEntries.upsert, {
				entryDate,
				rawInput,
			});

			onSaved?.(entryDate);
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

<form class="capture-form" onsubmit={handleSubmit}>
	<div class="capture-top">
		<button type="button" class="date-chip" onclick={() => (showDateField = !showDateField)}>
			{showDateField ? 'Hide date' : 'Change date'}
		</button>
		<p class="capture-state">{entry ? 'Editing your saved receipt' : 'No receipt saved yet'}</p>
	</div>

	{#if showDateField}
		<div class="date-field">
			<label class="field-label" for="entry-date">Entry date</label>
			<input id="entry-date" class="field-input" type="date" bind:value={entryDate} />
		</div>
	{/if}

	<label class="field-label" for="raw-input">What moved forward today?</label>
	<textarea
		id="raw-input"
		class="field-textarea"
		placeholder="Shipped the billing retry fix, reviewed two PRs, and finally unblocked the analytics migration. Still waiting on product sign-off for the dashboard copy."
		bind:value={rawInput}
	></textarea>

	<div class="field-hint">
		<span>Keep it natural. Voice notes can plug into this same flow later.</span>
		<span class="char-count">{rawInput.trim().length} chars</span>
	</div>

	{#if errorMessage}
		<p class="error-msg">{errorMessage}</p>
	{/if}

	<div class="form-footer">
		<p class="footer-note">
			{entry
				? 'Update the rough version now. You can structure and refine it later.'
				: 'Start rough. Save the facts while they are still fresh.'}
		</p>
		<button class="btn-submit" type="submit" disabled={isSaving}>
			{isSaving ? 'Saving…' : entry ? 'Update receipt' : 'Save receipt'}
		</button>
	</div>
</form>

<style>
.capture-form {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	padding: 1.6rem;
	border-radius: 1.4rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 92%, white 8%);
	box-shadow: 0 28px 60px -42px rgba(15, 23, 42, 0.24);
}

.capture-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	flex-wrap: wrap;
}

.date-chip {
	display: inline-flex;
	align-items: center;
	padding: 0.45rem 0.8rem;
	border-radius: 9999px;
	border: 1px solid var(--color-border);
	background: var(--color-canvas);
	font-size: 0.78rem;
	font-weight: 600;
	color: var(--color-ink);
	cursor: pointer;
	transition:
		border-color 0.15s ease,
		color 0.15s ease;
}

.date-chip:hover {
	border-color: color-mix(in srgb, var(--color-brand) 35%, var(--color-border));
	color: var(--color-brand-strong);
}

.capture-state {
	margin: 0;
	font-size: 0.8125rem;
	color: var(--color-muted);
}

.date-field {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	max-width: 12rem;
}

.field-label {
	font-size: 0.6875rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.field-input,
.field-textarea {
	width: 100%;
	padding: 0.8rem 0.95rem;
	border-radius: 0.9rem;
	border: 1px solid var(--color-border);
	background: var(--color-canvas);
	color: var(--color-ink);
	font-size: 0.95rem;
	outline: none;
	transition:
		border-color 0.15s ease,
		box-shadow 0.15s ease;
	box-sizing: border-box;
}

.field-input:focus,
.field-textarea:focus {
	border-color: var(--color-brand);
	box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 15%, transparent);
}

.field-textarea {
	min-height: 15rem;
	resize: vertical;
	line-height: 1.8;
	font-size: 1rem;
	padding-top: 1rem;
	padding-bottom: 1rem;
}

.field-textarea::placeholder {
	color: var(--color-muted);
	opacity: 0.72;
}

.field-hint {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	font-size: 0.8125rem;
	color: var(--color-muted);
	flex-wrap: wrap;
}

.char-count {
	font-variant-numeric: tabular-nums;
}

.error-msg {
	padding: 0.75rem 1rem;
	border-radius: 0.875rem;
	border: 1px solid #fecaca;
	background-color: #fef2f2;
	font-size: 0.875rem;
	color: #b91c1c;
	margin: 0;
}

.form-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding-top: 0.2rem;
	border-top: 1px solid var(--color-border);
	flex-wrap: wrap;
}

.footer-note {
	margin: 0;
	max-width: 28rem;
	font-size: 0.875rem;
	line-height: 1.6;
	color: var(--color-muted);
}

.btn-submit {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem 1.3rem;
	border-radius: 9999px;
	border: none;
	background-color: var(--color-ink);
	color: #fff;
	font-size: 0.875rem;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.15s ease, background-color 0.15s ease;
}

.btn-submit:hover:not(:disabled) {
	transform: translateY(-1px);
	background-color: var(--color-brand-strong);
}

.btn-submit:disabled {
	opacity: 0.55;
	cursor: not-allowed;
}
</style>
