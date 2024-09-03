<script lang="ts">
	import TextEditor from '$lib/components/textEditor.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { addComment, editIncidentSchema } from '$lib/schema';
	import { timeSince } from '$lib/utils.js';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	const editTicketForm = superForm(data.form, {
		validators: zodClient(editIncidentSchema),
		onResult: async (e) => {
			toast(`Die Änderungen wurden gespeichert!`);
		}
	});
	const { form: ticketFormData, enhance: ticketEnhance, tainted: ticketTainted } = editTicketForm;

	const commentForm = superForm(data.commentForm, {
		validators: zodClient(addComment),
		onResult: async (e) => {
			toast(`Der Kommentar wurde gespeichert!`);
		}
	});
	const { form: commentFormData, enhance: commentEnhance, tainted: commentTainted } = commentForm;
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

					<div class="grid grid-cols-4">
						<div
							class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Status:
						</div>

						<div
							class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							<Badge variant="outline">{data.ticket.status}</Badge>
						</div>

						<div
							class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Bearbeiter:
						</div>

						<div
							class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{data.ticket.expand!.assignee.username}
						</div>
					</div>
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

						<Form.Button size="sm" class="float-right" disabled={!$commentTainted}
							>Kommentar hinzufügen</Form.Button
						>
					</div>

					<div class="flex max-h-[50vh] flex-col gap-4 overflow-y-auto">
						{#each data.ticketComments as comment}
							<div class="w-full rounded-lg border border-gray-200 p-4">
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
