<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { useClerkContext } from 'svelte-clerk';
	import { fade } from 'svelte/transition';
	let { compact = false, menuDirection = 'up' }: { compact?: boolean; menuDirection?: 'up' | 'down' } = $props();

	const clerk = useClerkContext();

	let menuOpen = $state(false);
	let isSigningOut = $state(false);
	let rootEl = $state<HTMLElement | null>(null);

	const displayName = $derived(clerk.user?.firstName || clerk.user?.fullName || 'Your account');
	const emailAddress = $derived(clerk.user?.primaryEmailAddress?.emailAddress || clerk.user?.emailAddresses?.[0]?.emailAddress || 'Signed in');
	const avatarUrl = $derived(clerk.user?.imageUrl ?? null);
	const initials = $derived(
		displayName
			.split(' ')
			.slice(0, 2)
			.map((part) => part.charAt(0).toUpperCase())
			.join('') || 'R',
	);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	async function handleSignOut() {
		if (!clerk.clerk || isSigningOut) {
			return;
		}

		isSigningOut = true;
		closeMenu();

		const signOutRedirectUrl = env.PUBLIC_CLERK_AFTER_SIGN_OUT_URL || '/';

		try {
			await clerk.clerk.signOut({ redirectUrl: signOutRedirectUrl });
			if (browser) {
				await goto(signOutRedirectUrl);
			}
		} finally {
			isSigningOut = false;
		}
	}

	$effect(() => {
		if (!browser || !menuOpen) {
			return;
		}

		function handlePointer(event: PointerEvent) {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}

			if (rootEl && !rootEl.contains(target)) {
				closeMenu();
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				closeMenu();
			}
		}

		document.addEventListener('pointerdown', handlePointer);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('pointerdown', handlePointer);
			document.removeEventListener('keydown', handleEscape);
		};
	});
</script>

<div class="account-menu" data-account-menu-root bind:this={rootEl}>
	<button
		type="button"
		class:compact
		class="account-trigger"
		onclick={toggleMenu}
		aria-expanded={menuOpen}
		aria-haspopup="menu"
	>
		<span class="avatar-shell">
			{#if avatarUrl}
				<img class="avatar-image" src={avatarUrl} alt={displayName} />
			{:else}
				<span class="avatar-fallback">{initials}</span>
			{/if}
		</span>
		{#if !compact}
			<span class="account-meta">
				<span class="account-name">{displayName}</span>
				<span class="account-email">{emailAddress}</span>
			</span>
		{/if}
		<span class="account-caret" class:open={menuOpen}>
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</span>
	</button>

	{#if menuOpen}
		<div
			class:down={menuDirection === 'down'}
			class="menu-panel"
			role="menu"
			in:fade={{ duration: 160 }}
			out:fade={{ duration: 100 }}
		>
			<a class="menu-link" href="/reports" onclick={closeMenu} role="menuitem">
				Reports
			</a>
			<a class="menu-link" href="/settings" onclick={closeMenu} role="menuitem">
				Settings
			</a>
			<button class="menu-button" type="button" onclick={handleSignOut} role="menuitem" disabled={isSigningOut}>
				{isSigningOut ? 'Logging out...' : 'Log out'}
			</button>
		</div>
	{/if}
</div>

<style>
.account-menu {
	position: relative;
	width: 100%;
}

.account-trigger {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 0.875rem;
	padding: 0.85rem 0.95rem;
	border-radius: 1rem;
	border: 1px solid var(--color-border);
	background: var(--color-canvas);
	color: var(--color-ink);
	text-align: left;
	cursor: pointer;
	transition:
		border-color 0.15s ease,
		transform 0.15s ease,
		box-shadow 0.15s ease;
}

.account-trigger.compact {
	width: auto;
	padding: 0.65rem 0.75rem;
	gap: 0.65rem;
	border-radius: 9999px;
}

.account-trigger:hover {
	transform: translateY(-1px);
	border-color: var(--color-border-strong);
	box-shadow: var(--shadow-sm);
}

.avatar-shell {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 9999px;
	background: color-mix(in srgb, var(--color-brand-soft) 70%, white 30%);
	flex-shrink: 0;
	overflow: hidden;
}

.avatar-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.avatar-fallback {
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	color: var(--color-brand-strong);
}

.account-meta {
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
	flex: 1;
}

.account-name {
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--color-ink);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.account-email {
	font-size: 0.78rem;
	color: var(--color-muted);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.account-caret {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: var(--color-muted);
	flex-shrink: 0;
	transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.account-caret.open {
	transform: rotate(180deg);
}

.menu-panel {
	position: absolute;
	left: 0;
	right: 0;
	bottom: calc(100% + 0.5rem);
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 0.5rem;
	border-radius: var(--radius-card);
	border: 1px solid var(--color-border);
	background: var(--color-surface);
	box-shadow: 0 8px 32px -12px rgb(0 0 0 / 0.12), 0 2px 8px -4px rgb(0 0 0 / 0.06);
	z-index: 20;
}

.menu-panel.down {
	top: calc(100% + 0.5rem);
	bottom: auto;
}

.menu-link,
.menu-button {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 0.75rem 0.85rem;
	border-radius: 0.85rem;
	border: none;
	background: transparent;
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--color-ink);
	text-decoration: none;
	cursor: pointer;
	transition:
		background-color 0.15s ease,
		color 0.15s ease;
}

.menu-link:hover,
.menu-button:hover:not(:disabled) {
	background: var(--color-canvas);
	color: var(--color-brand-strong);
}

.menu-button:disabled {
	opacity: 0.55;
	cursor: wait;
}
</style>
