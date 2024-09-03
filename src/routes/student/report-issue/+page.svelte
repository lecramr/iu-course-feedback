<script lang="ts">
	import { goto } from '$app/navigation';
	import TextEditor from '$lib/components/textEditor.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select/index.js';
	import { addIncidentSchema } from '$lib/schema';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;
	const form = superForm(data.form, {
		validators: zodClient(addIncidentSchema),
		onResult: async (e) => {
			toast(`Es wurde eine neue Meldung erstellent!`);
			await goto(`/student/show-issue/${(e.result as any).data.createdIssueId}`);
		}
	});
	const { form: formData, enhance, tainted: formTainted } = form;

	$: selectedCourse = $formData.courseId
		? {
				label: data.courses.find((x) => x.id == $formData.courseId)?.title ?? '',
				value: $formData.courseId
			}
		: undefined;

	$: selectedMaterial = $formData.courseId
		? {
				label: data.materials.find((x) => x.id == $formData.materialId)?.title ?? '',
				value: $formData.materialId
			}
		: undefined;

	const options = {
		theme: 'snow'
	};

	let text = '';
	let html = '';

	const onTextChange = (event: any) => {
		({ text, html } = event?.detail ?? {});
		$formData.description = html;
	};
</script>

<div class="flex h-full w-full flex-col gap-4">
	<Card.Root class="w-full">
		<Card.Content class="pt-6">
			<form method="POST" use:enhance>
				<div class="flex flex-row items-center justify-between">
					<div class="flex flex-row items-center gap-2">
						<h2 class="text-xl font-semibold">Neue Meldung erstellen</h2>

						<!--<h3 class="text-sm font-light">- Erstellt am: {new Date().toLocaleDateString()}</h3>-->
					</div>

					<Form.Button disabled={!$formTainted}>Meldung speichern</Form.Button>
				</div>

				<div class="mt-6 flex w-full flex-col gap-4">
					<Form.Field {form} name="title" class="w-full">
						<Form.Control let:attrs>
							<Form.Label>Titel</Form.Label>
							<Input {...attrs} bind:value={$formData.title} />
						</Form.Control>
						<Form.Description>Wählen Sie den betreffenden Kurs aus.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="description" class="w-full">
						<Form.Control let:attrs>
							<Form.Label>Beschreibung</Form.Label>
							<TextEditor bind:value={$formData.description} />
							<input hidden bind:value={$formData.description} name={attrs.name} />
						</Form.Control>
						<Form.Description>Wählen Sie den betreffenden Kurs aus.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="courseId">
						<Form.Control let:attrs>
							<Form.Label>Kurs</Form.Label>
							<Select.Root
								selected={selectedCourse}
								onSelectedChange={(v) => {
									v && ($formData.courseId = v.value);
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Wählen Sie den betreffenden Kurs aus." />
								</Select.Trigger>
								<Select.Content>
									{#each data.courses as course}
										<Select.Item value={course.id} label={course.title} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.courseId} name={attrs.name} />
						</Form.Control>
						<Form.Description>Wählen Sie den betreffenden Kurs aus.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="materialId">
						<Form.Control let:attrs>
							<Form.Label>Lehrmaterial</Form.Label>
							<Select.Root
								selected={selectedMaterial}
								onSelectedChange={(v) => {
									v && ($formData.materialId = v.value);
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Wählen Sie das betreffende Lehrmaterial aus." />
								</Select.Trigger>
								<Select.Content>
									{#each data.materials as material}
										<Select.Item value={material.id} label={material.title}>
											<div class="flex flex-col gap-1">
												<div class="text-md text-black">{material.title}</div>
												<div class="text-xs text-muted-foreground">{material.description}</div>
											</div>
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.materialId} name={attrs.name} />
						</Form.Control>
						<Form.Description>Wählen Sie das betreffende Lehrmaterial aus.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
