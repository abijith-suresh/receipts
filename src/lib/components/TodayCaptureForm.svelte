<script lang="ts">
	import { useConvexClient } from 'convex-svelte';

	import Button from '$lib/components/ui/Button.svelte';
	import { api } from '$lib/convex';

	const convex = useConvexClient();

	let {
		entryDate,
		disabled = false,
		onSaved,
	}: {
		entryDate: string;
		disabled?: boolean;
		onSaved?: () => void;
	} = $props();

	let content = $state('');
	let errorMessage = $state<string | null>(null);
	let isSaving = $state(false);
	let textareaElement = $state<HTMLTextAreaElement | null>(null);

	$effect(() => {
		if (textareaElement) {
			autoResize();
		}
	});

	function autoResize() {
		if (!textareaElement) {
			return;
		}

		textareaElement.style.height = 'auto';
		textareaElement.style.height = `${textareaElement.scrollHeight}px`;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = validateNote(content);

		if (errorMessage) {
			return;
		}

		isSaving = true;

		try {
			await convex.mutation(api.dayCapture.addDayNote, {
				entryDate,
				content,
			});
			content = '';
			errorMessage = null;
			onSaved?.();
		} catch (error) {
			errorMessage =
				error instanceof Error
					? error.message
					: 'Unable to save your note right now.';
		} finally {
			isSaving = false;
		}
	}

	function validateNote(value: string) {
		const trimmed = value.trim();

		if (trimmed.length < 3) {
			return 'Write at least 3 characters for each note.';
		}

		if (trimmed.length > 600) {
			return 'Keep each note under 600 characters.';
		}

		return null;
	}
</script>

<form class="capture-form" onsubmit={handleSubmit}>
	<div class="capture-header">
		<div>
			<span class="capture-state">Add note</span>
			<p class="capture-helper">
				Capture a win, blocker, meeting outcome, or fragment while it is still fresh.
			</p>
		</div>
		<span class="date-pill">{entryDate}</span>
	</div>

	<label class="sr-only" for="today-note-content">Add a note for today</label>
	<textarea
		id="today-note-content"
		class="field-textarea"
		placeholder="Finished the migration, paired on the failing test, follow-up still blocked on copy review..."
		bind:value={content}
		bind:this={textareaElement}
		oninput={autoResize}
		disabled={disabled || isSaving}
	></textarea>

	{#if errorMessage}
		<p class="error-msg">{errorMessage}</p>
	{/if}

	<div class="form-footer">
		<span class="char-count">{content.trim().length} chars</span>
		<Button type="submit" disabled={disabled || isSaving}>
			{isSaving ? 'Adding…' : 'Add note'}
		</Button>
	</div>
</form>

<style>
.capture-form {
	display: flex;
	flex-direction: column;
	gap: 0.9rem;
	padding: 1.25rem;
	border-radius: 1.15rem;
	border: 1px solid color-mix(in srgb, var(--color-border) 88%, var(--color-brand-muted));
	background: linear-gradient(
		180deg,
		color-mix(in srgb, var(--color-surface) 92%, white) 0%,
		var(--color-surface) 100%
	);
	box-shadow: var(--shadow-sm);
}

.capture-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
}

.capture-state {
	display: inline-block;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
	margin-bottom: 0.35rem;
}

.capture-helper {
	margin: 0;
	max-width: 34rem;
	font-size: 0.9rem;
	line-height: 1.55;
	color: var(--color-muted);
}

.date-pill {
	display: inline-flex;
	align-items: center;
	padding: 0.45rem 0.7rem;
	border-radius: 9999px;
	background: color-mix(in srgb, var(--color-brand-soft) 82%, white);
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--color-brand-strong);
	white-space: nowrap;
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

.field-textarea {
	width: 100%;
	box-sizing: border-box;
	padding: 0.95rem 1rem;
	border-radius: 0.95rem;
	border: 1px solid color-mix(in srgb, var(--color-border) 85%, var(--color-brand-soft));
	background: color-mix(in srgb, var(--color-canvas) 88%, white);
	color: var(--color-ink);
	font-size: 0.98rem;
	line-height: 1.75;
	min-height: 7.5rem;
	max-height: 18rem;
	resize: none;
	overflow-y: auto;
	outline: none;
}

.field-textarea:focus {
	border-color: var(--color-brand);
	background: var(--color-surface);
	box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 14%, transparent);
}

.field-textarea::placeholder {
	color: var(--color-muted);
	opacity: 0.72;
}

.field-textarea:disabled {
	opacity: 0.72;
	cursor: not-allowed;
}

.error-msg {
	margin: 0;
	padding: 0.625rem 0.875rem;
	border-radius: 0.75rem;
	border: 1px solid var(--color-error-border);
	background: var(--color-error-bg);
	font-size: 0.75rem;
	color: var(--color-error);
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
	font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
	.capture-form {
		padding: 1rem;
	}

	.capture-header,
	.form-footer {
		flex-direction: column;
		align-items: stretch;
	}

	.form-footer :global(.btn) {
		width: 100%;
	}
}
</style>
