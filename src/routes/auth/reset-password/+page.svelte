<script lang="ts">
	// import { PageData } from './$types.js';
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { siteInfo } from '$lib/data.js';
	import { resetPasswordSchema } from '$lib/schema';
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	let isSubmitting = false;

	const form = superForm(data.form, {
		validators: zodClient(resetPasswordSchema)
	});

	const { form: formData } = form;

	let ScrollTriggerInstance: any;

	onDestroy(() => {
		if (typeof window !== 'undefined' && ScrollTriggerInstance) {
			ScrollTriggerInstance.getAll().forEach((trigger: any) => trigger.kill());
		}
	});
</script>

<svelte:head>
	<title>Reset-Password : {siteInfo.name}</title>
	<meta
		name="description"
		content={`Contact us for more information about our services. We are dedicated to providing top-notch services to our clients.`}
	/>
</svelte:head>
<div
	class="flex h-full w-full flex-col justify-center gap-5 rounded-lg p-5 sm:min-h-full md:flex-col md:justify-center md:border-none md:shadow-none"
>
	<div class="flex w-full items-center justify-center">
		<div class="w-full max-w-xs">
			<div class="contact-header flex flex-col items-start gap-2">
				<div class="flex w-full items-center justify-center gap-5">
					<div class="text-5xl font-bold">Passwort vergessen</div>
					<!-- <Icon icon="material-symbols:login" class="contact-title-icon text-5xl" /> -->
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto w-full max-w-xs">
		<form
			method="POST"
			action="?/resetPassword"
			class="contact-form"
			use:enhance={({ cancel }) => {
				if (isSubmitting) return cancel(); // Prevent multiple submissions
				isSubmitting = true;

				return async ({ result, update }) => {
					toast.success(
						'Wenn eine E-Mail gefunden wurde, wird eine Passwort-Zurücksetzungs-Mail gesendet.'
					);

					await update();
					isSubmitting = false;
				};
			}}
		>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="mt-5">
				<!-- <a href="/auth/stuff">forgot password?</a> -->

				<Form.Button disabled={isSubmitting} size="lg" class="group/sendButton w-full">
					<div class="flex items-center gap-2">
						<div class="">Absenden</div>
					</div>
				</Form.Button>
			</div>

			<p class="mt-5 text-center text-sm text-muted-foreground">
				Noch keinen Account? <a
					href="/auth/register"
					class="underline underline-offset-4 hover:text-primary">Jetzt registrieren</a
				>
			</p>
		</form>
	</div>
</div>
