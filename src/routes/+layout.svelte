<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import Footer from '$lib/components/ui/Footer.svelte';
	import Nav from '$lib/components/ui/Nav.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	export let data;

	onNavigate((navigation) => {
		// @ts-ignore
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
	// END VIEW TRANSITIONS API
</script>

<ModeWatcher defaultMode={'light'} />
<Toaster position="bottom-right" richColors={false} />

<div class="flex min-h-screen flex-col md:min-h-screen">
	<Nav notifications={data.notifications} />
	<div class="mx-auto my-5 flex w-full flex-grow flex-col overflow-x-clip px-12 md:my-10">
		<div class="flex grow flex-col items-center">
			<slot />
		</div>
	</div>
	<Footer />
</div>

<style>
	html,
	body {
		height: 100%;
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}
</style>
