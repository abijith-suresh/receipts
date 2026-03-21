<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { useClerkContext } from 'svelte-clerk';

	import { convexAuthReady } from '$lib/auth/convexAuth';
	import SettingField from '$lib/components/settings/SettingField.svelte';
	import { api } from '$lib/convex';
	import {
		getBrowserTimeZone,
		historyViewOptions,
		listTimezoneOptions,
		weekStartOptions,
	} from '$lib/settings/options';

	const clerk = useClerkContext();
	const convex = useConvexClient();
	const signOutRedirectUrl = env.PUBLIC_CLERK_AFTER_SIGN_OUT_URL || '/';
	
	const displayName = $derived(clerk.user?.fullName || clerk.user?.firstName || 'Your account');
	const emailAddress = $derived(clerk.user?.primaryEmailAddress?.emailAddress || clerk.user?.emailAddresses?.[0]?.emailAddress || 'Signed in with Clerk');
	const avatarUrl = $derived(clerk.user?.imageUrl || null);
	const ready = $derived(clerk.isLoaded && !!clerk.auth.userId && $convexAuthReady);
	const settings = useQuery(api.users.settings, () => (ready ? {} : 'skip'));

	let timezone = $state(getBrowserTimeZone());
	let weekStartsOn = $state<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);
	let defaultHistoryView = $state<'week' | 'month' | 'timeline'>('week');
	let isSaving = $state(false);
	let saveMessage = $state<string | null>(null);
	let errorMessage = $state<string | null>(null);
	let hydratedSignature = $state<string | null>(null);

	const timezoneOptions = $derived(listTimezoneOptions(timezone));
	const loadedSignature = $derived(
		settings.data
			? JSON.stringify([
				settings.data.timezone,
				settings.data.weekStartsOn,
				settings.data.defaultHistoryView,
			])
			: null
	);
	const isDirty = $derived(
		loadedSignature !== null &&
			JSON.stringify([timezone, weekStartsOn, defaultHistoryView]) !== loadedSignature
	);

	$effect(() => {
		if (!settings.data || loadedSignature === null || hydratedSignature === loadedSignature) {
			return;
		}

		timezone = settings.data.timezone;
		weekStartsOn = settings.data.weekStartsOn;
		defaultHistoryView = settings.data.defaultHistoryView;
		hydratedSignature = loadedSignature;
		errorMessage = null;
	});

	$effect(() => {
		if (!isDirty) {
			return;
		}
		saveMessage = null;
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!ready || isSaving || !isDirty) {
			return;
		}

		isSaving = true;
		errorMessage = null;
		saveMessage = null;

		try {
			await convex.mutation(api.users.updateSettings, {
				timezone,
				weekStartsOn,
				defaultHistoryView,
			});

			saveMessage = 'Preferences saved';
			hydratedSignature = JSON.stringify([timezone, weekStartsOn, defaultHistoryView]);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Unable to save settings';
		} finally {
			isSaving = false;
		}
	}

	function useDetectedTimezone() {
		timezone = getBrowserTimeZone();
		saveMessage = null;
		errorMessage = null;
	}

	async function handleSignOut() {
		if (!clerk.clerk) return;
		await clerk.clerk.signOut({ redirectUrl: signOutRedirectUrl });
	}
</script>

