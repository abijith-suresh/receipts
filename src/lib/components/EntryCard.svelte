<script lang="ts">
import type { LogEntry } from '$lib/convex';
import { formatEntryDate } from '$lib/utils/date';

const { entry } = $props<{ entry: LogEntry }>();
</script>

<article class="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur transition hover:-translate-y-0.5">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-strong)]">
			{formatEntryDate(entry.entryDate)}
		</p>
		<p class="text-xs text-[var(--color-muted)]">Saved instantly to your private timeline</p>
	</div>

	<h3 class="mt-4 font-display text-2xl text-[var(--color-ink)]">{entry.summary}</h3>
	<p class="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--color-muted)] sm:text-base">
		{entry.rawInput}
	</p>
</article>
