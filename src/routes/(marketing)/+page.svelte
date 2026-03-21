<svelte:head>
	<title>receipts.cv — Prove your worth. Show your receipts.</title>
	<meta
		name="description"
		content="Log your day in plain language. receipts turns your work notes into a structured career record — ready for 1-on-1s, performance reviews, and raise conversations."
	/>
</svelte:head>

<script lang="ts">
	import { reveal } from '$lib/actions/reveal.js';
</script>

<!-- ══════════════════════════════════════ HERO ══════════════════════════════════════ -->
<section class="mx-auto max-w-6xl px-6 pb-28 pt-32 text-center">
	<!-- Eyebrow -->
	<p
		class="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[0.6875rem] font-medium tracking-[0.12em] text-muted"
	>
		<span class="h-1.5 w-1.5 rounded-full bg-brand"></span>
		Career documentation for individual contributors
	</p>

	<!-- Headline -->
	<h1
		class="animate-fade-up mx-auto mt-7 max-w-[820px] font-display text-5xl text-ink sm:text-6xl lg:text-7xl"
		style="animation-delay: 0.1s; line-height: 1.15; letter-spacing: -0.01em"
	>
		Keep the proof while the work is still fresh.
	</h1>

	<!-- Subtext -->
	<p
		class="animate-fade-up mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
		style="animation-delay: 0.2s"
	>
		Log your day in plain language. We structure it into a searchable career record — ready for
		1-on-1s, reviews, and raise conversations.
	</p>

	<!-- CTAs -->
	<div
		class="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3"
		style="animation-delay: 0.3s"
	>
		<a
			href="/login"
			class="rounded-xl bg-brand px-7 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-md active:translate-y-0"
		>
			Get started — it's free
		</a>
		<a
			href="#how-it-works"
			class="inline-flex items-center gap-1.5 rounded-xl border border-border px-7 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-brand/50 hover:text-brand"
		>
			See how it works
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
				<path
					d="M7 2.5v9M3.5 8l3.5 3.5L10.5 8"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	</div>

	<!-- ─────────────────── Product Mockup Card ─────────────────── -->
	<div
		class="animate-fade-up relative mx-auto mt-20 max-w-2xl overflow-hidden"
		style="animation-delay: 0.5s"
	>
		<!-- Subtle glow behind card -->
		<div
			class="absolute -inset-px rounded-3xl bg-gradient-to-b from-brand-muted/40 to-transparent blur-xl"
			aria-hidden="true"
		></div>

		<div class="mockup-card relative overflow-hidden rounded-2xl border border-border bg-surface p-6 text-left">
			<!-- Card header -->
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div class="flex items-center gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
							<path
								d="M7 2l1.2 2.8L11 6 8.2 7.2 7 10 5.8 7.2 3 6l2.8-1.2L7 2z"
								fill="#0d9488"
							/>
						</svg>
					</div>
					<div>
						<p class="text-[11px] font-medium uppercase tracking-wider text-muted">
							AI Structured
						</p>
						<p class="text-xs text-muted">Mon, Mar 17, 2025</p>
					</div>
				</div>
				<div class="flex flex-wrap gap-1.5">
					<span class="rounded-md bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
						onboarding
					</span>
					<span class="rounded-md bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
						Q2 planning
					</span>
				</div>
			</div>

			<!-- Summary -->
			<p class="mt-4 text-base font-medium leading-snug text-ink">
				Shipped the new onboarding flow and unblocked two teammates on the auth rewrite
			</p>

			<!-- Two-column body -->
			<div class="mt-4 grid gap-3 sm:grid-cols-2">
				<!-- Tasks -->
				<div class="rounded-xl bg-canvas p-4">
					<p class="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
						Tasks completed
					</p>
					<ul class="mt-3 space-y-2.5">
						<li class="flex items-start gap-2.5 text-sm text-ink">
							<span
								class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-muted"
							>
								<svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
									<path
										d="M1.5 4l2 2L6.5 2"
										stroke="#0d9488"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							Merged PR #234 — onboarding modal redesign
						</li>
						<li class="flex items-start gap-2.5 text-sm text-ink">
							<span
								class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-muted"
							>
								<svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
									<path
										d="M1.5 4l2 2L6.5 2"
										stroke="#0d9488"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							Wrote design handoff doc for Q2 auth feature
						</li>
						<li class="flex items-start gap-2.5 text-sm text-ink">
							<span
								class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-muted"
							>
								<svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
									<path
										d="M1.5 4l2 2L6.5 2"
										stroke="#0d9488"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							Unblocked two teammates stuck on auth flow
						</li>
					</ul>
				</div>

				<!-- Impact + Skills -->
				<div class="rounded-xl bg-canvas p-4">
					<p class="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Impact</p>
					<p class="mt-3 text-sm leading-relaxed text-ink">
						Activation flow expected to improve 7-day retention by ~15%
					</p>
					<div class="mt-3 border-t border-border pt-3">
						<p class="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
							Skills demonstrated
						</p>
						<div class="mt-2 flex flex-wrap gap-1.5">
							<span class="rounded-full bg-canvas px-2.5 py-0.5 text-xs text-ink-2">
								leadership
							</span>
							<span class="rounded-full bg-canvas px-2.5 py-0.5 text-xs text-ink-2">
								collaboration
							</span>
							<span class="rounded-full bg-canvas px-2.5 py-0.5 text-xs text-ink-2">
								technical writing
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- AI footer note -->
			<div class="mt-4 flex items-center gap-2.5 rounded-xl border border-border/60 bg-canvas px-4 py-2.5">
				<div
					class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white"
				>
					<svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
						<path
							d="M4.5 1l1 2.4L8 4.5 5.5 5.5 4.5 8 3.5 5.5 1 4.5 3.5 3.5 4.5 1z"
							fill="currentColor"
						/>
					</svg>
				</div>
				<p class="text-xs text-muted">
					Structured automatically from 2 sentences of plain-language notes
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════ FEATURES ══════════════════════════════════════ -->
<section class="mx-auto max-w-6xl px-6 py-20">
	<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Feature 1 -->
		<div
		data-reveal
		use:reveal
		class="rounded-2xl border border-border bg-surface p-7 transition-shadow duration-300 hover:shadow-md"
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
					<path
						d="M13 2.5a2 2 0 012.8 2.8L4.5 16.5H2v-2.5L13 2.5z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<h3 class="mt-5 text-base font-semibold text-ink">Write without structure</h3>
			<p class="mt-2 text-sm leading-relaxed text-muted">
				No templates. No fields to fill. Just type what you did today in plain English — the
				structure comes after, automatically.
			</p>
		</div>

		<!-- Feature 2 -->
		<div
			data-reveal
			use:reveal
			class="rounded-2xl border border-border bg-surface p-7 transition-shadow duration-300 hover:shadow-md"
			style="transition-delay: 0.08s"
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
					<path
						d="M9 2l1.5 3.5L14 7l-3.5 1.5L9 12l-1.5-3.5L4 7l3.5-1.5L9 2z"
						stroke="currentColor"
						stroke-width="1.4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M14.5 13l.8 1.8 1.7.7-1.7.7-.8 1.8-.8-1.8-1.7-.7 1.7-.7.8-1.8z"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<h3 class="mt-5 text-base font-semibold text-ink">AI structures it instantly</h3>
			<p class="mt-2 text-sm leading-relaxed text-muted">
				Claude extracts your tasks, skills demonstrated, and quantifiable impact. Review and
				edit anything before saving — you stay in control.
			</p>
		</div>

		<!-- Feature 3 -->
		<div
			data-reveal
			use:reveal
			class="rounded-2xl border border-border bg-surface p-7 transition-shadow duration-300 hover:shadow-md sm:col-span-2 lg:col-span-1"
			style="transition-delay: 0.16s"
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
					<rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
					<path d="M5.5 6.5h7M5.5 9h7M5.5 11.5h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
			</div>
			<h3 class="mt-5 text-base font-semibold text-ink">Walk into every meeting prepared</h3>
			<p class="mt-2 text-sm leading-relaxed text-muted">
				Generate tailored talking points for 1-on-1s, performance reviews, and raise
				conversations — backed by your actual documented work.
			</p>
		</div>
	</div>
