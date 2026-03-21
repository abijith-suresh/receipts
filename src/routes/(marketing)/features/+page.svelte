<svelte:head>
	<title>Features — receipts</title>
	<meta
		name="description"
		content="Everything receipts does for your career record — plain-language logging, AI structuring, a personal timeline, and review-ready reports."
	/>
</svelte:head>

<script lang="ts">
	import { reveal } from '$lib/actions/reveal.js';
</script>

<!-- ══════════════════════════════════════ HERO ══════════════════════════════════════ -->
<section class="px-6 py-24 text-center sm:py-32">
	<!-- Eyebrow pill -->
	<p
		data-reveal
		use:reveal
		class="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[0.6875rem] font-medium tracking-[0.12em] text-muted"
	>
		<span class="h-1.5 w-1.5 rounded-full bg-brand"></span>
		Built for individual contributors
	</p>

	<!-- H1 -->
	<h1
		data-reveal
		use:reveal
		class="mx-auto mt-7 max-w-4xl font-display text-4xl text-ink sm:text-5xl lg:text-6xl"
		style="letter-spacing: -0.02em; line-height: 1.1; transition-delay: 0.1s"
	>
		Everything you need to never be caught unprepared again.
	</h1>

	<!-- Subtext -->
	<p
		data-reveal
		use:reveal
		class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted"
		style="transition-delay: 0.2s"
	>
		Two minutes a day builds a career record you can actually use — when it counts most.
	</p>

	<!-- CTAs -->
	<div
		data-reveal
		use:reveal
		class="mt-9 flex flex-wrap items-center justify-center gap-3"
		style="transition-delay: 0.3s"
	>
		<a
			href="/login"
			class="rounded-xl bg-brand px-7 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/85 hover:shadow-md active:translate-y-0"
		>
			Start for free
		</a>
		<a
			href="/pricing"
			class="rounded-xl border border-border px-7 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-brand/50 hover:text-brand"
		>
			See pricing
		</a>
	</div>
</section>

<!-- ══════════════════════════ FEATURE A — Log in plain English ═══════════════════════ -->
<div class="bg-surface">
	<div class="mx-auto max-w-6xl px-6 py-20">
		<div
			data-reveal
			use:reveal
			class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20"
		>
			<!-- Text: left -->
			<div>
				<p class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-brand-strong">
					01 — Capture
				</p>
				<h2
					class="mt-4 font-display text-3xl text-ink sm:text-4xl"
					style="letter-spacing: -0.02em; line-height: 1.15"
				>
					Just write what you did. No template required.
				</h2>
				<p class="mt-5 text-base leading-relaxed text-muted">
					Open naturally, write a sentence or two. No fields, no forms, no friction.
				</p>
				<p class="mt-3 text-base leading-relaxed text-muted">
					The simpler the habit, the more likely you'll keep it.
				</p>
				<ul class="mt-7 space-y-3">
					<li class="flex items-center gap-3 text-sm text-ink">
						<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-muted">
							<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
								<path d="M2 5l2.5 2.5L8 3" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</span>
						Works on any device
					</li>
					<li class="flex items-center gap-3 text-sm text-ink">
						<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-muted">
							<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
								<path d="M2 5l2.5 2.5L8 3" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</span>
						Takes under 2 minutes
					</li>
					<li class="flex items-center gap-3 text-sm text-ink">
						<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-muted">
							<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
								<path d="M2 5l2.5 2.5L8 3" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</span>
						No format or structure needed
					</li>
				</ul>
			</div>

			<!-- Visual: right — fake text editor -->
			<div class="visual-card rounded-2xl border border-border bg-surface p-5">
				<!-- Editor header -->
				<div class="mb-4 flex items-center justify-between">
					<div>
						<p class="text-xs font-semibold text-ink">Log today's work</p>
						<p class="mt-0.5 text-[11px] text-muted">Mon, Mar 17, 2025</p>
					</div>
					<div class="flex gap-1.5" aria-hidden="true">
						<span class="h-2.5 w-2.5 rounded-full bg-red-300/70"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-yellow-300/70"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-green-300/70"></span>
					</div>
				</div>
				<!-- Textarea-style area -->
				<div class="min-h-[120px] rounded-xl border border-border bg-canvas p-4">
					<p class="font-mono text-sm leading-relaxed text-ink">
						Shipped the billing retry fix. Reviewed two PRs for the auth rewrite. Finally got sign-off on the Q2 design spec after three rounds of feedback.
					</p>
					<span class="mt-1 inline-block h-4 w-0.5 animate-pulse bg-brand"></span>
				</div>
				<!-- Save button -->
				<div class="mt-4 flex items-center justify-between">
					<p class="text-[11px] text-muted">3 sentences · ~30 seconds</p>
					<button
						type="button"
						class="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-brand/85"
					>
						Save entry →
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- ═══════════════════════════ FEATURE B — AI structures it ══════════════════════════ -->
<div class="bg-canvas">
	<div class="mx-auto max-w-6xl px-6 py-20">
		<div
			data-reveal
			use:reveal
			class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20"
		>
			<!-- Visual: left on desktop -->
			<div class="lg:order-first">
				<!-- Before → After cards -->
				<div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
					<!-- Before card -->
					<div class="w-full rounded-xl border border-border bg-surface p-4 sm:flex-1">
						<p class="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted">Before</p>
						<p class="font-mono text-xs leading-relaxed text-ink">
							"Shipped the billing retry fix. Reviewed 2 PRs."
						</p>
					</div>

					<!-- Arrow -->
					<div class="flex shrink-0 items-center justify-center">
						<!-- Horizontal arrow (sm+) -->
						<svg class="hidden text-muted sm:block" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
							<path d="M6 14h16M16 8l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<!-- Vertical arrow (mobile) -->
						<svg class="text-muted sm:hidden" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
							<path d="M14 6v16M8 16l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>

					<!-- After card -->
					<div class="w-full rounded-xl border border-brand-muted bg-brand-soft p-4 sm:flex-1">
						<p class="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-brand-strong">After</p>
						<div class="space-y-2.5">
							<div>
								<p class="text-[10px] font-semibold text-muted uppercase tracking-wider">Tasks</p>
								<ul class="mt-1 space-y-1">
									<li class="flex items-center gap-1.5 text-xs text-ink">
										<span class="text-brand">✓</span> Fixed billing retry
									</li>
									<li class="flex items-center gap-1.5 text-xs text-ink">
										<span class="text-brand">✓</span> Reviewed 2 PRs
									</li>
								</ul>
							</div>
							<div class="border-t border-brand-muted/60 pt-2.5">
								<p class="text-[10px] font-semibold text-muted uppercase tracking-wider">Skills</p>
								<p class="mt-1 text-xs text-ink">problem-solving, code review</p>
							</div>
							<div class="border-t border-brand-muted/60 pt-2.5">
								<p class="text-[10px] font-semibold text-muted uppercase tracking-wider">Impact</p>
								<p class="mt-1 text-xs text-ink">Unblocked 2 teammates</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Text: right -->
			<div>
				<p class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-brand-strong">
					02 — Structure
				</p>
				<h2
					class="mt-4 font-display text-3xl text-ink sm:text-4xl"
					style="letter-spacing: -0.02em; line-height: 1.15"
				>
					Two sentences in. A structured entry out.
				</h2>
				<p class="mt-5 text-base leading-relaxed text-muted">
					Claude reads your raw note and extracts tasks you completed, skills you demonstrated, and quantifiable impact.
				</p>
				<p class="mt-3 text-base leading-relaxed text-muted">
					You review, edit, and confirm — you stay in control of your record.
				</p>
			</div>
		</div>
	</div>