<div class="settings-page">
	<header class="page-header">
		<span class="eyebrow">Settings</span>
		<h1 class="page-title">Your account</h1>
	</header>

	<section class="card profile-card">
		<div class="card-header">
			<span class="eyebrow">Profile</span>
			<h2 class="card-title">Account details</h2>
		</div>
		<div class="profile-content">
			{#if avatarUrl}
				<img src={avatarUrl} alt="" class="avatar" />
			{:else}
				<div class="avatar avatar-placeholder">
					{displayName.charAt(0).toUpperCase()}
				</div>
			{/if}
			<div class="profile-info">
				<p class="profile-name">{displayName}</p>
				<p class="profile-email">{emailAddress}</p>
			</div>
			<button class="button-secondary" onclick={handleSignOut}>
				Sign out
			</button>
		</div>
	</section>

	<section class="card">
		<div class="card-header">
			<span class="eyebrow">Preferences</span>
			<h2 class="card-title">App preferences</h2>
		</div>

		{#if !ready || settings.isLoading}
			<div class="status-message">Loading preferences…</div>
		{:else if settings.error}
			<div class="error-message">Unable to load settings</div>
		{:else}
			<form onsubmit={handleSubmit}>
				<SettingField
					forId="timezone"
					label="Timezone"
					description="Used for date boundaries and reporting"
				>
					<div class="select-with-action">
						<select id="timezone" class="field-input" bind:value={timezone}>
							{#each timezoneOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						<button 
							type="button" 
							class="button-text" 
							onclick={useDetectedTimezone}
						>
							Use detected
						</button>
					</div>
				</SettingField>

				<SettingField
					forId="week-start"
					label="Week starts on"
					description="First day of the week in calendar views"
				>
					<select id="week-start" class="field-input" bind:value={weekStartsOn}>
						{#each weekStartOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</SettingField>

				<SettingField
					forId="history-view"
					label="Default history view"
					description="Opens when navigating to history"
				>
					<select id="history-view" class="field-input" bind:value={defaultHistoryView}>
						{#each historyViewOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</SettingField>

				<div class="form-footer">
					<div class="save-status" aria-live="polite">
						{#if errorMessage}
							<span class="status-error">{errorMessage}</span>
						{:else if saveMessage}
							<span class="status-success">{saveMessage}</span>
						{:else if isDirty}
							<span class="status-pending">Unsaved changes</span>
						{/if}
					</div>
					<button 
						type="submit" 
						class="button-primary"
						disabled={!isDirty || isSaving}
					>
						{isSaving ? 'Saving…' : 'Save preferences'}
					</button>
				</div>
			</form>
		{/if}
	</section>

	<section class="card placeholder-card">
		<div class="card-header">
			<span class="eyebrow">Plan & Billing</span>
			<h2 class="card-title">Subscription</h2>
		</div>
		<p class="placeholder-text">Subscription management coming soon</p>
	</section>

	<section class="card placeholder-card">
		<div class="card-header">
			<span class="eyebrow">Privacy & Data</span>
			<h2 class="card-title">Your data</h2>
		</div>
		<p class="placeholder-text">Data export and account deletion coming soon</p>
	</section>

	<section class="card minimal-card">
		<div class="card-header">
			<span class="eyebrow">Help</span>
			<h2 class="card-title">Resources</h2>
		</div>
		<nav class="help-links">
			<a href="/changelog">Changelog</a>
			<a href="https://github.com/abijith-suresh/receipts" target="_blank" rel="noopener">GitHub</a>
			<a href="/privacy">Privacy policy</a>
		</nav>
	</section>
</div>

<style>
	.settings-page {
		max-width: 52rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 0 1rem;
	}

	.page-header {
		margin-bottom: 0.5rem;
	}

	.eyebrow {
		display: block;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-brand);
		margin-bottom: 0.5rem;
	}

	.page-title {
		font-family: var(--font-display);
		font-size: 2.25rem;
		font-weight: 400;
		color: var(--color-ink);
		margin: 0;
		line-height: 1.1;
	}

	.card {
		background: color-mix(in srgb, var(--color-surface) 96%, var(--color-canvas) 4%);
		border: 1px solid var(--color-border);
		border-radius: 1.25rem;
		padding: 1.5rem;
	}

	.card-header {
		margin-bottom: 1.25rem;
		padding-bottom: 0.25rem;
	}

	.card-title {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 400;
		color: var(--color-ink);
		margin: 0;
		line-height: 1.2;
	}

	.profile-card {
		background: color-mix(in srgb, var(--color-canvas) 95%, var(--color-brand-soft) 5%);
	}

	.profile-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 0.25rem 0;
	}

	.avatar {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		object-fit: cover;
		background: var(--color-brand-soft);
		border: 2px solid var(--color-border);
	}

	.avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 400;
		color: var(--color-brand-strong);
	}

	.profile-info {
		flex: 1;
		min-width: 0;
	}

	.profile-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-ink);
		margin: 0 0 0.25rem 0;
		line-height: 1.4;
		overflow-wrap: break-word;
	}

	.profile-email {
		font-size: 0.88rem;
		color: var(--color-muted);
		margin: 0;
		line-height: 1.4;
		overflow-wrap: break-word;
	}

	.select-with-action {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-input {
		width: 100%;
		padding: 0.7rem 0.9rem;
		border-radius: 0.875rem;
		border: 1px solid var(--color-border);
		background: var(--color-canvas);
		color: var(--color-ink);
		font-size: 0.94rem;
		outline: none;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}

	.field-input:focus {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 12%, transparent);
	}

	.button-primary,
	.button-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.375rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.12s ease, background-color 0.12s ease, border-color 0.12s ease;
		line-height: 1.4;
		min-height: 2.75rem;
	}

	.button-primary {
		border: none;
		background: var(--color-ink);
		color: #fff;
	}

	.button-primary:hover:not(:disabled) {
		background: var(--color-brand-strong);
		transform: translateY(-1px);
	}

	.button-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.button-secondary {
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-ink);
	}

	.button-secondary:hover {
		border-color: var(--color-brand);
		color: var(--color-brand-strong);
	}

	.button-text {
		background: none;
		border: none;
		padding: 0;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--color-brand);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.button-text:hover {
		color: var(--color-brand-strong);
	}

	.form-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
		flex-wrap: wrap;
	}

	.save-status {
		font-size: 0.88rem;
		min-height: 1.5rem;
	}

	.status-success {
		color: #166534;
	}

	.status-error {
		color: #b91c1c;
	}

	.status-pending {
		color: var(--color-muted);
	}

	.status-message,
	.error-message {
		padding: 1rem;
		border-radius: 0.875rem;
		font-size: 0.94rem;
		background: var(--color-canvas);
		border: 1px solid var(--color-border);
	}

	.error-message {
		background: #fef2f2;
		border-color: #fecaca;
		color: #b91c1c;
	}

	.placeholder-card {
		background: color-mix(in srgb, var(--color-canvas) 92%, var(--color-surface) 8%);
	}

	.placeholder-text {
		font-size: 0.94rem;
		color: var(--color-muted);
		margin: 0;
	}

	.minimal-card {
		background: transparent;
		border-style: dashed;
	}

	.help-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
	}

	.help-links a {
		font-size: 0.94rem;
		color: var(--color-ink);
		text-decoration: none;
		font-weight: 500;
	}

	.help-links a:hover {
		color: var(--color-brand-strong);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	@media (max-width: 640px) {
		.settings-page {
			gap: 1.25rem;
			padding: 0 0.75rem;
		}

		.page-title {
			font-size: 1.75rem;
		}

		.card {
			padding: 1.25rem;
		}

		.profile-content {
			flex-direction: column;
			align-items: flex-start;
			text-align: left;
		}

		.form-footer {
			flex-direction: column;
			align-items: stretch;
		}

		.button-primary {
			width: 100%;
		}
	}
</style>
