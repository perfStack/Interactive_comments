<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Comments from '$lib/comments/Comments.svelte';
</script>

<svelte:head>
	<meta name="description" content="Interactive comments section" />
	<title>Comments section</title>
</svelte:head>

<Comments />
