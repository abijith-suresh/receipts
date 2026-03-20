<script lang="ts">
import EntryForm from '$lib/components/EntryForm.svelte';
</script>

<div class="page">
	<div class="page-header">
		<p class="eyebrow">Capture the day</p>
		<h1 class="page-title">Log today's work before it fades.</h1>
		<p class="page-desc">
			Drop in the rough version now — no special format needed.
		</p>
	</div>

	<EntryForm />
</div>

<style>
.page {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.page-header {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid var(--color-border);
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
}
</style>
