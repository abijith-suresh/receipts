<script lang="ts">
import { useConvexClient } from 'convex-svelte';
import { onMount } from 'svelte';

import { startClerkAuth } from '$lib/auth/state';

const convex = useConvexClient();

onMount(() => {
	void startClerkAuth(convex);
});
</script>
