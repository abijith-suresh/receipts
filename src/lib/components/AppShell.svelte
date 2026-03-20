<script lang="ts">
import { page } from '$app/stores';
import { UserButton } from 'svelte-clerk';

const { children } = $props<{
	children: () => unknown;
}>();

const navItems = [
	{ href: '/dashboard', label: 'Timeline' },
	{ href: '/entry/new', label: 'Log today' },
	{ href: '/generate', label: 'Generate' },
	{ href: '/settings', label: 'Settings' },
];
</script>

<!-- Mobile top bar (visible below lg) -->
<header class="mobile-bar">
	<a class="logo" href="/dashboard">
		<span class="logo-mark">r</span>
		<span class="logo-text">receipts.cv</span>
	</a>
	<nav class="mobile-nav">
		{#each navItems as item}
			<a
				class="mobile-nav-link"
				class:active={$page.url.pathname === item.href ||
					($page.url.pathname.startsWith(item.href) && item.href !== '/dashboard')}
				href={item.href}
			>
				{item.label}
			</a>
		{/each}
	</nav>
	<div class="mobile-user">
		<UserButton />
	</div>
</header>

<!-- Desktop: sidebar + main content -->
<div class="shell">
	<aside class="sidebar">
		<div class="sidebar-top">
			<a class="logo" href="/dashboard">
				<span class="logo-mark">r</span>
				<span class="logo-text">receipts.cv</span>
			</a>

			<nav class="sidebar-nav">
				{#each navItems as item}
					<a
						class="sidebar-nav-link"
						class:active={$page.url.pathname === item.href ||
							($page.url.pathname.startsWith(item.href) && item.href !== '/dashboard')}
						href={item.href}
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>

		<div class="sidebar-bottom">
			<UserButton />
		</div>
	</aside>

	<main class="content">
		{@render children()}
	</main>
</div>

<style>
/* ── Shell ───────────────────────────────────────────────── */
.shell {
	display: flex;
	min-height: 100vh;
	background-color: var(--color-canvas);
}

/* ── Sidebar ─────────────────────────────────────────────── */
.sidebar {
	display: none;
}

@media (min-width: 1024px) {
	.sidebar {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 14rem;
		flex-shrink: 0;
		min-height: 100vh;
		padding: 2rem 1.25rem;
		border-right: 1px solid var(--color-border);
		background-color: var(--color-surface);
		position: sticky;
		top: 0;
		height: 100vh;
		overflow-y: auto;
	}
}

.sidebar-top {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
}

.sidebar-bottom {
	padding-bottom: 0.25rem;
}

/* ── Logo ────────────────────────────────────────────────── */
.logo {
	display: inline-flex;
	align-items: center;
	gap: 0.625rem;
	text-decoration: none;
}

.logo-mark {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.875rem;
	height: 1.875rem;
	border-radius: 9999px;
	background-color: var(--color-ink);
	color: #fff;
	font-size: 0.8125rem;
	font-weight: 700;
	flex-shrink: 0;
}

.logo-text {
	font-size: 0.6875rem;
	font-weight: 700;
	letter-spacing: 0.3em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

/* ── Sidebar nav ─────────────────────────────────────────── */
.sidebar-nav {
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
}

.sidebar-nav-link {
	display: block;
	padding: 0.5625rem 0.75rem;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--color-muted);
	text-decoration: none;
	transition:
		background-color 0.15s ease,
		color 0.15s ease;
}

.sidebar-nav-link:hover {
	background-color: var(--color-canvas);
	color: var(--color-ink);
}

.sidebar-nav-link.active {
	background-color: var(--color-brand-soft);
	color: var(--color-brand-strong);
	font-weight: 600;
}

/* ── Content area ────────────────────────────────────────── */
.content {
	flex: 1;
	min-width: 0;
	padding: 2rem 1.25rem;
}

@media (min-width: 640px) {
	.content {
		padding: 2.5rem 2rem;
	}
}

@media (min-width: 1024px) {
	.content {
		padding: 2.5rem 3rem;
		max-width: 52rem;
	}
}

/* ── Mobile top bar ──────────────────────────────────────── */
.mobile-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
	padding: 0.75rem 1.25rem;
	background-color: var(--color-surface);
	border-bottom: 1px solid var(--color-border);
	position: sticky;
	top: 0;
	z-index: 40;
}

@media (min-width: 1024px) {
	.mobile-bar {
		display: none;
	}
}

.mobile-nav {
	display: flex;
	align-items: center;
	gap: 0.125rem;
	flex-wrap: wrap;
}

.mobile-nav-link {
	padding: 0.375rem 0.625rem;
	border-radius: 9999px;
	font-size: 0.8125rem;
	font-weight: 500;
	color: var(--color-muted);
	text-decoration: none;
	transition:
		background-color 0.15s ease,
		color 0.15s ease;
}

.mobile-nav-link:hover {
	color: var(--color-ink);
}

.mobile-nav-link.active {
	background-color: var(--color-brand-soft);
	color: var(--color-brand-strong);
	font-weight: 600;
}

.mobile-user {
	flex-shrink: 0;
}
</style>
