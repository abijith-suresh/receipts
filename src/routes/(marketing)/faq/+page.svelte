<svelte:head>
	<title>FAQ — receipts</title>
	<meta
		name="description"
		content="Common questions about receipts — how it works, your data, billing, and more."
	/>
</svelte:head>

<!-- ══════════════════════════════════════ HERO ══════════════════════════════════════ -->
<section class="mx-auto max-w-6xl px-6 py-20 pb-12 text-center">
	<h1
		class="mx-auto font-display text-4xl text-ink sm:text-5xl"
		style="letter-spacing: -0.02em; line-height: 1.1"
	>
		Frequently asked questions.
	</h1>
	<p class="mx-auto mt-5 max-w-sm text-base leading-relaxed text-muted">
		Everything you need to know before you start.
	</p>
</section>

<!-- ══════════════════════════════════ FAQ ACCORDION ═════════════════════════════════ -->
<div class="max-w-2xl mx-auto px-6 pb-20">

	<!-- Category: About the product -->
	<p class="category-label">About the product</p>

	<details>
		<summary>What is receipts?</summary>
		<div class="answer">
			receipts is a private daily work journal for professionals. You write what you worked on
			in plain English — AI structures it into tasks, skills, and impact. Over time, your entries
			build a searchable career record you can use in performance reviews, raise conversations,
			and 1-on-1s.
		</div>
	</details>

	<details>
		<summary>Who is this for?</summary>
		<div class="answer">
			Primarily individual contributors — engineers, designers, product managers, and anyone who
			wants a concrete record of their work. If you've ever been asked "what have you been working
			on?" and struggled to remember, receipts is for you.
		</div>
	</details>

	<details>
		<summary>Does it work on mobile?</summary>
		<div class="answer">
			Yes. The web app is fully responsive and works well on any device. A dedicated mobile app
			is on the roadmap.
		</div>
	</details>

	<!-- Category: Your data & privacy -->
	<p class="category-label mt-10">Your data &amp; privacy</p>

	<details>
		<summary>Is my data private?</summary>
		<div class="answer">
			Yes. Your entries are private to you by default — no one else can see them. We never use
			your data for AI model training.
		</div>
	</details>

	<details>
		<summary>How is my data stored?</summary>
		<div class="answer">
			Your data is stored securely using Convex, a real-time cloud database. All data is
			encrypted at rest and in transit.
		</div>
	</details>

	<details>
		<summary>Can I export my data?</summary>
		<div class="answer">
			Export functionality is on the Pro roadmap. Until then, you can always copy your entries
			from the timeline.
		</div>
	</details>

	<!-- Category: Billing -->
	<p class="category-label mt-10">Billing</p>

	<details>
		<summary>What's included in the free plan?</summary>
		<div class="answer">
			The free plan includes unlimited daily logging, unlimited timeline storage, and 3 AI report
			generations per month. That's enough to build the habit.
		</div>
	</details>

	<details>
		<summary>How do I upgrade to Pro?</summary>
		<div class="answer">
			From your settings page, you can upgrade to Pro for $10/month. You can cancel anytime.
		</div>
	</details>

	<details>
		<summary>Can I cancel my Pro subscription?</summary>
		<div class="answer">
			Yes, cancel anytime from settings. You won't be charged again, and you'll keep access until
			the end of the billing period.
		</div>
	</details>
</div>

<!-- ══════════════════════════════════ BOTTOM CTA ═════════════════════════════════════ -->
<div class="mx-6 mb-16 max-w-6xl lg:mx-auto">
	<div class="rounded-3xl border border-brand-muted/70 bg-brand-soft px-8 py-16 text-center">
		<h2
			class="font-display text-3xl text-ink"
			style="letter-spacing: -0.02em; line-height: 1.1"
		>
			Still have questions?
		</h2>
		<p class="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
			We're happy to help. Reach out or dive straight in — the free plan has no credit card
			required.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="mailto:hello@receipts.cv"
				class="rounded-xl border border-border bg-surface px-7 py-3 text-sm font-medium text-ink transition-colors duration-150 hover:border-brand/50 hover:text-brand"
			>
				Email us
			</a>
			<a
				href="/sign-up"
				class="inline-flex items-center rounded-xl bg-brand px-7 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-md"
			>
				Start for free
			</a>
		</div>
	</div>
</div>

<style>
	.category-label {
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-muted);
		margin-bottom: 0.25rem;
	}

	details {
		border-bottom: 1px solid var(--color-border);
	}

	details:first-of-type {
		border-top: 1px solid var(--color-border);
	}

	/* Reset first-of-type for grouped sections — target the first details after each label */
	.category-label + details {
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
