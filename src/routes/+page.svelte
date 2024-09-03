<script lang="ts">
	import { siteInfo } from '$lib/data.js';
	import { currentUser } from '$lib/stores/user.js';
</script>

<svelte:head>
	<title>Home : {siteInfo.name}</title>
	<meta
		name="description"
		content={`${siteInfo.name} is dedicated to providing top-notch services to our clients.`}
	/>
</svelte:head>

<div class="flex flex-col gap-10 md:gap-20">
	<div>
		{#if !$currentUser}
			NOT LOGGED IN
		{:else}
			<div>LOGGED IN</div>
		{/if}
	</div>
</div>
