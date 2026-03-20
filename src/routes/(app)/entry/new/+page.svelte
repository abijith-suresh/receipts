<script lang="ts">
import EntryForm from '$lib/components/EntryForm.svelte';
</script>

<section class="space-y-6">
	<div class="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
		<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-strong)]">Capture the day</p>
		<h2 class="mt-2 font-display text-3xl text-[var(--color-ink)]">Log today's work before it fades.</h2>
		<p class="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
			Drop in the rough version now. We'll add the AI structure loop in the next phase.
		</p>
	</div>

	<EntryForm />
</section>
