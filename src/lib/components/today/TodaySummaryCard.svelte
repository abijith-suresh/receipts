<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { LogEntry } from '$lib/convex';
	import { getDaySummaryBody } from '$lib/today';
	import { formatDateTime } from '$lib/utils/date';

	let {
		summary,
		canSynthesize = false,
		isSynthesizing = false,
		isDirty = false,
		onSynthesize,
	}: {
		summary: LogEntry | null;
		canSynthesize?: boolean;
		isSynthesizing?: boolean;
		isDirty?: boolean;
		onSynthesize?: () => void;
	} = $props();
</script>

<section class="summary-card">
	<div class="summary-header">
		<div>
			<p class="summary-eyebrow">Day summary</p>
			<h2 class="summary-title">AI synthesis</h2>
		</div>
		<Button
			variant={summary ? 'secondary' : 'primary'}
			onclick={() => onSynthesize?.()}
			disabled={!canSynthesize || isSynthesizing}
		>
			{#if isSynthesizing}
				Synthesizing…
			{:else if summary && isDirty}
				Re-generate
			{:else if summary}
				Summarize again
			{:else}
				Summarize my day
			{/if}
		</Button>
	</div>

	{#if summary}
		<div class="summary-body-wrap">
			<p class="summary-lead">{summary.summary}</p>
			{#if getDaySummaryBody(summary)}
				<p class="summary-body">{getDaySummaryBody(summary)}</p>
			{/if}
			{#if summary.tags?.length}
				<div class="tag-row">
					{#each summary.tags as tag}
						<span class="tag-chip">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>
		<div class="summary-footer">
			<span>Updated {formatDateTime(summary.updatedAt)}</span>
			{#if summary.noteCount}
				<span>{summary.noteCount} source note{summary.noteCount === 1 ? '' : 's'}</span>
			{/if}
		</div>
	{:else}
		<div class="summary-empty">
			<p class="summary-empty-title">No summary yet.</p>
			<p class="summary-empty-copy">
				Once you have a few notes, generate a clean day-level summary for your timeline.
			</p>
			{#if canSynthesize}
				<div class="summary-empty-actions">
					<Button onclick={() => onSynthesize?.()} disabled={isSynthesizing}>
						{isSynthesizing ? 'Synthesizing…' : 'Finalize & close day'}
					</Button>
				</div>
			{/if}
		</div>
	{/if}
</section>

<style>
.summary-card {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1.35rem;
	border-radius: 1.2rem;
	border: 1px solid color-mix(in srgb, var(--color-border) 84%, var(--color-brand-muted));
	background: linear-gradient(
		180deg,
		color-mix(in srgb, var(--color-surface) 96%, white) 0%,
		var(--color-surface) 100%
	);
	box-shadow: var(--shadow-card);
}

.summary-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
}

.summary-eyebrow {
	margin: 0 0 0.3rem;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.summary-title {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.25rem;
	font-weight: 400;
	line-height: 1.2;
	color: var(--color-ink);
}

.summary-body-wrap {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem 1.05rem;
	border-radius: 1rem;
	background: color-mix(in srgb, var(--color-canvas) 82%, white);
	border: 1px solid color-mix(in srgb, var(--color-border) 90%, transparent);
}

.summary-lead,
.summary-body,
.summary-empty-title,
.summary-empty-copy {
	margin: 0;
}

.summary-lead {
	font-size: 1rem;
	line-height: 1.6;
	color: var(--color-ink);
	font-weight: 600;
}

.summary-body {
	font-size: 0.92rem;
	line-height: 1.7;
	color: var(--color-ink-2);
	white-space: pre-wrap;
}

.tag-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.tag-chip {
	display: inline-flex;
	align-items: center;
	padding: 0.32rem 0.6rem;
	border-radius: 9999px;
	background: color-mix(in srgb, var(--color-brand-soft) 84%, white);
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--color-brand-strong);
}

.summary-footer {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex-wrap: wrap;
	font-size: 0.78rem;
	color: var(--color-muted);
}

.summary-empty {
	padding: 1.15rem;
	border-radius: 1rem;
	border: 1px dashed var(--color-border-strong);
	background: color-mix(in srgb, var(--color-canvas) 92%, white);
}

.summary-empty-title {
	font-size: 0.95rem;
	font-weight: 600;
	color: var(--color-ink);
	margin-bottom: 0.3rem;
}

.summary-empty-copy {
	font-size: 0.88rem;
	line-height: 1.55;
	color: var(--color-muted);
}

.summary-empty-actions {
	margin-top: 0.9rem;
}

@media (max-width: 720px) {
	.summary-header {
		flex-direction: column;
	}

	.summary-card :global(.btn) {
		width: 100%;
	}
}
</style>
