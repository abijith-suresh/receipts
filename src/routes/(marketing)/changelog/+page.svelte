<svelte:head>
	<title>Changelog — receipts.cv</title>
	<meta
		name="description"
		content="What's new in receipts.cv — product updates, improvements, and release notes."
	/>
</svelte:head>

<!-- Hero -->
<section class="py-20 pb-8 text-center">
	<h1
		class="font-display text-4xl sm:text-5xl text-ink mb-4"
		style="letter-spacing: -0.02em;"
	>
		What's new.
	</h1>
	<p class="text-muted text-base sm:text-lg">
		Every update to receipts.cv, in reverse chronological order.
	</p>
</section>

<!-- Changelog entries -->
<div class="max-w-2xl mx-auto px-6 pb-24">
	<div class="timeline">

		<!-- Entry 1: v0.2 -->
		<div class="entry">
			<span class="entry-dot active"></span>
			<div class="entry-meta">
				<span class="version-badge current">v0.2</span>
				<span class="entry-date">March 2026</span>
			</div>
			<div class="entry-title">Dashboard redesign &amp; smarter app shell</div>
			<p class="entry-desc">A complete visual overhaul of the logged-in experience.</p>
			<ul class="entry-bullets">
				<li>
					<span class="bullet-dot"></span>
					<span>Replaced top-bar layout with a persistent sidebar on desktop</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>Active nav link highlighting across all app pages</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>Cleaner entry cards — flat design with hover lift</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>Improved empty timeline state with better copy</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>Form redesign: back-link, cleaner input focus states</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>Loading screen now shows a minimal brand pulse instead of full text</span>
				</li>
			</ul>
		</div>

		<!-- Entry 2: v0.1 -->
		<div class="entry">
			<span class="entry-dot"></span>
			<div class="entry-meta">
				<span class="version-badge old">v0.1</span>
				<span class="entry-date">February 2026</span>
			</div>
			<div class="entry-title">Initial launch — the core logging loop</div>
			<p class="entry-desc">The first version of receipts.cv is live.</p>
			<ul class="entry-bullets">
				<li>
					<span class="bullet-dot"></span>
					<span>Daily work logging with plain-language notes</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>AI structuring via Claude — extracts tasks, skills, and impact</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>Private personal timeline with all your entries</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>Secure auth via Clerk</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>Real-time sync with Convex backend</span>
				</li>
				<li>
					<span class="bullet-dot"></span>
					<span>Mobile-responsive web app</span>
				</li>
			</ul>
		</div>

		<!-- Entry 3: v0.0 -->
		<div class="entry">
			<span class="entry-dot"></span>
			<div class="entry-meta">
				<span class="version-badge old">v0.0</span>
				<span class="entry-date">January 2026</span>
			</div>
			<div class="entry-title">Project started</div>
			<p class="entry-desc">
				receipts.cv began as a personal tool — a way to remember what actually happened at work,
				week to week.
			</p>
			<p class="entry-desc" style="margin-bottom: 0;">
				The problem was simple: performance reviews reward those who remember, not those who
				contributed most. This tool exists to close that gap.
			</p>
		</div>

	</div>
</div>

<!-- Bottom strip -->
<div class="max-w-2xl mx-auto px-6 pb-16">
	<div class="flex items-center gap-3 flex-wrap">
		<span class="text-muted text-sm">More updates coming soon. Built in public.</span>
		<a href="https://github.com/abijith-suresh/receipts" class="text-brand text-sm hover:text-brand-strong transition-colors">
			Follow progress on GitHub →
		</a>
	</div>
</div>

<style>
	.timeline {
		position: relative;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 0.4375rem; /* 7px — center of the dot */
		top: 0.5rem;
		bottom: 0;
		width: 1px;
		background-color: var(--color-border);
	}

	.entry {
		position: relative;
		padding-left: 2rem;
		padding-bottom: 3.5rem;
	}

	.entry:last-child {
		padding-bottom: 0;
	}

	.entry-dot {
		position: absolute;
		left: 0;
		top: 0.4rem;
		width: 0.875rem;
		height: 0.875rem;
		border-radius: 9999px;
		background-color: var(--color-surface);
		border: 2px solid var(--color-border);
	}

	.entry-dot.active {
		background-color: var(--color-brand);
		border-color: var(--color-brand);
	}

	.version-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.125rem 0.625rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
	}

	.version-badge.current {
		background-color: var(--color-brand-soft);
		color: var(--color-brand-strong);
	}

	.version-badge.old {
		background-color: #f4f4f5;
		color: var(--color-muted);
	}

	.entry-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.entry-date {
		font-size: 0.8125rem;
		color: var(--color-muted);
	}

	.entry-title {
		font-family: var(--font-display);
		font-size: 1.375rem;
		color: var(--color-ink);
		line-height: 1.3;
		margin-bottom: 0.5rem;
	}

	.entry-desc {
		font-size: 0.9375rem;
		color: var(--color-muted);
		line-height: 1.65;
		margin-bottom: 0.875rem;
	}

	.entry-bullets {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.entry-bullets li {
		display: flex;
		align-items: flex-start;
		gap: 0.625rem;
		font-size: 0.9375rem;
		color: var(--color-muted);
		line-height: 1.6;
	}

	.bullet-dot {
		width: 0.3125rem;
		height: 0.3125rem;
		border-radius: 9999px;
		background-color: var(--color-brand);
		flex-shrink: 0;
		margin-top: 0.5625rem;
	}
</style>
