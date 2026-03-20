<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

import { auth } from '$lib/auth/state';
import AppShell from '$lib/components/AppShell.svelte';
import EnsureUserBootstrap from '$lib/components/EnsureUserBootstrap.svelte';

let { children } = $props();
let mounted = $state(false);

onMount(() => {
	mounted = true;
});

$effect(() => {
	if (!mounted || !$auth.ready || $auth.signedIn) {
		return;
	}

	void goto('/sign-in');
});
</script>

{#if !$auth.ready}
	<div class="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(196,215,255,0.8),transparent_40%),linear-gradient(180deg,#f8f4eb_0%,#f5efe4_45%,#f4efe8_100%)] px-5 text-center text-sm text-[var(--color-muted)]">
		Bootstrapping your private workspace...
	</div>
{:else if $auth.signedIn}
	<EnsureUserBootstrap />
	<AppShell eyebrow="Private timeline" heading="Keep the evidence while it's still fresh.">
		{@render children()}
	</AppShell>
{/if}
