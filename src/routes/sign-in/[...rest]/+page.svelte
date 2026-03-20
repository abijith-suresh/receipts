<script lang="ts">
import ClerkAuthForm from '$lib/components/ClerkAuthForm.svelte';
</script>

<svelte:head>
	<title>Sign in - receipts.cv</title>
</svelte:head>

<section class="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
	<div class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:items-start">
		<div class="rounded-[2.4rem] border border-white/70 bg-white/80 p-8 shadow-[0_32px_90px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-10">
			<p class="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-strong)]">Welcome back</p>
			<h1 class="mt-4 font-display text-4xl text-[var(--color-ink)] sm:text-5xl">Open your private evidence locker.</h1>
			<p class="mt-5 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
				Sign in to keep a clean record of shipped work, difficult wins, and the details that vanish by review season.
			</p>
		</div>

		<div class="rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
			<ClerkAuthForm variant="sign-in" />
		</div>
	</div>
</section>
