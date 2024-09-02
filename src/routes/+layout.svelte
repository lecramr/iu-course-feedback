<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import Footer from '$lib/components/ui/Footer.svelte';
	import Nav from '$lib/components/ui/Nav.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { toast } from '$lib/stores/toast';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

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

<ModeWatcher defaultMode={'dark'} />
<Toaster position="bottom-right" richColors={false} />
<Toast icon={$toast.icon} type={$toast.type} message={$toast.message} show={$toast.show} />

<div class="flex min-h-[calc(100svh)] flex-col md:min-h-screen">
	<Nav />
	<main class="mx-auto my-5 w-full max-w-5xl flex-grow overflow-x-clip px-2 md:my-10">
		<slot />
	</main>
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
