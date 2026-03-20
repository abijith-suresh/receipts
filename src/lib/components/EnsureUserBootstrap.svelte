<script lang="ts">
import { useConvexClient } from 'convex-svelte';
import { useClerkContext } from 'svelte-clerk';

import { convexAuthReady } from '$lib/auth/convexAuth';
import { api } from '$lib/convex';

const clerk = useClerkContext();
const convex = useConvexClient();

let bootstrappedFor = $state<string | null>(null);

$effect(() => {
	if (
		!clerk.isLoaded ||
		!clerk.auth.userId ||
		!$convexAuthReady ||
		bootstrappedFor === clerk.auth.userId
	) {
		return;
	}

	bootstrappedFor = clerk.auth.userId;

	void convex.mutation(api.users.ensureCurrentUser, {});
});
</script>
