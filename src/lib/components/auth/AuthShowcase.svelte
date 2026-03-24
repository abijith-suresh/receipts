<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { useClerkContext } from 'svelte-clerk';
	import BrandWordmark from '$lib/components/BrandWordmark.svelte';
	import { resolveClerkPaths } from '$lib/auth/clerkPaths';

	type Step = 'initial' | 'otp';
	type Flow = 'sign-in' | 'sign-up' | null;

	const clerk = useClerkContext();
	const clerkPaths = resolveClerkPaths(env);

	let step = $state<Step>('initial');
	let email = $state('');
	let otpCode = $state('');
	let flow = $state<Flow>(null);
	let isSubmitting = $state(false);
	let errorMessage = $state('');

	const isReady = $derived(clerk.isLoaded && !!clerk.client);

	function getClerkErrorMessage(error: unknown): string {
		if (typeof error !== 'object' || error === null) {
			return 'Something went wrong. Please try again.';
		}
		const maybeError = error as {
			errors?: Array<{ longMessage?: string; message?: string }>;
			message?: string;
		};
		return (
			maybeError.errors?.[0]?.longMessage ||
			maybeError.errors?.[0]?.message ||
			maybeError.message ||
			'Something went wrong. Please try again.'
		);
	}

	async function startGoogleAuth() {
		if (!isReady || isSubmitting || !browser) return;

		isSubmitting = true;
		errorMessage = '';

		const redirectUrl = new URL(clerkPaths.ssoCallbackUrl, window.location.origin).toString();
		const redirectUrlComplete = new URL(
			clerkPaths.signInForceRedirectUrl,
			window.location.origin,
		).toString();

		try {
			await clerk.client!.signIn.authenticateWithRedirect({
				strategy: 'oauth_google',
				redirectUrl,
				redirectUrlComplete,
			});
		} catch (err) {
			errorMessage = getClerkErrorMessage(err);
			isSubmitting = false;
		}
	}

	async function startEmailFlow() {
		if (!email.trim() || !isReady || !browser) return;

		isSubmitting = true;
		errorMessage = '';

		try {
			// Try sign-in first (user already exists)
			await clerk.client!.signIn.create({ identifier: email });
			const factor = clerk.client!.signIn.supportedFirstFactors?.find(
				(f: any) => f.strategy === 'email_code',
			);
			if (!factor) throw new Error('Email code sign-in is not enabled. Please use Google.');
			await clerk.client!.signIn.prepareFirstFactor({
				strategy: 'email_code',
				emailAddressId: (factor as any).emailAddressId,
			});
			flow = 'sign-in';
			step = 'otp';
		} catch (err: any) {
			const code = err?.errors?.[0]?.code;
			if (code === 'form_identifier_not_found') {
				// New user — sign-up flow
				try {
					await clerk.client!.signUp.create({ emailAddress: email });
					await clerk.client!.signUp.prepareEmailAddressVerification({
						strategy: 'email_code',
					});
					flow = 'sign-up';
					step = 'otp';
				} catch (signUpErr: any) {
					errorMessage = getClerkErrorMessage(signUpErr);
				}
			} else {
				errorMessage = getClerkErrorMessage(err);
			}
		} finally {
			isSubmitting = false;
		}
	}

	async function verifyOTP() {
		if (otpCode.length !== 6 || isSubmitting) return;

		isSubmitting = true;
		errorMessage = '';

		try {
			if (flow === 'sign-in') {
				const result = await clerk.client!.signIn.attemptFirstFactor({
					strategy: 'email_code',
					code: otpCode,
				});
				if (result.status === 'complete') {
					await clerk.clerk!.setActive({ session: result.createdSessionId });
					await goto('/dashboard');
				}
			} else if (flow === 'sign-up') {
				const result = await clerk.client!.signUp.attemptEmailAddressVerification({
					code: otpCode,
				});
				if (result.status === 'complete') {
					await clerk.clerk!.setActive({ session: result.createdSessionId });
					await goto('/dashboard');
				}
			}
		} catch (err: any) {
			errorMessage = getClerkErrorMessage(err);
			otpCode = '';
		} finally {
			isSubmitting = false;
		}
	}

	async function resendCode() {
		errorMessage = '';
		try {
			if (flow === 'sign-in') {
				const factor = clerk.client!.signIn.supportedFirstFactors?.find(
					(f: any) => f.strategy === 'email_code',
				);
				await clerk.client!.signIn.prepareFirstFactor({
					strategy: 'email_code',
					emailAddressId: (factor as any).emailAddressId,
				});
			} else if (flow === 'sign-up') {
				await clerk.client!.signUp.prepareEmailAddressVerification({
					strategy: 'email_code',
				});
			}
		} catch (err: any) {
			errorMessage = getClerkErrorMessage(err);
		}
	}

	function resetToInitial() {
		step = 'initial';
		otpCode = '';
		flow = null;
		errorMessage = '';
	}

	function handleEmailKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			startEmailFlow();
		}
	}

	$effect(() => {
		if (otpCode.length === 6 && !isSubmitting) {
			verifyOTP();
		}
	});
