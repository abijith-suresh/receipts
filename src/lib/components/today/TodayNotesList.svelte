<script lang="ts">
	import type { TodayNote } from '$lib/convex';
	import { formatDateTime } from '$lib/utils/date';

	let { notes }: { notes: TodayNote[] } = $props();
</script>

<section class="notes-card">
	<div class="notes-header">
		<div>
			<p class="notes-eyebrow">Notes</p>
			<h2 class="notes-title">Today's raw notes</h2>
		</div>
		<span class="notes-count">{notes.length} note{notes.length === 1 ? '' : 's'}</span>
	</div>

	{#if notes.length === 0}
		<div class="notes-empty">
			<p class="notes-empty-title">No notes yet.</p>
			<p class="notes-empty-copy">
				Capture the first note for today. You can generate the day summary once at least one note is here.
			</p>
		</div>
	{:else}
		<div class="notes-list">
			{#each notes as note (note._id)}
				<article class="note-item">
					<div class="note-meta">
						<span class="note-time">{formatDateTime(note.createdAt)}</span>
					</div>
					<p class="note-body">{note.content}</p>
				</article>
			{/each}
		</div>
	{/if}
</section>

<style>
.notes-card {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1.35rem;
	border-radius: 1.2rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 95%, white 5%);
	box-shadow: var(--shadow-card);
}

.notes-header {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 1rem;
	padding-bottom: 0.9rem;
	border-bottom: 1px solid color-mix(in srgb, var(--color-border) 86%, transparent);
}

.notes-eyebrow {
	margin: 0 0 0.3rem;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.notes-title {
	margin: 0;
	font-family: var(--font-display);
	font-size: 1.25rem;
	font-weight: 400;
	line-height: 1.2;
	color: var(--color-ink);
}

.notes-count {
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--color-muted);
	white-space: nowrap;
}

.notes-empty {
	padding: 1.2rem;
	border-radius: 1rem;
	border: 1px dashed var(--color-border-strong);
	background: color-mix(in srgb, var(--color-canvas) 92%, white);
}

.notes-empty-title,
.notes-empty-copy {
	margin: 0;
}

.notes-empty-title {
	font-size: 0.95rem;
	font-weight: 600;
	color: var(--color-ink);
	margin-bottom: 0.3rem;
}

.notes-empty-copy {
	font-size: 0.88rem;
	line-height: 1.55;
	color: var(--color-muted);
}

.notes-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.note-item {
	padding: 1rem 1.05rem;
	border-radius: 1rem;
	border: 1px solid color-mix(in srgb, var(--color-border) 88%, transparent);
	background: linear-gradient(
		180deg,
		color-mix(in srgb, var(--color-canvas) 72%, white),
		color-mix(in srgb, var(--color-surface) 92%, white)
	);
}

.note-meta {
	display: flex;
	align-items: center;
	gap: 0.65rem;
	margin-bottom: 0.6rem;
	flex-wrap: wrap;
}

.note-time {
	font-size: 0.75rem;
	color: var(--color-muted);
}

.note-body {
	margin: 0;
	font-size: 0.94rem;
	line-height: 1.7;
	color: var(--color-ink-2);
	white-space: pre-wrap;
	word-break: break-word;
}
</style>
