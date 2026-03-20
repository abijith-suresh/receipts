<script lang="ts">
import { useConvexClient } from 'convex-svelte';
import { useClerkContext } from 'svelte-clerk';

import { convexAuthReady } from '$lib/auth/convexAuth';

const clerk = useClerkContext();
const convex = useConvexClient();

$effect(() => {
	if (!clerk.isLoaded) {
		convexAuthReady.set(false);
		return;
	}

	convex.setAuth(async ({ forceRefreshToken }) => {
		return (
			(await clerk.session?.getToken({
				skipCache: forceRefreshToken,
			})) ?? null
		);
	});

	convexAuthReady.set(true);

	return () => {
		convexAuthReady.set(false);
	};
});
</script>
