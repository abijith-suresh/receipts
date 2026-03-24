<script lang="ts">
	import { browser } from '$app/environment';

	import BrandWordmark from '$lib/components/BrandWordmark.svelte';

	let { error, status } = $props<{
		error: App.Error & { message?: string };
		status: number;
	}>();

	const isNotFound = $derived(status === 404);
	const title = $derived(isNotFound ? 'Page not found.' : 'We hit a snag.');
	const description = $derived(
		isNotFound
			? "The page you're looking for doesn't exist or may have moved."
			: 'Something unexpected happened. You can head back home or try again.',
	);

	function handleRetry() {
		if (browser) {
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title>{isNotFound ? 'Page not found - receipts.cv' : 'Something went wrong - receipts.cv'}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="error-page">
	<div class="error-shell">
		<div class="error-card">
			<p class="error-eyebrow">
				<span class="eyebrow-dot"></span>
				{isNotFound ? '404' : 'Something went wrong'}
			</p>

			<div class="brand-wrap">
				<BrandWordmark href="/" size="lg" descriptor="Your private proof of work" />
			</div>

			<h1 class="error-title">{title}</h1>
			<p class="error-copy">{description}</p>

			{#if !isNotFound && error?.message}
				<p class="error-detail">{error.message}</p>
			{/if}

			<div class="error-actions">
				{#if isNotFound}
					<a href="/" class="cta cta-primary">Go home</a>
				{:else}
					<button type="button" class="cta cta-primary" onclick={handleRetry}>Try again</button>
				{/if}
				<a href="/login" class="cta cta-secondary">Go to sign in</a>
			</div>

			<a href="/features" class="error-link">Explore features</a>
		</div>
	</div>
</section>

<style>
	.error-page {
		min-height: 100vh;
		background-color: var(--color-canvas);
	}

	.error-shell {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem 1.5rem;
	}

	.error-card {
		width: 100%;
		max-width: 34rem;
		border-radius: 2rem;
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		padding: 2rem;
		text-align: center;
		box-shadow: 0 24px 60px -42px rgba(15, 23, 42, 0.24);
	}

	@media (min-width: 640px) {
		.error-card {
			padding: 2.5rem;
		}
	}

	.error-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		border-radius: 9999px;
		border: 1px solid var(--color-border);
		background-color: var(--color-canvas);
		padding: 0.375rem 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.eyebrow-dot {
		display: block;
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 9999px;
		background-color: var(--color-brand);
		flex-shrink: 0;
	}

	.brand-wrap {
		margin-top: 1.5rem;
		display: flex;
		justify-content: center;
	}

	.error-title {
		margin: 1.5rem 0 0;
		font-family: var(--font-display);
		font-size: clamp(2.25rem, 7vw, 3.25rem);
		line-height: 1.02;
		letter-spacing: -0.03em;
		color: var(--color-ink);
	}

	.error-copy {
		margin: 1rem auto 0;
		max-width: 28rem;
		font-size: 1rem;
		line-height: 1.7;
		color: var(--color-muted);
	}

	.error-detail {
		margin: 1rem auto 0;
		max-width: 26rem;
		border-radius: 0.9rem;
		background: color-mix(in srgb, var(--color-canvas) 85%, var(--color-brand-soft) 15%);
		padding: 0.85rem 1rem;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-ink-2);
	}

	.error-actions {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.error-actions {
			flex-direction: row;
			justify-content: center;
		}
	}

	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.9rem;
		padding: 0.85rem 1.4rem;
		border-radius: 0.9rem;
		font-size: 0.9375rem;
		font-weight: 600;
		text-decoration: none;
		transition:
			transform 0.15s ease,
			background-color 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.cta-primary {
		border: none;
		background-color: var(--color-brand);
		color: #fff;
		box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
		cursor: pointer;
	}

	.cta-primary:hover {
		background-color: var(--color-brand-strong);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
	}

	.cta-secondary {
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		color: var(--color-ink);
	}

	.cta-secondary:hover {
		border-color: color-mix(in srgb, var(--color-brand) 45%, var(--color-border));
		color: var(--color-brand-strong);
		transform: translateY(-1px);
	}

	.error-link {
		display: inline-flex;
		margin-top: 1.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-brand);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.error-link:hover {
		color: var(--color-brand-strong);
	}
</style>
