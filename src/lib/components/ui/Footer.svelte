<script lang="ts">
	import { siteInfo } from '$lib/data';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let showFooter = false;

	onMount(() => {
		setTimeout(() => {
			showFooter = true;
		}, 500);
	});
</script>

{#if showFooter}
	<footer class="w-full border-t bg-background py-5" in:fade={{ duration: 1000 }}>
		<div class="mx-auto flex w-full max-w-5xl items-center justify-center">
			<a href="https://github.com/lecramr" class="text-sm">
				&copy; {new Date().getFullYear()}
				{siteInfo.name}. All rights reserved.
			</a>
		</div>
	</footer>
{/if}
