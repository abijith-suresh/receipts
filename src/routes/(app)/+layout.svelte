<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { useClerkContext } from 'svelte-clerk';

import { convexAuthReady } from '$lib/auth/convexAuth';
import AppShell from '$lib/components/AppShell.svelte';
import EnsureUserBootstrap from '$lib/components/EnsureUserBootstrap.svelte';

const clerk = useClerkContext();

let { children } = $props();
let mounted = $state(false);

onMount(() => {
	mounted = true;
});

$effect(() => {
	if (!mounted || !clerk.isLoaded || clerk.auth.userId) {
		return;
	}

	void goto('/sign-in');
});

const isSignedIn = $derived(!!clerk.auth.userId);
const isBootstrapping = $derived(
	!clerk.isLoaded || (!!clerk.auth.userId && !$convexAuthReady),
);
</script>

{#if isBootstrapping}
	<div class="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(196,215,255,0.8),transparent_40%),linear-gradient(180deg,#f8f4eb_0%,#f5efe4_45%,#f4efe8_100%)] px-5 text-center text-sm text-[var(--color-muted)]">
		Bootstrapping your private workspace...
	</div>
{:else if isSignedIn}
	<EnsureUserBootstrap />
	<AppShell eyebrow="Private timeline" heading="Keep the evidence while it's still fresh.">
		{@render children()}
	</AppShell>
{/if}
