<svelte:head>
	<title>FAQ — receipts</title>
	<meta
		name="description"
		content="Common questions about receipts — how it works, your data, billing, and more."
	/>
</svelte:head>

<script lang="ts">
	import Accordion from '$lib/components/ui/Accordion.svelte';
</script>

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

	<Accordion question="What is receipts?">
		receipts is a private daily work journal for professionals. You write what you worked on
		in plain English — AI structures it into tasks, skills, and impact. Over time, your entries
		build a searchable career record you can use in performance reviews, raise conversations,
		and 1-on-1s.
	</Accordion>

	<Accordion question="Who is this for?">
		Primarily individual contributors — engineers, designers, product managers, and anyone who
		wants a concrete record of their work. If you've ever been asked "what have you been working
		on?" and struggled to remember, receipts is for you.
	</Accordion>

	<Accordion question="Does it work on mobile?">
		Yes. The web app is fully responsive and works well on any device. A dedicated mobile app
		is on the roadmap.
	</Accordion>

	<!-- Category: Your data & privacy -->
	<p class="category-label mt-10">Your data &amp; privacy</p>

	<Accordion question="Is my data private?">
		Yes. Your entries are private to you by default — no one else can see them. We never use
		your data for AI model training.
	</Accordion>

	<Accordion question="How is my data stored?">
		Your data is stored securely using Convex, a real-time cloud database. All data is
		encrypted at rest and in transit.
	</Accordion>

	<Accordion question="Can I export my data?">
		Export functionality is on the Pro roadmap. Until then, you can always copy your entries
		from the timeline.
	</Accordion>

	<!-- Category: Billing -->
	<p class="category-label mt-10">Billing</p>

	<Accordion question="What's included in the free plan?">
		The free plan includes unlimited daily logging, unlimited timeline storage, and 3 AI report
		generations per month. That's enough to build the habit.
	</Accordion>

	<Accordion question="How do I upgrade to Pro?">
		From your settings page, you can upgrade to Pro for $10/month. You can cancel anytime.
	</Accordion>

	<Accordion question="Can I cancel my Pro subscription?">
		Yes, cancel anytime from settings. You won't be charged again, and you'll keep access until
		the end of the billing period.
	</Accordion>
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
				href="/login"
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
</style>
