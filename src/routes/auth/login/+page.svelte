<script lang="ts">
	// import { PageData } from './$types.js';
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { siteInfo } from '$lib/data.js';
	import { loginUserSchema } from '$lib/schema';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	let isSubmitting = false;

	const form = superForm(data.form, {
		validators: zodClient(loginUserSchema)
	});

	const { form: formData } = form;
</script>

<svelte:head>
	<title>Login : {siteInfo.name}</title>
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
					<div class="text-5xl font-bold lowercase">Login</div>
					<Icon icon="material-symbols:login" class="contact-title-icon text-5xl" />
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto w-full max-w-xs">
		<form
			method="POST"
			action="/auth/login?"
			class="contact-form"
			use:enhance={({ cancel }) => {
				if (isSubmitting) return cancel(); // Prevent multiple submissions
				isSubmitting = true;

				return async ({ result, update }) => {
					// console.log('Login result:', result);
					if (result.type === 'redirect' && result.location === '/') {
						toast.success('Login Successful', {});
					} else {
						toast('Failed to Login', {
							description: 'Please check your input and try again.'
						});
					}

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

			<div class="mt-5">
				<a href="/auth/reset-password">forgot password?</a>

				<Form.Button disabled={isSubmitting} size="lg" class="group/sendButton mt-2 w-full">
					<div class="flex items-center gap-2">
						<div class="lowercase">login</div>
						<Icon
							icon={`${isSubmitting ? 'mingcute:loading-fill' : 'material-symbols:login'}`}
							class={`${isSubmitting ? 'animate-spin' : ''} h-5 w-5 transition-transform duration-300 lg:group-hover/sendButton:translate-x-1`}
						/>
					</div>
				</Form.Button>
			</div>

			<p class="mt-5 text-center text-sm text-muted-foreground">
				Don't have an account? <a
					href="/auth/register"
					class="underline underline-offset-4 hover:text-primary">Register</a
				>
			</p>
		</form>
	</div>
</div>
