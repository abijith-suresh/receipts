<script lang="ts">
import { goto } from '$app/navigation';
import { env } from '$env/dynamic/public';
import { onMount } from 'svelte';
import { useClerkContext } from 'svelte-clerk';

import { resolveClerkPaths } from '$lib/auth/clerkPaths';
import { convexAuthReady } from '$lib/auth/convexAuth';
import { clearSignOutRedirectPending, signOutRedirectPending } from '$lib/auth/signOutFlow';
import AppShell from '$lib/components/AppShell.svelte';
import EnsureUserBootstrap from '$lib/components/EnsureUserBootstrap.svelte';

const clerk = useClerkContext();
const clerkPaths = resolveClerkPaths(env);

let { children } = $props();
let mounted = $state(false);

onMount(() => {
	mounted = true;
});

$effect(() => {
	if (!mounted || !clerk.isLoaded || clerk.auth.userId) {
		return;
	}

	const destination = $signOutRedirectPending ? clerkPaths.signOutRedirectUrl : clerkPaths.signInUrl;

	if ($signOutRedirectPending) {
		clearSignOutRedirectPending();
	}

	void goto(destination, { replaceState: true });
});

const isSignedIn = $derived(!!clerk.auth.userId);
const isBootstrapping = $derived(
	!clerk.isLoaded || (!!clerk.auth.userId && !$convexAuthReady),
);
</script>

{#if isBootstrapping}
	<div class="boot-screen">
		<span class="boot-dot"></span>
	</div>
{:else if isSignedIn}
	<EnsureUserBootstrap />
	<AppShell>
		{@render children()}
	</AppShell>
{/if}

<style>
.boot-screen {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-color: var(--color-canvas);
}

.boot-dot {
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 9999px;
	background-color: var(--color-brand);
	animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 0.25; transform: scale(0.85); }
	50%       { opacity: 1;    transform: scale(1.15); }
}
</style>
