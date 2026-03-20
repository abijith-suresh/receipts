<script lang="ts">
import { useConvexClient } from 'convex-svelte';

import { auth } from '$lib/auth/state';
import { api } from '$lib/convex';

const convex = useConvexClient();

let bootstrappedFor = $state<string | null>(null);

$effect(() => {
	if (
		!$auth.ready ||
		!$auth.signedIn ||
		!$auth.userId ||
		bootstrappedFor === $auth.userId
	) {
		return;
	}

	bootstrappedFor = $auth.userId;

	void convex.mutation(api.users.ensureCurrentUser, {});
});
</script>
