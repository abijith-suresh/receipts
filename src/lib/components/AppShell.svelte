<script lang="ts">
import ClerkUserButton from '$lib/components/ClerkUserButton.svelte';

const { heading, eyebrow, children } = $props<{
	heading: string;
	eyebrow: string;
	children: () => unknown;
}>();

const navItems = [
	{ href: '/dashboard', label: 'Timeline' },
	{ href: '/entry/new', label: 'Log today' },
	{ href: '/generate', label: 'Generate' },
	{ href: '/settings', label: 'Settings' },
];
</script>

<div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(196,215,255,0.8),transparent_40%),linear-gradient(180deg,#f8f4eb_0%,#f5efe4_45%,#f4efe8_100%)] text-[var(--color-ink)]">
	<div class="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
		<header class="rounded-[2rem] border border-white/70 bg-white/75 px-5 py-4 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:px-6">
			<div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<a class="inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-[var(--color-brand-strong)]" href="/dashboard">
						<span class="inline-flex size-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">r</span>
						receipts.cv
					</a>
					<div class="mt-4">
						<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-strong)]">{eyebrow}</p>
						<h1 class="mt-2 font-display text-3xl sm:text-4xl">{heading}</h1>
					</div>
				</div>

				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:min-w-[22rem] lg:justify-end">
					<nav class="flex flex-wrap gap-2">
						{#each navItems as item}
							<a class="rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:border-[var(--color-brand-strong)] hover:text-[var(--color-ink)]" href={item.href}>
								{item.label}
							</a>
						{/each}
					</nav>
					<ClerkUserButton />
				</div>
			</div>
		</header>

		<main class="py-8">
			{@render children()}
		</main>
	</div>
</div>
