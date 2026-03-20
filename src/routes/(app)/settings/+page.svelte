<script lang="ts">
	import { env } from '$env/dynamic/public';

	import AccountMenu from '$lib/components/AccountMenu.svelte';

	const signOutRedirectUrl = env.PUBLIC_CLERK_AFTER_SIGN_OUT_URL || '/';
</script>

<div class="settings-page">
	<div class="page-header">
		<p class="eyebrow">Settings</p>
		<h1 class="page-title">Account and session</h1>
		<p class="page-desc">
			Keep the settings surface light for now: a clear account summary, a clean logout path, and room for billing later.
		</p>
	</div>

	<div class="settings-grid">
		<section class="settings-card">
			<p class="card-label">Account</p>
			<h2 class="card-title">Use your own account menu instead of Clerk chrome.</h2>
			<p class="card-copy">
				This custom menu matches the rest of the app and keeps sign-out pointed at the public home page.
			</p>
			<div class="menu-preview">
				<AccountMenu menuDirection="down" />
			</div>
		</section>

		<section class="settings-card muted">
			<p class="card-label">Sign-out behavior</p>
			<h2 class="card-title">Leaving the workspace returns you to the landing page.</h2>
			<p class="card-copy">
				Current redirect: <code>{signOutRedirectUrl}</code>
			</p>
			<p class="card-copy">
				That keeps sign-out feeling like “leave the app” rather than “restart auth.” Billing and other preferences can live here in the next phase.
			</p>
		</section>
	</div>
</div>

<style>
.settings-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.page-header {
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid var(--color-border);
}

.eyebrow {
	margin: 0;
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.page-title,
.card-title {
	margin: 0;
	font-family: var(--font-display);
	font-weight: 400;
	color: var(--color-ink);
}

.page-title {
	font-size: 2.3rem;
	line-height: 1.08;
}

.page-desc,
.card-copy {
	margin: 0;
	font-size: 0.95rem;
	line-height: 1.75;
	color: var(--color-muted);
	max-width: 44rem;
}

.settings-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.settings-card {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
	padding: 1.35rem;
	border-radius: 1.2rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 92%, white 8%);
}

.settings-card.muted {
	background: color-mix(in srgb, var(--color-canvas) 90%, white 10%);
}

.card-label {
	margin: 0;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.card-title {
	font-size: 1.55rem;
	line-height: 1.15;
}

.menu-preview {
	max-width: 22rem;
	margin-top: 0.4rem;
}

code {
	padding: 0.1rem 0.35rem;
	border-radius: 0.35rem;
	background: var(--color-canvas);
	font-size: 0.82rem;
}

@media (max-width: 960px) {
	.settings-grid {
		grid-template-columns: 1fr;
	}
}
</style>