</section>

<!-- ══════════════════════════════ HOW IT WORKS ═══════════════════════════════════════ -->
<section id="how-it-works" class="mx-auto max-w-6xl px-6 py-20">
	<!-- Section header -->
	<div class="mb-16 text-center" data-reveal use:reveal>
		<h2
			class="font-display text-4xl text-ink sm:text-5xl"
			style="letter-spacing: -0.03em; line-height: 1.08"
		>
			Three steps.<br class="sm:hidden" /> Under a minute.
		</h2>
		<p class="mx-auto mt-4 max-w-sm text-base text-muted">
			The whole habit fits in the time it takes to get your next coffee.
		</p>
	</div>

	<!-- Steps -->
	<div class="grid gap-10 sm:grid-cols-3 sm:gap-6">
		<!-- Step 1 -->
		<div data-reveal use:reveal class="flex flex-col">
			<div class="step-number font-display text-7xl text-brand/20" style="line-height: 1">1</div>
			<div class="mt-4 flex-1 rounded-2xl border border-border bg-surface p-6">
				<h3 class="text-base font-semibold text-ink">Write your day</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted">
					Open the app. Type what you worked on. No format required — a sentence or two is plenty.
				</p>
			</div>
		</div>

		<!-- Step 2 -->
		<div data-reveal use:reveal class="flex flex-col" style="transition-delay: 0.12s">
			<div class="step-number font-display text-7xl text-brand/20" style="line-height: 1">2</div>
			<div class="mt-4 flex-1 rounded-2xl border border-border bg-surface p-6">
				<h3 class="text-base font-semibold text-ink">Review the structure</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted">
					AI instantly organizes your notes into tasks, skills, impact, and tags. Edit anything
					before saving.
				</p>
			</div>
		</div>

		<!-- Step 3 -->
		<div data-reveal use:reveal class="flex flex-col" style="transition-delay: 0.24s">
			<div class="step-number font-display text-7xl text-brand/20" style="line-height: 1">3</div>
			<div class="mt-4 flex-1 rounded-2xl border border-border bg-surface p-6">
				<h3 class="text-base font-semibold text-ink">Generate talking points</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted">
					Before any meeting, generate a polished summary of your contributions. One click.
					Ready to paste.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ══════════════════════════════════ FINAL CTA ══════════════════════════════════════ -->
