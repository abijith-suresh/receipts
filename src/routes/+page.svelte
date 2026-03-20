<svelte:head>
	<title>receipts.cv - Prove your worth. Show your receipts.</title>
</svelte:head>

<script lang="ts">
const principles = [
	'Capture work in plain language before it disappears from memory.',
	'Build a private timeline you can skim before 1-on-1s or reviews.',
	'Lay the groundwork for AI-generated talking points in later phases.',
];
</script>

<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(196,215,255,0.8),transparent_40%),linear-gradient(180deg,#f8f4eb_0%,#f5efe4_45%,#f4efe8_100%)] text-[var(--color-ink)]">
	<div class="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
		<header class="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/75 px-5 py-4 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:px-6">
			<div>
				<p class="text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-[var(--color-brand-strong)]">receipts.cv</p>
				<p class="mt-2 text-sm text-[var(--color-muted)]">Prove your worth. Show your receipts.</p>
			</div>
			<div class="flex flex-wrap gap-2">
				<a class="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:border-[var(--color-brand-strong)] hover:text-[var(--color-ink)]" href="/sign-in">
					Sign in
				</a>
				<a class="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-strong)]" href="/sign-up">
					Get started
				</a>
			</div>
		</header>

		<main class="grid flex-1 gap-10 py-12 lg:grid-cols-[minmax(0,1.2fr)_22rem] lg:items-center">
			<section class="rounded-[2.8rem] border border-white/70 bg-white/80 p-8 shadow-[0_34px_100px_-50px_rgba(15,23,42,0.5)] backdrop-blur sm:p-10 lg:p-12">
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-brand-strong)]">Career memory, on demand</p>
				<h1 class="mt-4 max-w-3xl font-display text-5xl leading-[0.96] text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
					Keep the proof while the work is still fresh.
				</h1>
				<p class="mt-6 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
					receipts.cv helps you log your day in natural language so you stop losing the wins, metrics, and difficult moments you need later.
				</p>
				<div class="mt-8 flex flex-wrap gap-3">
					<a class="inline-flex items-center rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-strong)]" href="/sign-up">
						Create your account
					</a>
					<a class="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-brand-strong)]" href="/dashboard">
						Open dashboard
					</a>
				</div>
			</section>

			<aside class="rounded-[2.2rem] border border-white/70 bg-white/85 p-6 shadow-[0_28px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
				<p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-strong)]">Phase 1 focus</p>
				<ul class="mt-5 space-y-4">
					{#each principles as principle}
						<li class="rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-4 text-sm leading-7 text-[var(--color-muted)]">
							{principle}
						</li>
					{/each}
				</ul>
			</aside>
		</main>
	</div>
</div>
