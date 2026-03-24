<script lang="ts">
	import BrandWordmark from '$lib/components/BrandWordmark.svelte';
</script>

<footer class="border-t border-border bg-canvas">
	<div class="mx-auto max-w-6xl px-6 py-16">
		<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
			<div class="lg:col-span-2">
				<BrandWordmark href="/" size="lg" descriptor="Your private proof of work" />
				<p class="mt-4 max-w-sm text-sm leading-relaxed text-muted">
					Build a private record of your work, wins, and impact - ready for reviews, 1-on-1s,
					and raise conversations.
				</p>
			</div>

			<div>
				<p class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">Product</p>
				<ul class="mt-4 space-y-3">
					<li>
						<a href="/features" class="text-sm text-muted transition-colors duration-150 hover:text-ink">
							Features
						</a>
					</li>
					<li>
						<a href="/pricing" class="text-sm text-muted transition-colors duration-150 hover:text-ink">
							Pricing
						</a>
					</li>
					<li>
						<a href="/changelog" class="text-sm text-muted transition-colors duration-150 hover:text-ink">
							Changelog
						</a>
					</li>
					<li>
						<a href="/faq" class="text-sm text-muted transition-colors duration-150 hover:text-ink">
							FAQ
						</a>
					</li>
				</ul>
			</div>

			<div>
				<p class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">Account</p>
				<ul class="mt-4 space-y-3">
					<li>
						<a href="/login" class="text-sm text-muted transition-colors duration-150 hover:text-ink">
							Sign in
						</a>
					</li>
					<li>
						<a href="/login" class="text-sm text-muted transition-colors duration-150 hover:text-ink">
							Get started free
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
			<p class="text-xs text-muted">© 2026 Receipts. All rights reserved.</p>
			<p class="text-xs text-muted">
				Built for individual contributors who want proof of their work.
			</p>
		</div>
	</div>
</footer>
