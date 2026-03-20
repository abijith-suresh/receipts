<script lang="ts">
import { env } from '$env/dynamic/public';
import './layout.css';
import { setupConvex } from 'convex-svelte';
import favicon from '$lib/assets/favicon.svg';
import ClerkAuthMount from '$lib/components/ClerkAuthMount.svelte';

let { children } = $props();

if (!env.PUBLIC_CONVEX_URL) {
	throw new Error('Missing PUBLIC_CONVEX_URL.');
}

setupConvex(env.PUBLIC_CONVEX_URL);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>receipts.cv - Prove your worth. Show your receipts.</title>
	<meta
		name="description"
		content="Private daily work logging for professionals who want a cleaner record of impact, blockers, and wins."
	/>
</svelte:head>

<ClerkAuthMount />
{@render children()}