</div>

<!-- ════════════════════════ FEATURE C — Searchable timeline ═════════════════════════ -->
<div class="bg-surface">
	<div class="mx-auto max-w-6xl px-6 py-20">
		<div
			data-reveal
			use:reveal
			class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20"
		>
			<!-- Text: left -->
			<div>
				<p class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-brand-strong">
					03 — Remember
				</p>
				<h2
					class="mt-4 font-display text-3xl text-ink sm:text-4xl"
					style="letter-spacing: -0.02em; line-height: 1.15"
				>
					Every day, documented. Always searchable.
				</h2>
				<p class="mt-5 text-base leading-relaxed text-muted">
					Your entries build into a private timeline — filtered by date, project, or skill.
				</p>
				<p class="mt-3 text-base leading-relaxed text-muted">
					Never lose a win or forget a hard-won lesson.
				</p>
			</div>

			<!-- Visual: right — stacked entry cards -->
			<div class="space-y-3">
				<!-- Card 1 -->
				<div class="entry-card rounded-xl border border-border bg-surface p-4 transition-transform duration-200 hover:-translate-y-0.5">
					<p class="text-[10px] font-semibold uppercase tracking-widest text-brand-strong">Mar 17, 2025</p>
					<p class="mt-1.5 font-display text-base text-ink" style="line-height: 1.3">
						Shipped new onboarding flow
					</p>
					<p class="mt-1.5 text-sm leading-relaxed text-muted">
						Merged PR #234. Unblocked two teammates on auth rewrite.
					</p>
				</div>

				<!-- Card 2 -->
				<div class="entry-card rounded-xl border border-border bg-surface p-4 transition-transform duration-200 hover:-translate-y-0.5">
					<p class="text-[10px] font-semibold uppercase tracking-widest text-brand-strong">Mar 14, 2025</p>
					<p class="mt-1.5 font-display text-base text-ink" style="line-height: 1.3">
						Q2 planning session with design
					</p>
					<p class="mt-1.5 text-sm leading-relaxed text-muted">
						Finalized roadmap priorities. Got consensus on v2 scope.
					</p>
				</div>

				<!-- Card 3 -->
				<div class="entry-card rounded-xl border border-border bg-surface p-4 transition-transform duration-200 hover:-translate-y-0.5">
					<p class="text-[10px] font-semibold uppercase tracking-widest text-brand-strong">Mar 11, 2025</p>
					<p class="mt-1.5 font-display text-base text-ink" style="line-height: 1.3">
						Performance review prep
					</p>
					<p class="mt-1.5 text-sm leading-relaxed text-muted">
						Generated talking points. 12 PRs merged this quarter.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- ═════════════════════════ FEATURE D — Review-ready reports ═══════════════════════ -->
