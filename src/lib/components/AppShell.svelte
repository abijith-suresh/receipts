<script lang="ts">
	import { page } from '$app/stores';

	import AccountMenu from '$lib/components/AccountMenu.svelte';

	const { children } = $props<{
		children: () => unknown;
	}>();

	type NavItem = { href: string; label: string; view: string | null };

	const navItems: NavItem[] = [
		{ href: '/dashboard', label: 'Today', view: null },
		{ href: '/history?view=timeline', label: 'Timeline', view: 'timeline' },
		{ href: '/history?view=week', label: 'Week', view: 'week' },
		{ href: '/history?view=month', label: 'Month', view: 'month' },
	];

	function isActive(href: string, view: string | null): boolean {
		if (view === null) {
			return $page.url.pathname === '/dashboard';
		}
		return (
			$page.url.pathname === '/history' &&
			$page.url.searchParams.get('view') === view
		);
	}
</script>

<div class="shell">
	<aside class="sidebar">
		<div class="sidebar-top">
			<a class="logo" href="/dashboard">
				<span class="logo-mark">r</span>
				<span class="logo-copy">
					<span class="logo-text">receipts</span>
					<span class="logo-subtitle">Prove your worth.</span>
				</span>
			</a>

		<nav class="sidebar-nav">
			<a class:selected={isActive(navItems[0].href, navItems[0].view)} class="sidebar-nav-link" href={navItems[0].href}>
				{navItems[0].label}
			</a>
			<hr class="sidebar-nav-divider" />
			{#each navItems.slice(1) as item}
				<a class:selected={isActive(item.href, item.view)} class="sidebar-nav-link" href={item.href}>
					{item.label}
				</a>
			{/each}
		</nav>
		</div>

		<div class="sidebar-bottom">
			<AccountMenu />
		</div>
	</aside>

	<main class="content">
		<div class="mobile-shell-top">
			<a class="logo mobile-logo" href="/dashboard">
				<span class="logo-mark">r</span>
				<span class="logo-copy">
					<span class="logo-text">receipts</span>
				</span>
			</a>
			<AccountMenu compact menuDirection="down" />
		</div>

		<nav class="mobile-nav">
			<a class:selected={isActive(navItems[0].href, navItems[0].view)} class="mobile-nav-link" href={navItems[0].href}>
				{navItems[0].label}
			</a>
			<span class="mobile-nav-divider" aria-hidden="true"></span>
			{#each navItems.slice(1) as item}
				<a class:selected={isActive(item.href, item.view)} class="mobile-nav-link" href={item.href}>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="content-inner">
			{@render children()}
		</div>
	</main>
</div>

<style>
.shell {
	display: flex;
	min-height: 100vh;
	background: var(--color-canvas);
}

.sidebar {
	display: none;
}

@media (min-width: 1024px) {
	.sidebar {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 18rem;
		flex-shrink: 0;
		min-height: 100vh;
		padding: 2.25rem 1.5rem;
		border-right: 1px solid var(--color-border);
		background: color-mix(in srgb, var(--color-canvas) 60%, var(--color-surface) 40%);
		position: sticky;
		top: 0;
		height: 100vh;
	}
}

.sidebar-top {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
}

.logo {
	display: inline-flex;
	align-items: center;
	gap: 0.85rem;
	text-decoration: none;
}

.logo-mark {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.1rem;
	height: 2.1rem;
	border-radius: 9999px;
	background-color: var(--color-ink);
	color: var(--color-surface);
	font-size: 1rem;
	font-family: var(--font-display);
	font-style: italic;
	font-weight: 400;
	flex-shrink: 0;
}

.logo-copy {
	display: flex;
	flex-direction: column;
	gap: 0.1rem;
}

.logo-text {
	font-family: var(--font-display);
	font-style: italic;
	font-size: 1.2rem;
	font-weight: 400;
	color: var(--color-ink);
	line-height: 1.2;
}

.logo-subtitle {
	font-size: 0.75rem;
	color: var(--color-muted);
	letter-spacing: 0.01em;
}

.sidebar-nav {
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
}

.sidebar-nav-link,
.mobile-nav-link {
	display: block;
	padding: 0.65rem 0.9rem;
	border-radius: var(--radius-md);
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--color-ink-2);
	text-decoration: none;
	transition:
		background-color 0.15s ease,
		color 0.15s ease,
		border-color 0.15s ease;
	border-left: 2px solid transparent;
}

.sidebar-nav-link:hover {
	background: color-mix(in srgb, var(--color-border) 50%, transparent 50%);
	color: var(--color-ink);
	border-left-color: var(--color-border-strong);
}

.sidebar-nav-link.selected {
	background: color-mix(in srgb, var(--color-brand-soft) 80%, transparent 20%);
	color: var(--color-brand-strong);
	border-left-color: var(--color-brand);
	font-weight: 600;
}

.mobile-nav-link:hover,
.mobile-nav-link.selected {
	background: color-mix(in srgb, var(--color-brand-soft) 68%, white 32%);
	color: var(--color-brand-strong);
}

.sidebar-bottom {
	padding-top: 1.25rem;
	border-top: 1px solid var(--color-border);
}

.content {
	flex: 1;
	min-width: 0;
	padding: 1.35rem 1rem 2rem;
	background: var(--color-canvas);
}

.content-inner {
	max-width: 70rem;
	margin: 0 auto;
	padding-top: 1.2rem;
}

.sidebar-nav-divider {
	border: none;
	border-top: 1px solid var(--color-border);
	margin: 0.6rem 0.9rem;
}

.mobile-nav-divider {
	width: 1px;
	align-self: stretch;
	background: var(--color-border);
	border-radius: 1px;
	margin: 0 0.1rem;
}

.mobile-shell-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin: 0 auto;
	max-width: 70rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid var(--color-border);
}

.mobile-nav {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem;
	margin: 1rem auto 0;
	max-width: 70rem;
}

@media (min-width: 1024px) {
	.content {
		padding: 2.5rem 3rem;
	}

	.mobile-shell-top,
	.mobile-nav {
		display: none;
	}
}
</style>
