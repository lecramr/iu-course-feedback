<script lang="ts">
	import TextEditor from '$lib/components/textEditor.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select/index.js';
	import { ticketStatus } from '$lib/data.js';
	import { addComment, editIncidentAsTeacherSchema } from '$lib/schema';
	import { cn, timeSince } from '$lib/utils.js';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;
	let { serverTicketForm, serverCommentForm } = data;
	$: ({ serverTicketForm, serverCommentForm } = data);

	const editTicketForm = superForm(serverTicketForm, {
		validators: zodClient(editIncidentAsTeacherSchema),
		resetForm: false,
		multipleSubmits: 'prevent',
		onResult: async (e) => {
			toast(`Die Änderungen wurden gespeichert!`);
		}
	});
	const { form: ticketFormData, enhance: ticketEnhance, tainted: ticketTainted } = editTicketForm;

	const commentForm = superForm(serverCommentForm, {
		validators: zodClient(addComment),
		onResult: async (e) => {
			toast(`Der Kommentar wurde gespeichert!`);
		}
	});

	const { form: commentFormData, enhance: commentEnhance, tainted: commentTainted } = commentForm;

	$: selectedStatus = $ticketFormData.status
		? {
				label: $ticketFormData.status,
				value: $ticketFormData.status
			}
		: undefined;

	$: selectedAssignee = $ticketFormData.assigneeId
		? {
				label: data.allTeacher.find((x) => x.id == $ticketFormData.assigneeId)?.username,
				value: $ticketFormData.assigneeId
			}
		: undefined;

	$: selectedCourse = $ticketFormData.courseId
		? {
				label: data.courses.find((x) => x.id == $ticketFormData.courseId)?.title,
				value: $ticketFormData.courseId
			}
		: undefined;
</script>

<div class="flex h-full w-full flex-col gap-4">
	<Card.Root class="w-full">
		<Card.Content class="pt-6">
			<form method="POST" action="?/updateticket" use:ticketEnhance>
				<div class="flex flex-row items-center justify-between">
					<div class="flex flex-row items-center gap-2">
						<h2 class="text-xl font-semibold">Meldung bearbeiten</h2>

						<h3 class="text-sm font-light">
							- Erstellt am: {new Date(data.ticket.created).toLocaleDateString()}
						</h3>
					</div>

					<Form.Button disabled={!$ticketTainted}>Meldung aktualisieren</Form.Button>
				</div>

				<div class="mt-6 flex w-full flex-col gap-4">
					<Form.Field form={editTicketForm} name="title" class="w-full">
						<Form.Control let:attrs>
							<Form.Label>Titel</Form.Label>
							<Input {...attrs} bind:value={$ticketFormData.title} />
						</Form.Control>
						<Form.Description>Wählen Sie den betreffenden Kurs aus.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field form={editTicketForm} name="description" class="w-full">
						<Form.Control let:attrs>
							<Form.Label>Beschreibung</Form.Label>
							<TextEditor bind:value={$ticketFormData.description} />
							<input hidden bind:value={$ticketFormData.description} name={attrs.name} />
						</Form.Control>
						<Form.Description>Wählen Sie den betreffenden Kurs aus.</Form.Description>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field form={editTicketForm} name="status">
						<Form.Control let:attrs>
							<Form.Label>Status</Form.Label>
							<Select.Root
								selected={selectedStatus}
								onSelectedChange={(v) => {
									v && ($ticketFormData.status = v.value);
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select a verified email to display" />
								</Select.Trigger>
								<Select.Content>
									{#each ticketStatus as status}
										<Select.Item value={status} label={status}></Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$ticketFormData.status} name={attrs.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field form={editTicketForm} name="courseId">
						<Form.Control let:attrs>
							<Form.Label>Kurs</Form.Label>
							<Select.Root
								selected={selectedCourse}
								onSelectedChange={(v) => {
									v && ($ticketFormData.courseId = v.value);
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select a verified email to display" />
								</Select.Trigger>
								<Select.Content>
									{#each data.courses as course}
										<Select.Item value={course.id} label={course.title} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$ticketFormData.courseId} name={attrs.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field form={editTicketForm} name="assigneeId">
						<Form.Control let:attrs>
							<Form.Label>Bearbeiter</Form.Label>
							<Select.Root
								selected={selectedAssignee}
								onSelectedChange={(v) => {
									v && ($ticketFormData.assigneeId = v.value);
								}}
							>
								<Select.Trigger {...attrs}>
									<Select.Value placeholder="Select a verified email to display" />
								</Select.Trigger>
								<Select.Content>
									{#each data.allTeacher as teacher}
										<Select.Item value={teacher.id} label={teacher.username} />
									{/each}
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$ticketFormData.assigneeId} name={attrs.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</form>

			<form class="mt-12" method="POST" action="?/addcomment" use:commentEnhance>
				<div class="flex w-full flex-col gap-6">
					<div>
						<Form.Field form={commentForm} name="body" class="w-full">
							<Form.Control let:attrs>
								<TextEditor
									placeholder="Neuen Kommentar hinzufügen"
									bind:value={$commentFormData.body}
									class="h-36"
								/>
								<input hidden bind:value={$commentFormData.body} name={attrs.name} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<div class="flex flex-row justify-end gap-4">
							<Form.Field
								form={commentForm}
								name="isInternal"
								class="flex flex-row items-center gap-2"
							>
								<Form.Control let:attrs>
									<Checkbox {...attrs} bind:checked={$commentFormData.isInternal} />
									Internes Kommentar?
									<input name={attrs.name} bind:value={$commentFormData.isInternal} hidden />
								</Form.Control>
							</Form.Field>

							<Form.Button
								size="sm"
								class="float-right"
								disabled={!$commentTainted || $commentFormData.body === '<p></p>'}
							>
								>Kommentar hinzufügen</Form.Button
							>
						</div>
					</div>

					<div class="flex max-h-[50vh] flex-col gap-4 overflow-y-auto">
						{#each data.ticketComments as comment}
							<div
								class={cn(
									'w-full rounded-lg border border-gray-200 p-4',
									comment.isInternal ? 'bg-gray-50' : ''
								)}
							>
								<div
									class="flex flex-row items-end justify-end text-sm font-light text-muted-foreground"
								>
									{comment.isInternal ? 'Internes Kommentar' : ''}
								</div>

								<div>
									{@html comment.body}
								</div>

								<div
									class="mt-4 flex w-full flex-row justify-between text-sm text-muted-foreground"
								>
									<div>@{comment.expand!.author.username}</div>
									{timeSince(comment.created)}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