<div class="bg-canvas">
	<div class="mx-auto max-w-6xl px-6 py-20">
		<div
			data-reveal
			use:reveal
			class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20"
		>
			<!-- Visual: left on desktop -->
			<div class="lg:order-first">
				<div class="visual-card rounded-2xl border border-border bg-surface p-5">
					<!-- Report header -->
					<div class="mb-5 flex items-start justify-between gap-3">
						<div>
							<p class="text-sm font-semibold text-ink">Q1 2026 Performance Summary</p>
							<p class="mt-0.5 text-xs text-muted">Jan 1 – Mar 31, 2026</p>
						</div>
						<span class="shrink-0 rounded-md bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand">
							Generated
						</span>
					</div>

					<!-- Bullet list -->
					<ul class="space-y-3">
						<li class="flex items-start gap-2.5 text-sm text-ink">
							<span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-muted">
								<svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
									<path d="M1.5 4l2 2L6.5 2" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</span>
							Shipped 12 PRs including the onboarding redesign
						</li>
						<li class="flex items-start gap-2.5 text-sm text-ink">
							<span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-muted">
								<svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
									<path d="M1.5 4l2 2L6.5 2" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</span>
							Unblocked 4 teammates on the auth rewrite
						</li>
						<li class="flex items-start gap-2.5 text-sm text-ink">
							<span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-muted">
								<svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
									<path d="M1.5 4l2 2L6.5 2" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</span>
							Led the Q2 roadmap planning session
						</li>
						<li class="flex items-start gap-2.5 text-sm text-ink">
							<span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-muted">
								<svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
									<path d="M1.5 4l2 2L6.5 2" stroke="#0d9488" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</span>
							Reduced billing retry failures by 30%
						</li>
					</ul>

					<!-- Footer action -->
					<div class="mt-5 border-t border-border pt-4">
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-ink transition-all hover:border-brand/50 hover:text-brand"
						>
							<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
								<rect x="1.5" y="3" width="7" height="8.5" rx="1" stroke="currentColor" stroke-width="1.2"/>
								<path d="M3.5 1.5h7a.5.5 0 01.5.5v8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
							</svg>
							Copy talking points
						</button>
					</div>
				</div>
			</div>

			<!-- Text: right -->
			<div>
				<p class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-brand-strong">
					04 — Present
				</p>
				<h2
					class="mt-4 font-display text-3xl text-ink sm:text-4xl"
					style="letter-spacing: -0.02em; line-height: 1.15"
				>
					Generate talking points in one click.
				</h2>
				<p class="mt-5 text-base leading-relaxed text-muted">
					Before any meeting — 1-on-1, performance review, or raise conversation — generate a polished summary of your contributions, backed by documented evidence.
				</p>
			</div>
		</div>
	</div>
</div>

<!-- ════════════════════════════════════ FINAL CTA ══════════════════════════════════ -->
<div class="px-6 py-16">
	<div
		data-reveal
		use:reveal
		class="cta-panel mx-auto max-w-4xl rounded-3xl border border-brand-muted/70 bg-brand-soft py-20 text-center"
	>
		<h2
			class="font-display text-4xl text-ink sm:text-5xl"
			style="letter-spacing: -0.02em; line-height: 1.1"
		>
			Ready to start building your record?
		</h2>
		<p class="mx-auto mt-5 max-w-sm text-base text-muted">
			Free forever for the core habit.
		</p>
		<a
			href="/login"
			class="mt-9 inline-flex items-center rounded-xl bg-brand px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/85 hover:shadow-md"
		>
			Create your free account
		</a>
		<p class="mt-5 text-xs text-muted">
			3 AI report generations/month included free · Pro from $10/mo
		</p>
	</div>
</div>

<style>
	/* Polished shadow on feature visual cards */
	.visual-card {
		box-shadow:
			0 4px 24px -6px rgba(13, 148, 136, 0.10),
			0 1px 3px rgba(0, 0, 0, 0.05),
			0 0 0 1px rgba(231, 226, 216, 0.8);
	}

	/* Subtle elevation for entry cards */
	.entry-card {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}
	.entry-card:hover {
		box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08);
	}
</style>