</script>

<section class="auth-page">
	<div class="auth-shell">
		<div class="auth-content">
			<div class="auth-card">
				{#if step === 'initial'}
					<p class="auth-eyebrow">
						<span class="eyebrow-dot"></span>
						Your private proof of work
					</p>

					<h1 class="auth-headline">
						<BrandWordmark as="span" size="hero" />
					</h1>

					<p class="auth-subheading">Build a private record of your work, wins, and impact.</p>

					<button
						type="button"
						class="btn-google"
						disabled={!isReady || isSubmitting}
						onclick={startGoogleAuth}
						aria-busy={isSubmitting}
					>
						<svg class="google-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
							<path d="M16.36 9.2c0-.57-.05-1.11-.14-1.64H9v3.1h4.13a3.53 3.53 0 0 1-1.53 2.32v1.93h2.48c1.45-1.34 2.28-3.31 2.28-5.71Z" fill="#4285F4"></path>
							<path d="M9 16.7c2.07 0 3.8-.68 5.06-1.84l-2.48-1.93c-.69.46-1.57.73-2.58.73-1.98 0-3.66-1.34-4.26-3.14H2.18v1.99A7.65 7.65 0 0 0 9 16.7Z" fill="#34A853"></path>
							<path d="M4.74 10.52A4.6 4.6 0 0 1 4.5 9c0-.53.09-1.05.24-1.52V5.49H2.18A7.7 7.7 0 0 0 1.3 9c0 1.24.3 2.41.88 3.51l2.56-1.99Z" fill="#FBBC05"></path>
							<path d="M9 4.34c1.12 0 2.12.38 2.92 1.14l2.2-2.2C12.8 2.02 11.07 1.3 9 1.3a7.65 7.65 0 0 0-6.82 4.19l2.56 1.99C5.34 5.68 7.02 4.34 9 4.34Z" fill="#EA4335"></path>
						</svg>
						<span>{isSubmitting ? 'Redirecting...' : 'Continue with Google'}</span>
					</button>

					<div class="auth-divider">
						<span class="auth-divider-line"></span>
						<span class="auth-divider-text">or</span>
						<span class="auth-divider-line"></span>
					</div>

					<div class="email-field">
						<label for="auth-email" class="sr-only">Email address</label>
						<input
							id="auth-email"
							type="email"
							class="email-input"
							placeholder="your@email.com"
							bind:value={email}
							onkeydown={handleEmailKeydown}
							autocomplete="email"
							disabled={isSubmitting}
						/>
					</div>

					<button
						type="button"
						class="btn-email"
						disabled={!isReady || isSubmitting || !email.trim()}
						onclick={startEmailFlow}
						aria-busy={isSubmitting}
					>
						{isSubmitting ? 'Sending...' : 'Continue with email'}
					</button>

					{#if errorMessage}
						<p class="auth-error" role="alert">{errorMessage}</p>
					{/if}

					{#if !clerk.isLoaded}
						<p class="auth-loading">Loading authentication...</p>
					{/if}
				{:else if step === 'otp'}
					<h1 class="auth-headline auth-headline--otp">Check your inbox</h1>

					<p class="otp-subtext">We sent a 6-digit code to <strong>{email}</strong></p>

					<div class="otp-field">
						<label for="auth-otp" class="sr-only">6-digit verification code</label>
						<input
							id="auth-otp"
							type="text"
							inputmode="numeric"
							maxlength="6"
							pattern="[0-9]*"
							class="otp-input"
							placeholder="000000"
							bind:value={otpCode}
							autocomplete="one-time-code"
							disabled={isSubmitting}
						/>
					</div>

					<button
						type="button"
						class="btn-email"
						disabled={otpCode.length !== 6 || isSubmitting}
						onclick={verifyOTP}
						aria-busy={isSubmitting}
					>
						{isSubmitting ? 'Verifying...' : 'Verify code'}
					</button>

					{#if errorMessage}
						<p class="auth-error" role="alert">{errorMessage}</p>
					{/if}

					<div class="otp-actions">
						<button type="button" class="otp-link" onclick={resetToInitial}>
							&larr; Back
						</button>
						<button type="button" class="otp-link" onclick={resendCode}>
							Resend code
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.auth-page {
		min-height: 100vh;
		background-color: var(--color-canvas);
	}

	.auth-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		max-width: 28rem;
		margin-inline: auto;
		padding-inline: 1.5rem;
		padding-block: 2rem;
	}

	@media (min-width: 640px) {
		.auth-shell {
			padding-block: 2.5rem;
		}
	}

	.auth-content {
		display: flex;
		flex: 1;
		align-items: center;
		padding-block: 2.5rem;
	}

	@media (min-width: 640px) {
		.auth-content {
			padding-block: 3.5rem;
		}
	}

	.auth-card {
		width: 100%;
		border-radius: 2rem;
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		padding: 1.75rem;
		box-shadow: 0 24px 60px -42px rgba(15, 23, 42, 0.24);
	}

	@media (min-width: 640px) {
		.auth-card {
			padding: 2.25rem;
		}
	}

	/* Eyebrow pill */
	.auth-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 9999px;
		border: 1px solid var(--color-border);
		background-color: var(--color-canvas);
		padding: 0.375rem 1rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-muted);
		margin: 0;
	}

	.eyebrow-dot {
		display: block;
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 9999px;
		background-color: var(--color-brand);
		flex-shrink: 0;
	}

	/* Headlines */
	.auth-headline {
		margin-top: 1.5rem;
		margin-bottom: 0;
		line-height: 1;
	}

	.auth-headline :global(.brand) {
		display: inline-flex;
	}

	.auth-headline--otp {
		font-family: var(--font-display);
		font-style: normal;
		font-size: 2rem;
		margin-top: 0;
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: var(--color-ink);
	}

	@media (min-width: 640px) {
		.auth-headline--otp {
			font-size: 2.5rem;
		}
	}

	.auth-subheading {
		margin-top: 1rem;
		margin-bottom: 0;
		font-size: 1rem;
		line-height: 1.625;
		color: var(--color-muted);
	}

	@media (min-width: 640px) {
		.auth-subheading {
			font-size: 1.125rem;
		}
	}

	/* Google button */
	.btn-google {
		margin-top: 2rem;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		padding: 0.875rem 1.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-ink);
		cursor: pointer;
		transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
	}

	.btn-google:hover:not(:disabled) {
		background-color: var(--color-canvas);
		box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
		transform: translateY(-1px);
	}

	.btn-google:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-google:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.google-icon {
		flex-shrink: 0;
	}

	/* Divider */
	.auth-divider {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 1.25rem;
	}

	.auth-divider-line {
		flex: 1;
		height: 1px;
		background-color: var(--color-border);
	}

	.auth-divider-text {
		font-size: 0.75rem;
		color: var(--color-muted);
		flex-shrink: 0;
	}

	/* Email input */
	.email-field {
		margin-top: 1.25rem;
	}

	.email-input {
		width: 100%;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border);
		background-color: var(--color-canvas);
		padding: 0.875rem 1rem;
		font-size: 0.9375rem;
		color: var(--color-ink);
		outline: none;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
		box-sizing: border-box;
	}

	.email-input::placeholder {
		color: var(--color-muted);
	}

	.email-input:focus {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 15%, transparent);
	}

	.email-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Email CTA button */
	.btn-email {
		margin-top: 0.75rem;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		border-radius: 0.75rem;
		border: none;
		background-color: var(--color-brand);
		padding: 0.875rem 1.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #fff;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
		transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
	}

	.btn-email:hover:not(:disabled) {
		background-color: var(--color-brand-strong, color-mix(in srgb, var(--color-brand) 85%, black));
		box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
		transform: translateY(-1px);
	}

	.btn-email:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-email:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	/* OTP step */
	.otp-subtext {
		margin-top: 0.75rem;
		margin-bottom: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--color-muted);
	}

	.otp-subtext strong {
		color: var(--color-ink);
		font-weight: 500;
	}

	.otp-field {
		margin-top: 2rem;
	}

	.otp-input {
		width: 100%;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border);
		background-color: var(--color-canvas);
		padding: 1rem;
		font-size: 1.75rem;
		font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
		font-weight: 600;
		letter-spacing: 0.25em;
		text-align: center;
		color: var(--color-ink);
		outline: none;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
		box-sizing: border-box;
	}

	.otp-input::placeholder {
		color: var(--color-border);
		letter-spacing: 0.2em;
	}

	.otp-input:focus {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 15%, transparent);
	}

	.otp-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.otp-actions {
		display: flex;
		justify-content: space-between;
		margin-top: 1.25rem;
	}

	.otp-link {
		background: none;
		border: none;
		padding: 0;
		font-size: 0.875rem;
		color: var(--color-muted);
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.otp-link:hover {
		color: var(--color-ink);
	}

	/* Shared */
	.auth-error {
		margin-top: 1rem;
		margin-bottom: 0;
		border-radius: 0.75rem;
		border: 1px solid #fecaca;
		background-color: #fef2f2;
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		line-height: 1.5;
		color: #b91c1c;
	}

	.auth-loading {
		margin-top: 0.75rem;
		margin-bottom: 0;
		font-size: 0.875rem;
		color: var(--color-muted);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
