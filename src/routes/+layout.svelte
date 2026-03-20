<script lang="ts">
import { setupConvex } from 'convex-svelte';
import { env } from '$env/dynamic/public';
import favicon from '$lib/assets/favicon.svg';
import { resolveClerkPaths } from '$lib/auth/clerkPaths';
import './layout.css';
import { ClerkProvider } from 'svelte-clerk';

import ClerkConvexBridge from '$lib/components/ClerkConvexBridge.svelte';

let { children } = $props();
const clerkPaths = resolveClerkPaths(env);

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
	signInUrl={clerkPaths.signInUrl}
	signUpUrl={clerkPaths.signUpUrl}
	signInForceRedirectUrl={clerkPaths.signInForceRedirectUrl}
	signInFallbackRedirectUrl={clerkPaths.signInFallbackRedirectUrl}
	signUpForceRedirectUrl={clerkPaths.signUpForceRedirectUrl}
	signUpFallbackRedirectUrl={clerkPaths.signUpFallbackRedirectUrl}
>
	<ClerkConvexBridge />
	{@render children()}
</ClerkProvider>
