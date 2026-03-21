<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		description,
		forId,
		children,
	}: {
		label: string;
		description: string;
		forId: string;
		children: Snippet;
	} = $props();
</script>

<div class="setting-field">
	<div class="setting-copy">
		<label class="setting-label" for={forId}>{label}</label>
		<p class="setting-description">{description}</p>
	</div>
	<div class="setting-control">
		{@render children()}
	</div>
</div>

<style>
	.setting-field {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(14rem, 1fr);
		gap: 1rem;
		align-items: start;
		padding: 1.25rem 0;
		border-top: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
	}

	.setting-field:first-child {
		padding-top: 0;
		border-top: none;
	}

	.setting-copy {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.setting-label,
	.setting-description {
		margin: 0;
	}

	.setting-label {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--color-ink);
	}

	.setting-description {
		font-size: 0.86rem;
		line-height: 1.65;
		color: var(--color-muted);
	}

	.setting-control {
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	@media (max-width: 760px) {
		.setting-field {
			grid-template-columns: 1fr;
			gap: 0.875rem;
		}

		.setting-control {
			justify-content: flex-start;
		}
	}
</style>
