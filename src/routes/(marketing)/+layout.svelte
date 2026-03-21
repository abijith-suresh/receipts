<script lang="ts">
	import MarketingNav from '$lib/components/marketing/MarketingNav.svelte';
	import MarketingFooter from '$lib/components/marketing/MarketingFooter.svelte';

	let { children } = $props();
</script>

<MarketingNav />
{@render children()}
<MarketingFooter />
