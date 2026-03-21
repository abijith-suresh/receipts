<section class="empty">
	<p class="empty-eyebrow">Start your receipts habit</p>
	<h2 class="empty-title">Nothing logged yet.</h2>
	<p class="empty-desc">
		Write the kind of update you wish you could remember three months from now: shipped work,
		bugs fixed, hard conversations, blockers, and momentum.
	</p>
	<a class="empty-cta" href="/entry/new">Log today</a>
</section>

<style>
.empty {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 2.5rem 2rem;
	border-radius: 1rem;
	border: 1px dashed var(--color-border);
	background-color: var(--color-surface);
}

.empty-eyebrow {
	font-size: var(--font-size-eyebrow);
	font-weight: 700;
	letter-spacing: var(--letter-spacing-eyebrow);
	text-transform: uppercase;
	color: var(--color-brand-strong);
	margin: 0;
}

.empty-title {
	font-family: var(--font-display);
	font-size: 1.875rem;
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.25;
}

.empty-desc {
	font-size: 0.9375rem;
	line-height: 1.75;
	color: var(--color-muted);
	margin: 0;
	max-width: 38rem;
}

.empty-cta {
	display: inline-flex;
	align-items: center;
	margin-top: 0.5rem;
	padding: 0.625rem 1.25rem;
	border-radius: 9999px;
	background-color: var(--color-ink);
	color: #fff;
	font-size: 0.875rem;
	font-weight: 600;
	text-decoration: none;
	transition: transform 0.15s ease, background-color 0.15s ease;
	align-self: flex-start;
}

.empty-cta:hover {
	transform: translateY(-1px);
	background-color: var(--color-brand-strong);
}
</style>
