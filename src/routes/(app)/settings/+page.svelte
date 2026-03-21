<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { useClerkContext } from 'svelte-clerk';

	const clerk = useClerkContext();
	const signOutRedirectUrl = env.PUBLIC_CLERK_AFTER_SIGN_OUT_URL || '/';
	const displayName = $derived(clerk.user?.fullName || clerk.user?.firstName || 'Your account');
	const emailAddress = $derived(clerk.user?.primaryEmailAddress?.emailAddress || clerk.user?.emailAddresses?.[0]?.emailAddress || 'Signed in with Clerk');
</script>

<div class="settings-page">
	<div class="page-header">
		<p class="eyebrow">Settings</p>
		<h1 class="page-title">Account, plan, and private defaults.</h1>
		<p class="page-desc">
			Keep the settings surface quiet: enough control to trust the product, without turning it into admin work.
		</p>
	</div>

	<div class="settings-grid">
		<section class="settings-card feature">
			<p class="card-label">Account</p>
			<h2 class="card-title">The details tied to your private work log.</h2>
			<div class="detail-list">
				<div>
					<span class="detail-label">Name</span>
					<p>{displayName}</p>
				</div>
				<div>
					<span class="detail-label">Email</span>
					<p>{emailAddress}</p>
				</div>
				<div>
					<span class="detail-label">Auth</span>
					<p>Managed through Clerk with your custom app shell on top.</p>
				</div>
			</div>
		</section>

		<section class="settings-card muted">
			<p class="card-label">Plan & Billing</p>
			<h2 class="card-title">Reserved for the subscription surface.</h2>
			<p class="card-copy">
				This section should eventually show plan status, usage, upgrade paths, and the Stripe customer portal.
			</p>
			<ul class="stub-list">
				<li>Current plan</li>
				<li>Report quota and history access</li>
				<li>Manage subscription</li>
			</ul>
		</section>

		<section class="settings-card muted">
			<p class="card-label">Privacy & Data</p>
			<h2 class="card-title">Everything here should reinforce private-by-default trust.</h2>
			<p class="card-copy">
				Add export, delete-account controls, and a clear explanation of what is stored once those flows are ready.
			</p>
			<ul class="stub-list">
				<li>Private-by-default summary</li>
				<li>Export receipts</li>
				<li>Delete account and data</li>
			</ul>
		</section>

		<section class="settings-card muted">
			<p class="card-label">Preferences</p>
			<h2 class="card-title">Small defaults that reduce friction later.</h2>
			<p class="card-copy">
				Timezone, week start day, and future reporting defaults belong here instead of in the daily writing flow.
			</p>
			<ul class="stub-list">
				<li>Timezone</li>
				<li>Week start day</li>
				<li>Default report range</li>
			</ul>
		</section>

		<section class="settings-card feature">
			<p class="card-label">Session</p>
			<h2 class="card-title">Leaving the workspace takes you back to the public home page.</h2>
			<p class="card-copy">Current sign-out redirect: <code>{signOutRedirectUrl}</code></p>
			<p class="card-copy">
				This keeps logout feeling like “leave the app” instead of “restart auth.”
			</p>
		</section>

		<section class="settings-card muted">
			<p class="card-label">Help</p>
			<h2 class="card-title">A home for support, changelog, and policies.</h2>
			<ul class="stub-list">
				<li><a href="/changelog">Product changelog</a></li>
				<li><a href="https://github.com/abijith-suresh/receipts">Project repository</a></li>
				<li>Privacy policy and terms</li>
			</ul>
		</section>
	</div>
</div>

<style>
.settings-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	max-width: 62rem;
}

.page-header {
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid var(--color-border);
}

.eyebrow,
.card-label,
.detail-label {
	margin: 0;
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
}

.page-title,
.card-title {
	margin: 0;
	font-family: var(--font-display);
	font-weight: 400;
	line-height: 1.08;
	color: var(--color-ink);
}

.page-title {
	font-size: 2.45rem;
	max-width: 44rem;
}

.page-desc,
.card-copy,
.detail-list p,
.stub-list,
.stub-list a {
	margin: 0;
	font-size: 0.94rem;
	line-height: 1.75;
	color: var(--color-muted);
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
	border-radius: 1.25rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 93%, white 7%);
}

.settings-card.feature {
	background: color-mix(in srgb, var(--color-canvas) 88%, white 12%);
}

.detail-list {
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
}

.detail-list div {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.stub-list {
	padding-left: 1.1rem;
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

.stub-list a {
	text-decoration: none;
	color: var(--color-ink);
}

.stub-list a:hover {
	color: var(--color-brand-strong);
}

code {
	padding: 0.12rem 0.35rem;
	border-radius: 0.35rem;
	background: var(--color-canvas);
	font-size: 0.82rem;
	color: var(--color-ink);
}

@media (max-width: 960px) {
	.settings-grid {
		grid-template-columns: 1fr;
	}

	.page-title {
		font-size: 2rem;
	}
}
</style>
