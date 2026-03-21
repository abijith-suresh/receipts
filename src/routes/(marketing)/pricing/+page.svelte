<svelte:head>
	<title>Pricing — receipts</title>
	<meta
		name="description"
		content="Simple, honest pricing. Free forever for the core habit. Upgrade to Pro for unlimited AI report generation."
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('revealed');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
		);

		document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	});
</script>

<!-- ══════════════════════════════════════ HERO ══════════════════════════════════════ -->
<section class="mx-auto max-w-6xl px-6 py-20 text-center">
	<h1
		data-reveal
		class="mx-auto font-display text-4xl text-ink sm:text-5xl"
		style="letter-spacing: -0.02em; line-height: 1.1"
	>
		Simple, honest pricing.
	</h1>
	<p data-reveal class="mx-auto mt-5 max-w-sm text-base leading-relaxed text-muted" style="transition-delay: 0.1s">
		Start free. Upgrade when you outgrow the 3 monthly reports.
	</p>
</section>

<!-- ══════════════════════════════════ PRICING CARDS ═════════════════════════════════ -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl mx-auto px-6 pb-16">

	<!-- Free card -->
	<div class="rounded-2xl border border-border bg-surface p-8">
		<p class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">Free</p>
		<div class="mt-4 flex items-end gap-1.5">
			<span class="font-display text-5xl text-ink" style="line-height: 1">$0</span>
			<span class="mb-1 text-lg text-muted">/month</span>
		</div>
		<p class="mt-4 text-sm leading-relaxed text-muted">
			Everything you need to build the daily logging habit.
		</p>
		<a
			href="/sign-up"
			class="mt-6 block w-full rounded-xl bg-ink py-3 text-center text-sm font-medium text-white transition-colors duration-150 hover:bg-zinc-700"
		>
			Get started free
		</a>
		<ul class="mt-7 space-y-3">
			<li class="flex items-start gap-3 text-sm text-ink">
				<svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				Unlimited daily logging
			</li>
			<li class="flex items-start gap-3 text-sm text-ink">
				<svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				Unlimited timeline storage
			</li>
			<li class="flex items-start gap-3 text-sm text-ink">
				<svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				3 AI report generations per month
			</li>
			<li class="flex items-start gap-3 text-sm text-ink">
				<svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				Private, encrypted entries
			</li>
		</ul>
	</div>

	<!-- Pro card -->
	<div class="relative rounded-2xl border border-brand/40 bg-surface p-8 ring-1 ring-brand/20">
		<!-- Most popular badge -->
		<span class="absolute right-5 top-5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
			Most popular
		</span>

		<p class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-brand-strong">Pro</p>
		<div class="mt-4 flex items-end gap-1.5">
			<span class="font-display text-5xl text-ink" style="line-height: 1">$10</span>
			<span class="mb-1 text-lg text-muted">/month</span>
		</div>
		<p class="mt-4 text-sm leading-relaxed text-muted">
			For people serious about their career record.
		</p>
		<a
			href="/sign-up"
			class="mt-6 block w-full rounded-xl bg-brand py-3 text-center text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-strong"
		>
			Get started with Pro
		</a>
		<ul class="mt-7 space-y-3">
			<li class="flex items-start gap-3 text-sm text-ink">
				<svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				Everything in Free
			</li>
			<li class="flex items-start gap-3 text-sm text-ink">
				<svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<span><strong>Unlimited</strong> AI report generations</span>
			</li>
			<li class="flex items-start gap-3 text-sm text-ink">
				<svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				Priority support
			</li>
			<li class="flex items-start gap-3 text-sm text-ink">
				<svg class="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				Early access to new features
			</li>
		</ul>
	</div>
</div>

<!-- ══════════════════════════════ FEATURE COMPARISON ════════════════════════════════ -->
<div class="max-w-3xl mx-auto px-6 pb-16">
	<div class="overflow-hidden rounded-2xl border border-border">
		<!-- Header row -->
		<div class="grid grid-cols-3 bg-canvas px-6 py-3.5">
			<span class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">Feature</span>
			<span class="text-center text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">Free</span>
			<span class="text-center text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-brand-strong">Pro</span>
		</div>

		<!-- Rows -->
		{#each [
			{ feature: 'Daily logging', free: '✓', pro: '✓' },
			{ feature: 'Timeline storage', free: '✓', pro: '✓' },
			{ feature: 'AI reports', free: '3/month', pro: 'Unlimited' },
			{ feature: 'Priority support', free: '—', pro: '✓' },
			{ feature: 'Early access', free: '—', pro: '✓' },
		] as row, i}
			<div class="grid grid-cols-3 items-center border-t border-border px-6 py-4 {i % 2 === 0 ? 'bg-surface' : 'bg-canvas/60'}">
				<span class="text-sm text-ink">{row.feature}</span>
				<span class="text-center text-sm {row.free === '—' ? 'text-muted' : row.free === '✓' ? 'text-brand font-medium' : 'text-ink'}">{row.free}</span>
				<span class="text-center text-sm font-medium {row.pro === '—' ? 'text-muted' : 'text-brand'}">{row.pro}</span>
			</div>
		{/each}
	</div>
</div>

<!-- ═══════════════════════════════════════ FAQ ══════════════════════════════════════ -->
<div class="max-w-2xl mx-auto px-6 pb-16">
	<h2 class="mb-6 text-base font-semibold text-ink">Common questions</h2>

	<details>
		<summary>Can I cancel anytime?</summary>
		<div class="answer">
			Yes, cancel from your settings page — no questions asked. Your logged data stays with you and remains accessible.
		</div>
	</details>

	<details>
		<summary>What counts as an AI report generation?</summary>
		<div class="answer">
			Each time you ask AI to structure an entry or generate talking points counts as one generation. Reviewing or editing a previously generated result does not count.
		</div>
	</details>

	<details>
		<summary>Is my data private?</summary>
		<div class="answer">
			Yes. Your entries are private to you by default. We never use your data for AI model training, and no one else can see your entries.
		</div>
	</details>
</div>

<!-- ══════════════════════════════════ FINAL CTA ══════════════════════════════════════ -->
<div class="mx-6 mb-16 max-w-6xl lg:mx-auto">
	<div
		data-reveal
		class="rounded-3xl border border-brand-muted/70 bg-brand-soft px-8 py-16 text-center"
	>
		<h2
			class="font-display text-3xl text-ink"
			style="letter-spacing: -0.02em; line-height: 1.1"
		>
			Start building your receipt habit today.
		</h2>
		<p class="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
			Free forever for the core habit. No credit card required.
		</p>
		<a
			href="/sign-up"
			class="mt-8 inline-flex items-center rounded-xl bg-brand px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-md"
		>
			Create free account
		</a>
	</div>
</div>

<style>
	details {
		border-bottom: 1px solid var(--color-border);
	}

	details:first-of-type {
		border-top: 1px solid var(--color-border);
	}

	summary {
		cursor: pointer;
		list-style: none;
		padding: 1.25rem 0;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-ink);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary::after {
		content: '+';
		font-size: 1.25rem;
		font-weight: 300;
		color: var(--color-muted);
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	details[open] > summary::after {
		content: '−';
	}

	.answer {
		padding-bottom: 1.25rem;
		font-size: 0.9375rem;
		line-height: 1.75;
		color: var(--color-muted);
	}
</style>
