<script lang="ts">
import EmptyTimeline from '$lib/components/EmptyTimeline.svelte';
import type { LogEntry } from '$lib/convex';

import EntryCard from './EntryCard.svelte';

const { entries } = $props<{ entries: LogEntry[] }>();
</script>

{#if entries.length === 0}
	<EmptyTimeline />
{:else}
	<div class="space-y-5">
		{#each entries as entry (entry._id)}
			<EntryCard {entry} />
		{/each}
	</div>
{/if}
