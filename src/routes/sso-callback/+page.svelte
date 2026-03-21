<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { resolveClerkPaths } from '$lib/auth/clerkPaths';
	import { AuthenticateWithRedirectCallback } from 'svelte-clerk';

	const clerkPaths = resolveClerkPaths(env);
</script>

<svelte:head>
	<title>Signing you in - receipts.cv</title>
	<meta
		name="description"
		content="Completing your receipts.cv sign-in and taking you to your dashboard."
	/>
</svelte:head>

<AuthenticateWithRedirectCallback
	signInUrl={clerkPaths.signInUrl}
	signUpUrl={clerkPaths.signUpUrl}
	signInForceRedirectUrl={clerkPaths.signInForceRedirectUrl}
	signInFallbackRedirectUrl={clerkPaths.signInFallbackRedirectUrl}
	signUpForceRedirectUrl={clerkPaths.signUpForceRedirectUrl}
	signUpFallbackRedirectUrl={clerkPaths.signUpFallbackRedirectUrl}
/>

<section class="flex min-h-screen items-center justify-center bg-canvas px-6 py-10">
	<div class="w-full max-w-md rounded-[2rem] border border-border bg-surface p-8 text-center shadow-[0_24px_60px_-42px_rgba(15,23,42,0.24)]">
		<p class="inline-flex items-center gap-2 rounded-full border border-border bg-canvas px-4 py-1.5 text-xs font-medium text-muted">
			<span class="h-1.5 w-1.5 rounded-full bg-brand"></span>
			Almost there
		</p>
		<h1 class="mt-6 font-display text-4xl text-ink" style="line-height: 1.05; letter-spacing: -0.02em">
			Signing you in
		</h1>
		<p class="mt-4 text-base leading-relaxed text-muted">
			We are finishing your Google sign-in and taking you to your dashboard.
		</p>
		<p class="mt-4 text-sm leading-6 text-muted">
			If this takes longer than a few seconds, go back to
			<a href={clerkPaths.signInUrl} class="font-medium text-ink transition-colors duration-200 hover:text-brand">
				sign in
			</a>
			and try again.
		</p>
		<div class="mt-8 flex justify-center">
			<span class="h-2.5 w-2.5 rounded-full bg-brand animate-pulse"></span>
		</div>
	</div>
</section>