<section class="mx-auto max-w-6xl px-6 pb-24">
	<div
		data-reveal
		use:reveal
		class="rounded-3xl border border-brand-muted/70 bg-brand-soft px-8 py-20 text-center"
	>
		<h2
			class="font-display text-4xl text-ink sm:text-5xl"
			style="letter-spacing: -0.03em; line-height: 1.08"
		>
			Start building your<br />career record today.
		</h2>
		<p class="mx-auto mt-5 max-w-sm text-base text-muted">
			Free forever for the core habit. No credit card required.
		</p>
		<a
			href="/login"
			class="mt-9 inline-flex items-center rounded-xl bg-brand px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-md"
		>
			Create your free account
		</a>
		<p class="mt-5 text-xs text-muted">
			3 report generations included free every month · Pro from $10/mo
		</p>
	</div>
</section>

<style>
	/* Mockup card — teal-tinted shadow for brand cohesion */
	.mockup-card {
		box-shadow:
			0 4px 24px -6px rgba(13, 148, 136, 0.12),
			0 1px 3px rgba(0, 0, 0, 0.06),
			0 0 0 1px rgba(231, 226, 216, 0.8);
	}

	/* Step numbers — large italic display numeral */
	.step-number {
		font-style: italic;
		user-select: none;
	}
</style>
