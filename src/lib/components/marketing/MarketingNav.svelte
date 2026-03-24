<script lang="ts">
	import { page } from '$app/stores';
	import BrandWordmark from '$lib/components/BrandWordmark.svelte';

	let mobileOpen = $state(false);

	const navLinks = [
		{ href: '/features', label: 'Features' },
		{ href: '/pricing', label: 'Pricing' },
		{ href: '/faq', label: 'FAQ' }
	];

	function isActive(href: string) {
		return $page.url.pathname === href;
	}

	function toggleMobile() {
		mobileOpen = !mobileOpen;
	}

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<nav class="sticky top-0 z-50 border-b border-border bg-canvas/95 backdrop-blur-sm">
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
		<div class="shrink-0">
			<BrandWordmark
				href="/"
				size="md"
				descriptor="Your private proof of work"
				descriptorHiddenOnMobile={true}
			/>
		</div>

		<!-- Desktop nav -->
		<div class="ml-auto hidden items-center gap-1 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="relative rounded-lg px-4 py-2 text-sm transition-colors duration-150"
					class:text-ink={isActive(link.href)}
					class:font-medium={isActive(link.href)}
					class:text-muted={!isActive(link.href)}
					class:hover:text-ink={!isActive(link.href)}
				>
					{link.label}
					{#if isActive(link.href)}
						<span class="absolute bottom-0.5 left-4 right-4 h-px rounded-full bg-brand"></span>
					{/if}
				</a>
			{/each}
		</div>

		<!-- Desktop CTAs -->
		<div class="hidden items-center gap-1 md:flex">
			<a
				href="/login"
				class="rounded-full px-4 py-2 text-sm text-muted transition-colors duration-150 hover:text-ink"
			>
				Sign in
			</a>
			<a
				href="/login"
				class="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-brand-strong"
			>
				Get started
			</a>
		</div>

		<!-- Mobile: get started + hamburger -->
		<div class="flex items-center gap-2 md:hidden">
			<a
				href="/login"
				class="rounded-full bg-brand px-3.5 py-1.5 text-sm font-medium text-white transition-all duration-150 hover:bg-brand-strong"
			>
				Get started
			</a>
			<button
				onclick={toggleMobile}
				class="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink"
				aria-label="Toggle menu"
				aria-expanded={mobileOpen}
			>
				{#if mobileOpen}
					<!-- X icon -->
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
					</svg>
				{:else}
					<!-- Hamburger icon -->
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="border-t border-border bg-canvas px-6 py-4 md:hidden">
			<div class="flex flex-col gap-1">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={closeMobile}
						class="rounded-lg px-3 py-2.5 text-sm transition-colors duration-150"
						class:text-ink={isActive(link.href)}
						class:font-medium={isActive(link.href)}
						class:bg-surface={isActive(link.href)}
						class:text-muted={!isActive(link.href)}
					>
						{link.label}
					</a>
				{/each}
				<div class="mt-2 border-t border-border pt-2">
					<a
						href="/login"
						onclick={closeMobile}
						class="block rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:text-ink"
					>
						Sign in
					</a>
				</div>
			</div>
		</div>
	{/if}
</nav>
