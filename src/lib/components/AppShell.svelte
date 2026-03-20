<script lang="ts">
	import { page } from '$app/stores';

	import AccountMenu from '$lib/components/AccountMenu.svelte';

	const { children } = $props<{
		children: () => unknown;
	}>();

	const navItems = [
		{ href: '/dashboard', label: 'Today' },
		{ href: '/history', label: 'History' },
		{ href: '/generate', label: 'Generate' },
		{ href: '/settings', label: 'Settings' },
	];

	function isActive(href: string) {
		return $page.url.pathname === href || ($page.url.pathname.startsWith(href) && href !== '/dashboard');
	}
</script>

<div class="shell">
	<aside class="sidebar">
		<div class="sidebar-top">
			<div class="brand-block">
				<a class="logo" href="/dashboard">
					<span class="logo-mark">r</span>
					<span class="logo-copy">
						<span class="logo-text">receipts.cv</span>
						<span class="logo-subtitle">Private proof of work</span>
					</span>
				</a>

				<div class="sidebar-intro">
					<p class="sidebar-kicker">Your workspace</p>
					<p class="sidebar-note">
						Capture the rough version while it is still sharp, then return later when you need the receipts.
					</p>
				</div>
			</div>

			<nav class="sidebar-nav">
				{#each navItems as item}
					<a class:selected={isActive(item.href)} class="sidebar-nav-link" href={item.href}>
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
					<span class="logo-text">receipts.cv</span>
				</span>
			</a>
			<AccountMenu compact menuDirection="down" />
		</div>

		<nav class="mobile-nav">
			{#each navItems as item}
				<a class:selected={isActive(item.href)} class="mobile-nav-link" href={item.href}>
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
	background: linear-gradient(180deg, color-mix(in srgb, var(--color-canvas) 96%, white 4%), var(--color-canvas));
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
		padding: 2rem 1.35rem;
		border-right: 1px solid var(--color-border);
		background: color-mix(in srgb, var(--color-surface) 95%, white 5%);
		position: sticky;
		top: 0;
		height: 100vh;
	}
}

.sidebar-top {
	display: flex;
	flex-direction: column;
	gap: 2.25rem;
}

.brand-block {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.logo {
	display: inline-flex;
	align-items: center;
	gap: 0.75rem;
	text-decoration: none;
}

.logo-mark {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 2rem;
	border-radius: 9999px;
	background-color: var(--color-ink);
	color: #fff;
	font-size: 0.85rem;
	font-weight: 700;
	flex-shrink: 0;
}

.logo-copy {
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
}

.logo-text {
	font-size: 0.74rem;
	font-weight: 700;
	letter-spacing: 0.28em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.logo-subtitle {
	font-size: 0.82rem;
	color: var(--color-muted);
}

.sidebar-intro {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
	padding: 1rem 1.05rem;
	border-radius: 1.1rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-canvas) 88%, white 12%);
}

.sidebar-kicker,
.sidebar-note {
	margin: 0;
}

.sidebar-kicker {
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.sidebar-note {
	font-size: 0.88rem;
	line-height: 1.7;
	color: var(--color-muted);
}

.sidebar-nav {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.sidebar-nav-link,
.mobile-nav-link {
	display: block;
	padding: 0.7rem 0.85rem;
	border-radius: 0.9rem;
	font-size: 0.9rem;
	font-weight: 500;
	color: var(--color-muted);
	text-decoration: none;
	transition:
		background-color 0.15s ease,
		color 0.15s ease,
		transform 0.15s ease;
}

.sidebar-nav-link:hover,
.mobile-nav-link:hover,
.sidebar-nav-link.selected,
.mobile-nav-link.selected {
	background: color-mix(in srgb, var(--color-brand-soft) 68%, white 32%);
	color: var(--color-brand-strong);
	transform: translateY(-1px);
}

.sidebar-bottom {
	padding-top: 1rem;
	border-top: 1px solid var(--color-border);
}

.content {
	flex: 1;
	min-width: 0;
	padding: 1.35rem 1rem 2rem;
}

.content-inner {
	max-width: 70rem;
	margin: 0 auto;
	padding-top: 1.2rem;
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
