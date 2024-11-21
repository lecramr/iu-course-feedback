<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from 'svelte-sonner';

	export let form;
	export let data;
	let loading: any;

	$: loading = false;

	const submitUpdateEmail = () => {
		loading = true;
		return async ({ result }: any) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();

					toast(
						'Bitte bestätigen Sie Ihre neue E-Mail-Adresse, indem Sie auf den Link klicken, den wir Ihnen gerade per E-Mail gesendet haben.'
					);
					break;
				case 'error':
					await invalidateAll();

					toast('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<div class="flex h-full w-full flex-col space-y-12">
	<div class="w-full">
		<div class="mb-5 text-3xl font-bold md:text-5xl">Account Einstellungen</div>
		<div class="text-2xl">E-Mail Adresse ändern</div>

		<form
			action="?/updateEmail"
			method="POST"
			class="mt-2 space-y-2"
			use:enhance={submitUpdateEmail}
		>
			<Input
				id="email"
				type="email"
				name="email"
				required={true}
				placeholder={data?.user?.email}
				value={form?.data?.email}
				disabled={loading}
			/>
			<Button type="submit" variant="default" class="" disabled={loading}>Aktualisieren</Button>
		</form>
	</div>
</div>
