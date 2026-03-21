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
	let textareaElement = $state<HTMLTextAreaElement | null>(null);

	$effect(() => {
		rawInput = entry?.rawInput ?? '';
		errorMessage = null;
	});

	$effect(() => {
		if (textareaElement && rawInput !== undefined) {
			autoResize();
		}
	});

	function autoResize() {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			textareaElement.style.height = textareaElement.scrollHeight + 'px';
		}
	}

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
			errorMessage = error instanceof Error ? error.message : 'Unable to save your receipt right now.';
		} finally {
			isSaving = false;
		}
	}
</script>

<form class="capture-form" onsubmit={handleSubmit}>
	<div class="capture-header">
		<span class="capture-state">{entry ? 'Saved draft loaded' : 'Not saved yet'}</span>
		<button type="button" class="date-link" onclick={() => (showDateField = !showDateField)}>
			{showDateField ? 'Hide date' : 'Change date'}
		</button>
	</div>

	{#if showDateField}
		<div class="date-field">
			<label class="field-label" for="entry-date">Entry date</label>
			<input id="entry-date" class="field-input" type="date" bind:value={entryDate} />
		</div>
	{/if}

	<label class="sr-only" for="raw-input">What moved forward today?</label>
	<textarea
		id="raw-input"
		class="field-textarea"
		placeholder="Write it the way you would say it. Shipments, meetings, blockers, wins, loose notes — it all counts."
		bind:value={rawInput}
		bind:this={textareaElement}
		oninput={autoResize}
	></textarea>

	{#if errorMessage}
		<p class="error-msg">{errorMessage}</p>
	{/if}

	<div class="form-footer">
		<span class="char-count">{rawInput.trim().length} chars</span>
		<button class="btn-submit" type="submit" disabled={isSaving}>
			{isSaving ? 'Saving…' : entry ? 'Update receipt' : 'Save receipt'}
		</button>
	</div>
</form>

<style>
.capture-form {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem;
	border-radius: 1rem;
	border: 1px solid var(--color-border);
	background: var(--color-surface);
}

.capture-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.date-link {
	border: none;
	padding: 0;
	background: transparent;
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--color-ink);
	cursor: pointer;
	transition: color 0.15s ease;
}

.date-link:hover {
	color: var(--color-brand-strong);
}

.capture-state {
	font-size: 0.75rem;
	color: var(--color-muted);
}

.date-field {
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	max-width: 12rem;
}

.field-label {
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.field-input {
	width: 100%;
	box-sizing: border-box;
	padding: 0.625rem 0.75rem;
	border-radius: 0.75rem;
	border: 1px solid var(--color-border);
	background: var(--color-canvas);
	color: var(--color-ink);
	font-size: 0.875rem;
	outline: none;
	transition:
		border-color 0.15s ease,
		box-shadow 0.15s ease;
}

.field-input:focus {
	border-color: var(--color-brand);
	box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 14%, transparent);
}

.field-textarea {
	width: 100%;
	box-sizing: border-box;
	padding: 0.875rem 1rem;
	border-radius: 0.75rem;
	border: 1px solid var(--color-border);
	background: var(--color-canvas);
	color: var(--color-ink);
	font-size: 1rem;
	line-height: 1.75;
	min-height: 8rem;
	max-height: 16rem;
	resize: none;
	overflow-y: auto;
	outline: none;
	transition:
		border-color 0.15s ease,
		box-shadow 0.15s ease;
}

.field-textarea:focus {
	border-color: var(--color-brand);
	box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 14%, transparent);
}

.field-textarea::placeholder {
	color: var(--color-muted);
	opacity: 0.72;
}

.error-msg {
	margin: 0;
	padding: 0.625rem 0.875rem;
	border-radius: 0.75rem;
	border: 1px solid #fecaca;
	background: #fef2f2;
	font-size: 0.75rem;
	color: #b91c1c;
}

.form-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.char-count {
	font-size: 0.75rem;
	color: var(--color-muted);
}

.btn-submit {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.625rem 1.25rem;
	border-radius: 9999px;
	border: none;
	background: var(--color-ink);
	color: #fff;
	font-size: 0.875rem;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.15s ease, background-color 0.15s ease;
}

.btn-submit:hover:not(:disabled) {
	transform: translateY(-1px);
	background: var(--color-brand-strong);
}

.btn-submit:disabled {
	opacity: 0.55;
	cursor: not-allowed;
}
</style>
