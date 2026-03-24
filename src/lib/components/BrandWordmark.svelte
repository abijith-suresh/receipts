<script lang="ts">
	type Size = 'sm' | 'md' | 'lg' | 'hero';
	type ElementTag = 'div' | 'span';

	let {
		href = undefined,
		descriptor = '',
		size = 'md',
		as = 'div',
		descriptorHiddenOnMobile = false,
		ariaLabel = 'Receipts'
	} = $props<{
		href?: string;
		descriptor?: string;
		size?: Size;
		as?: ElementTag;
		descriptorHiddenOnMobile?: boolean;
		ariaLabel?: string;
	}>();
</script>

{#if href}
	<a href={href} class={`brand brand--${size}`} aria-label={ariaLabel}>
		<span class="brand-name">Receipts</span>
		{#if descriptor}
			<span class={`brand-descriptor ${descriptorHiddenOnMobile ? 'brand-descriptor--mobile-hidden' : ''}`}>
				{descriptor}
			</span>
		{/if}
	</a>
{:else if as === 'span'}
	<span class={`brand brand--${size}`}>
		<span class="brand-name">Receipts</span>
		{#if descriptor}
			<span class={`brand-descriptor ${descriptorHiddenOnMobile ? 'brand-descriptor--mobile-hidden' : ''}`}>
				{descriptor}
			</span>
		{/if}
	</span>
{:else}
	<div class={`brand brand--${size}`}>
		<span class="brand-name">Receipts</span>
		{#if descriptor}
			<span class={`brand-descriptor ${descriptorHiddenOnMobile ? 'brand-descriptor--mobile-hidden' : ''}`}>
				{descriptor}
			</span>
		{/if}
	</div>
{/if}

<style>
	.brand {
		display: inline-flex;
		flex-direction: column;
		gap: 0.28rem;
		min-width: 0;
		text-decoration: none;
	}

	.brand-name {
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 500;
		line-height: 0.96;
		letter-spacing: -0.02em;
		color: var(--color-ink);
		transition: color 0.18s ease;
	}

	.brand-descriptor {
		font-size: 0.6875rem;
		font-weight: 600;
		line-height: 1.15;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	a.brand:hover .brand-name {
		color: var(--color-brand-strong);
	}

	a.brand:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--color-brand) 26%, transparent);
		outline-offset: 0.3rem;
		border-radius: 0.5rem;
	}

	.brand--sm {
		gap: 0.22rem;
	}

	.brand--sm .brand-name {
		font-size: 1.05rem;
	}

	.brand--md .brand-name {
		font-size: 1.22rem;
	}

	.brand--lg .brand-name {
		font-size: 1.45rem;
	}

	.brand--hero .brand-name {
		font-size: clamp(3rem, 9vw, 4.2rem);
		line-height: 0.92;
		letter-spacing: -0.035em;
	}

	.brand--hero .brand-descriptor {
		font-size: 0.75rem;
	}

	@media (max-width: 640px) {
		.brand-descriptor--mobile-hidden {
			display: none;
		}
	}
</style>
