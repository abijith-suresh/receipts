<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
</script>

<section class="empty">
	<p class="empty-eyebrow">Start your receipts habit</p>
	<h2 class="empty-title">Nothing logged yet.</h2>
	<p class="empty-desc">
		Write the kind of update you wish you could remember three months from now: shipped work,
		bugs fixed, hard conversations, blockers, and momentum.
	</p>
	<Button href="/entry/new" class="empty-cta-btn" style="align-self: flex-start; margin-top: 0.5rem;">Log today</Button>
</section>

<style>
.empty {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 2.5rem 2rem;
	border-radius: 1rem;
	border: 1px dashed var(--color-border);
	background-color: var(--color-surface);
}

.empty-eyebrow {
	font-size: var(--font-size-eyebrow);
	font-weight: 700;
	letter-spacing: var(--letter-spacing-eyebrow);
	text-transform: uppercase;
	color: var(--color-brand-strong);
	margin: 0;
}

.empty-title {
	font-family: var(--font-display);
	font-size: 1.875rem;
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.25;
}

.empty-desc {
	font-size: 0.9375rem;
	line-height: 1.75;
	color: var(--color-muted);
	margin: 0;
	max-width: 38rem;
}
</style>
