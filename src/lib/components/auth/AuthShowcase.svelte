<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { browser } from '$app/environment';
	import { useClerkContext } from 'svelte-clerk';
	import { resolveClerkPaths } from '$lib/auth/clerkPaths';

	type AuthMode = 'sign-in' | 'sign-up';
	type AuthCopy = {
		eyebrow: string;
		title: string;
		description: string;
		googleCta: string;
		note: string;
		switchPrompt: string;
		switchHref: string;
		switchCta: string;
	};

	let { mode }: { mode: AuthMode } = $props();
	const clerk = useClerkContext();
	const clerkPaths = resolveClerkPaths(env);

	let isSubmitting = $state(false);
	let errorMessage = $state<string | null>(null);

	const copyByMode = {
		'sign-in': {
			eyebrow: 'Welcome back',
			title: 'Sign in',
			description: 'Pick up where you left off in your private work log.',
			googleCta: 'Continue with Google',
			note: 'Private by default. You will land in your dashboard.',
			switchPrompt: 'Need a new account?',
			switchHref: '/sign-up',
			switchCta: 'Create one'
		},
		'sign-up': {
			eyebrow: 'Get started',
			title: 'Create your account',
			description: "Capture your work while it's fresh and keep it ready for reviews and 1:1s.",
			googleCta: 'Continue with Google',
			note: 'Private by default. Built for individual contributors.',
			switchPrompt: 'Already have an account?',
			switchHref: '/sign-in',
			switchCta: 'Sign in'
		}
	} satisfies Record<AuthMode, AuthCopy>;

	const copy = $derived(copyByMode[mode]);
	const isReady = $derived(clerk.isLoaded && !!clerk.client);

	function getClerkErrorMessage(error: unknown) {
		if (typeof error !== 'object' || error === null) {
			return 'Something went wrong starting Google sign-in. Please try again.';
		}

		const maybeError = error as {
			errors?: Array<{ longMessage?: string; message?: string }>;
			message?: string;
		};

		return (
			maybeError.errors?.[0]?.longMessage ||
			maybeError.errors?.[0]?.message ||
			maybeError.message ||
			'Something went wrong starting Google sign-in. Please try again.'
		);
	}

	async function startGoogleAuth() {
		if (!isReady || isSubmitting || !browser) {
			return;
		}

		isSubmitting = true;
		errorMessage = null;

		const redirectUrl = new URL(clerkPaths.ssoCallbackUrl, window.location.origin).toString();
		const redirectUrlComplete = new URL(
			mode === 'sign-in'
				? clerkPaths.signInForceRedirectUrl
				: clerkPaths.signUpForceRedirectUrl,
			window.location.origin,
		).toString();

		const redirectOptions = {
			strategy: 'oauth_google' as const,
			redirectUrl,
			redirectUrlComplete,
			signInForceRedirectUrl: clerkPaths.signInForceRedirectUrl,
			signInFallbackRedirectUrl: clerkPaths.signInFallbackRedirectUrl,
			signUpForceRedirectUrl: clerkPaths.signUpForceRedirectUrl,
			signUpFallbackRedirectUrl: clerkPaths.signUpFallbackRedirectUrl,
		};

		try {
			if (mode === 'sign-in') {
				await clerk.client?.signIn.authenticateWithRedirect(redirectOptions);
			} else {
				await clerk.client?.signUp.authenticateWithRedirect(redirectOptions);
			}
		} catch (error) {
			errorMessage = getClerkErrorMessage(error);
			isSubmitting = false;
		}
	}
</script>

<section class="min-h-screen bg-canvas">
	<div class="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8 sm:py-10">
		<header class="flex items-center justify-center">
			<a href="/" class="w-full text-center font-display text-2xl text-ink" style="letter-spacing: -0.01em">
				receipts.cv
			</a>
		</header>

		<div class="flex flex-1 items-center py-10 sm:py-14">
			<div class="w-full rounded-[2rem] border border-border bg-surface p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.24)] sm:p-9">
				<p
					class="inline-flex items-center gap-2 rounded-full border border-border bg-canvas px-4 py-1.5 text-xs font-medium text-muted"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-brand"></span>
					{copy.eyebrow}
				</p>

				<h1
					class="mt-6 font-display text-4xl text-ink sm:text-5xl"
					style="line-height: 1.05; letter-spacing: -0.02em"
				>
					{copy.title}
				</h1>

				<p class="mt-4 text-base leading-relaxed text-muted sm:text-lg">
					{copy.description}
				</p>

				<button
					type="button"
					class="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-5 py-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-brand/60 disabled:shadow-none"
					disabled={!isReady || isSubmitting}
					onclick={startGoogleAuth}
					aria-busy={isSubmitting}
				>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
						<path d="M16.36 9.2c0-.57-.05-1.11-.14-1.64H9v3.1h4.13a3.53 3.53 0 0 1-1.53 2.32v1.93h2.48c1.45-1.34 2.28-3.31 2.28-5.71Z" fill="currentColor"></path>
						<path d="M9 16.7c2.07 0 3.8-.68 5.06-1.84l-2.48-1.93c-.69.46-1.57.73-2.58.73-1.98 0-3.66-1.34-4.26-3.14H2.18v1.99A7.65 7.65 0 0 0 9 16.7Z" fill="#D1FAE5"></path>
						<path d="M4.74 10.52A4.6 4.6 0 0 1 4.5 9c0-.53.09-1.05.24-1.52V5.49H2.18A7.7 7.7 0 0 0 1.3 9c0 1.24.3 2.41.88 3.51l2.56-1.99Z" fill="#FEF3C7"></path>
						<path d="M9 4.34c1.12 0 2.12.38 2.92 1.14l2.2-2.2C12.8 2.02 11.07 1.3 9 1.3a7.65 7.65 0 0 0-6.82 4.19l2.56 1.99C5.34 5.68 7.02 4.34 9 4.34Z" fill="#FEE2E2"></path>
					</svg>
					<span>{isSubmitting ? 'Redirecting to Google...' : copy.googleCta}</span>
				</button>

				{#if errorMessage}
					<p class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
						{errorMessage}
					</p>
				{/if}

				<p class="mt-4 text-sm leading-6 text-muted">{copy.note}</p>

				<p class="mt-8 text-sm text-muted">
					{copy.switchPrompt}
					<a href={copy.switchHref} class="font-medium text-ink transition-colors duration-200 hover:text-brand">
						{copy.switchCta}
					</a>
				</p>

				{#if !clerk.isLoaded}
					<p class="mt-3 text-sm text-muted">Loading authentication...</p>
				{/if}
			</div>
		</div>
	</div>
</section>
