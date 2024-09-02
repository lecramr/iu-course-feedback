<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { siteInfo } from '$lib/data.js';
	import { registerUserSchema } from '$lib/schema';
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	let isSubmitting = false;

	const form = superForm(data.form, {
		validators: zodClient(registerUserSchema)
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
	<title>Register : {siteInfo.name}</title>
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
					<div class="text-5xl font-bold lowercase">Register</div>
					<Icon icon="material-symbols:login" class="contact-title-icon text-5xl" />
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto w-full max-w-xs">
		<form
			method="POST"
			action="/auth/register?"
			class="contact-form"
			use:enhance={({ cancel }) => {
				if (isSubmitting) return cancel(); // Prevent multiple submissions
				isSubmitting = true;

				return async ({ result, update }) => {
					// console.log('Registration result:', result);
					if (result.type === 'redirect' && result.location === '/auth/login') {
						toast.success('Registration Successful!', {
							description: 'You can now log in with your new account.'
						});
					}

					// else {
					// 	toast.error('Failed to Submit Form', {
					// 		description: 'Please check your input and try again.'
					// 	});
					// }

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

			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="passwordConfirm">
				<Form.Control let:attrs>
					<Form.Label>Confirm Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.passwordConfirm} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="mt-5">
				{#if $formData.password}
					<div
						in:fade={{ duration: 500 }}
						class="alert mb-2 flex rounded border border-primary p-2 text-sm"
					>
						<Icon icon="material-symbols:encrypted" class="h-10 w-10 text-primary" />
						<div class="text-left">
							Your password will be encrypted for your safety, it will not be readable by anyone.
						</div>
					</div>
				{/if}

				<Form.Button disabled={isSubmitting} size="lg" class="group/sendButton w-full">
					<div class="flex items-center gap-2">
						<div class="lowercase">register</div>
						<Icon
							icon={`${isSubmitting ? 'mingcute:loading-fill' : 'mdi:plus'}`}
							class={`${isSubmitting ? 'animate-spin' : ''} h-5 w-5 transition-transform duration-300 lg:group-hover/sendButton:rotate-90`}
						/>
					</div>
				</Form.Button>
			</div>

			<p class="mt-5 text-center text-sm text-muted-foreground">
				Already have an account? <a
					href="/auth/login"
					class="underline underline-offset-4 hover:text-primary">Login</a
				>
			</p>
		</form>
	</div>
</div>
