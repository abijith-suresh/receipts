<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';

	let {
		visible = false,
		isSynthesizing = false,
		isDismissing = false,
		onSynthesize,
		onDismiss,
	}: {
		visible?: boolean;
		isSynthesizing?: boolean;
		isDismissing?: boolean;
		onSynthesize?: () => void;
		onDismiss?: () => void;
	} = $props();
</script>

{#if visible}
	<section class="dirty-banner" aria-live="polite">
		<div>
			<p class="dirty-eyebrow">Summary may be outdated</p>
			<p class="dirty-copy">
				Your summary may be outdated. Re-generate?
			</p>
		</div>
		<div class="dirty-actions">
			<Button variant="text" onclick={() => onDismiss?.()} disabled={isDismissing}>
				{isDismissing ? 'Dismissing…' : 'Dismiss'}
			</Button>
			<Button variant="secondary" onclick={() => onSynthesize?.()} disabled={isSynthesizing}>
				{isSynthesizing ? 'Re-generating…' : 'Re-generate'}
			</Button>
		</div>
	</section>
{/if}

<style>
.dirty-banner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.1rem;
	border-radius: 1rem;
	border: 1px solid color-mix(in srgb, var(--color-brand) 32%, var(--color-border));
	background: linear-gradient(135deg, color-mix(in srgb, var(--color-brand-soft) 86%, white), var(--color-surface));
	box-shadow: var(--shadow-sm);
}

.dirty-eyebrow {
	margin: 0 0 0.2rem;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.dirty-copy {
	margin: 0;
	font-size: 0.9rem;
	line-height: 1.5;
	color: var(--color-ink-2);
}

.dirty-actions {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

@media (max-width: 720px) {
	.dirty-banner {
		flex-direction: column;
		align-items: stretch;
	}

	.dirty-actions {
		flex-direction: column;
	}

	.dirty-banner :global(.btn) {
		width: 100%;
	}
}
</style>
