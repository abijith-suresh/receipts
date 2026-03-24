<script lang="ts">
	import { setupConvex } from 'convex-svelte';
	import { env } from '$env/dynamic/public';
	import { resolveClerkPaths } from '$lib/auth/clerkPaths';
	import './layout.css';
	import { ClerkProvider } from 'svelte-clerk';
import { onNavigate } from '$app/navigation';

import ClerkConvexBridge from '$lib/components/ClerkConvexBridge.svelte';

onNavigate((navigation) => {
	if (!document.startViewTransition) return;
	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});

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
	<title>receipts.cv - Your private proof of work</title>
	<meta
		name="description"
		content="Private daily work logging for professionals who want a clear record of wins, impact, and blockers."
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
