<script lang="ts">
	import AuthShowcase from '$lib/components/auth/AuthShowcase.svelte';
</script>

<svelte:head>
	<title>Sign in - receipts.cv</title>
	<meta
		name="description"
		content="Sign back in to your private receipts.cv workspace and pick up your career record where you left off."
	/>
</svelte:head>

<AuthShowcase mode="sign-in" />
