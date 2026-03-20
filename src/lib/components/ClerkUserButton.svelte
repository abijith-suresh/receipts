<script lang="ts">
import { onMount } from 'svelte';

import { getClerk } from '$lib/auth/clerk';

let container = $state<HTMLDivElement | null>(null);

onMount(() => {
	let cleanup = () => {};

	void (async () => {
		if (!container) {
			return;
		}

		const clerk = await getClerk();

		clerk.mountUserButton(container, {
			showName: false,
			signInUrl: '/sign-in',
		});

		cleanup = () => {
			if (container) {
				clerk.unmountUserButton(container);
			}
		};
	})();

	return () => {
		cleanup();
	};
});
</script>

<div bind:this={container} class="min-h-10 min-w-10"></div>
