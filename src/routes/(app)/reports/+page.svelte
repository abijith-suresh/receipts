<div class="page">
	<div class="page-header">
		<p class="eyebrow">Reports</p>
		<h1 class="page-title">This is where monthly summaries and review prep will live.</h1>
		<p class="page-desc">
			The final reports surface should turn receipts from a selected week, month, or custom range into talking points, review notes, and evidence-backed summaries.
		</p>
	</div>

	<div class="reports-grid">
		<section class="reports-card feature">
			<p class="card-label">Planned flow</p>
			<h2 class="card-title">History becomes the source. Reports becomes the artifact.</h2>
			<ul class="reports-list">
				<li>Choose a time range from History</li>
				<li>Pick the report type</li>
				<li>Generate a summary tied back to receipts</li>
			</ul>
		</section>

		<section class="reports-card muted">
			<p class="card-label">Expected report types</p>
			<ul class="reports-list">
				<li>Monthly recap</li>
				<li>Performance review prep</li>
				<li>1:1 talking points</li>
				<li>Custom range summary</li>
			</ul>
		</section>

		<section class="reports-card muted full-width">
			<p class="card-label">Current state</p>
			<p class="page-desc">
				This route is intentionally a stub so the future implementation can land cleanly without forcing a half-built tool into the main navigation.
			</p>
			<div class="reports-actions">
				<a href="/dashboard">Back to Today</a>
				<a href="/history">Browse History</a>
			</div>
		</section>
	</div>
</div>

<style>
.page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	max-width: 58rem;
}

.page-header {
	display: flex;
	flex-direction: column;
	gap: 0.55rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid var(--color-border);
}

.eyebrow,
.card-label {
	margin: 0;
	font-size: var(--font-size-eyebrow);
	font-weight: 700;
	letter-spacing: var(--letter-spacing-eyebrow);
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
	font-size: 2rem;
	max-width: 44rem;
}

.page-desc,
.reports-list {
	margin: 0;
	font-size: 0.9375rem;
	line-height: 1.75;
	color: var(--color-muted);
	max-width: 44rem;
}

.reports-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.reports-card {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
	padding: 1.35rem;
	border-radius: 1.25rem;
	border: 1px solid var(--color-border);
	background: color-mix(in srgb, var(--color-surface) 93%, white 7%);
}

.reports-card.feature {
	background: color-mix(in srgb, var(--color-canvas) 88%, white 12%);
}

.full-width {
	grid-column: 1 / -1;
}

.card-title {
	font-size: 1.25rem;
}

.reports-list {
	padding-left: 1.1rem;
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

.reports-actions {
	display: flex;
	gap: 0.8rem;
	flex-wrap: wrap;
}

.reports-actions a {
	font-size: 0.875rem;
	font-weight: 600;
	text-decoration: none;
	color: var(--color-ink);
}

.reports-actions a:hover {
	color: var(--color-brand-strong);
}

@media (max-width: 960px) {
	.reports-grid {
		grid-template-columns: 1fr;
	}

	.page-title {
		font-size: 2rem;
	}
}
</style>
