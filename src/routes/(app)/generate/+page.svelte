<div class="page">
	<div class="page-header">
		<p class="eyebrow">Coming next</p>
		<h1 class="page-title">Report generation lands after the logging loop.</h1>
		<p class="page-desc">
			This page is reserved for talking points and review prep once we complete the AI layer.
		</p>
	</div>

	<div class="placeholder">
		<div class="placeholder-icon">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M9 12h6M9 16h6M9 8h3M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
			</svg>
		</div>
		<p class="placeholder-text">Keep logging daily. Your entries become the raw material for AI-powered review summaries, talking points, and performance evidence.</p>
	</div>
</div>

<style>
.page {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.page-header {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid var(--color-border);
}

.eyebrow {
	font-size: 0.6875rem;
	font-weight: 700;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--color-brand-strong);
	margin: 0;
}

.page-title {
	font-family: var(--font-display);
	font-size: 2rem;
	font-weight: 400;
	color: var(--color-ink);
	margin: 0;
	line-height: 1.2;
}

@media (min-width: 640px) {
	.page-title {
		font-size: 2.25rem;
	}
}

.page-desc {
	font-size: 0.9375rem;
	line-height: 1.7;
	color: var(--color-muted);
	margin: 0;
}

.placeholder {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: flex-start;
	padding: 2rem;
	border-radius: 1rem;
	border: 1px dashed var(--color-border);
	background-color: var(--color-surface);
}

.placeholder-icon {
	color: var(--color-brand);
	opacity: 0.6;
}

.placeholder-text {
	font-size: 0.9375rem;
	line-height: 1.75;
	color: var(--color-muted);
	margin: 0;
	max-width: 38rem;
}
</style>
