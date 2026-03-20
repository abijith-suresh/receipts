<script lang="ts">
import { onMount } from 'svelte';

import { getClerk } from '$lib/auth/clerk';

type Variant = 'sign-in' | 'sign-up';

const { variant } = $props<{ variant: Variant }>();

let container = $state<HTMLDivElement | null>(null);

onMount(() => {
	let cleanup = () => {};

	void (async () => {
		if (!container) {
			return;
		}

		const clerk = await getClerk();

		if (variant === 'sign-in') {
			clerk.mountSignIn(container, {
				path: '/sign-in',
				routing: 'path',
				signUpUrl: '/sign-up',
				fallbackRedirectUrl: '/dashboard',
				withSignUp: true,
			});

			cleanup = () => {
				if (container) {
					clerk.unmountSignIn(container);
				}
			};

			return;
		}

		clerk.mountSignUp(container, {
			path: '/sign-up',
			routing: 'path',
			signInUrl: '/sign-in',
			fallbackRedirectUrl: '/dashboard',
		});

		cleanup = () => {
			if (container) {
				clerk.unmountSignUp(container);
			}
		};
	})();

	return () => {
		cleanup();
	};
});
</script>

<div bind:this={container} class="min-h-[28rem]"></div>
