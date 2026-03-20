<script lang="ts">
import { env } from '$env/dynamic/public';
import './layout.css';
import { setupConvex } from 'convex-svelte';
import favicon from '$lib/assets/favicon.svg';
import { ClerkProvider } from 'svelte-clerk';

import ClerkConvexBridge from '$lib/components/ClerkConvexBridge.svelte';

let { children } = $props();

if (!env.PUBLIC_CONVEX_URL) {
	throw new Error('Missing PUBLIC_CONVEX_URL.');
}

if (!env.PUBLIC_CLERK_PUBLISHABLE_KEY) {
	throw new Error('Missing PUBLIC_CLERK_PUBLISHABLE_KEY.');
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

<ClerkProvider
	publishableKey={env.PUBLIC_CLERK_PUBLISHABLE_KEY}
	signInUrl={env.PUBLIC_CLERK_SIGN_IN_URL || '/sign-in'}
	signUpUrl={env.PUBLIC_CLERK_SIGN_UP_URL || '/sign-up'}
	signInForceRedirectUrl={env.PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard'}
	signInFallbackRedirectUrl={env.PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard'}
	signUpForceRedirectUrl={env.PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/dashboard'}
	signUpFallbackRedirectUrl={env.PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/dashboard'}
>
	<ClerkConvexBridge />
	{@render children()}
</ClerkProvider>
