<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { ticketStatus } from '$lib/data';
	import { dndzone } from 'svelte-dnd-action';
	import type { PageData } from './$types';

	export let data: PageData;

	$: tickets = data.tickets;

	const flipDurationMs = 200;

	function handleDndConsiderCards(status: any, e: any) {
		tickets[status] = e.detail.items;
		tickets[status] = [...tickets[status]!];
	}

	async function handleDndFinalizeCards(status: any, e: any) {
		tickets[status] = e.detail.items;
		tickets[status] = [...tickets[status]!];

		if (e.detail.info.trigger == 'droppedIntoZone') {
			let object = tickets[status].find((x) => x.id == e.detail.info.id);
			let indexInNewArray = tickets[status].findIndex((x) => x.id == e.detail.info.id);

			let beforeItem =
				indexInNewArray > 0 ? tickets[status][indexInNewArray - 1]?.lexoRank : undefined;

			let afterItem =
				indexInNewArray < tickets[status].length
					? tickets[status][indexInNewArray + 1]?.lexoRank
					: undefined;

			await fetch('/api/move-ticket', {
				method: 'POST',
				body: JSON.stringify({
					ticketId: object?.id,
					newStatus: status,
					beforeItemLexorank: beforeItem,
					afterItemLexorank: afterItem
				})
			});
		}
	}

	async function selectionChanged(v: any) {
		if (v) {
			await goto(`/teacher${v.value ? '/' + v.value : ''}`, {
				invalidateAll: true
			});
		}
	}

	$: selectedAssignee = {
		label:
			data.allTeacher.find((x) => x.id == $page.params.assignedTeacher)?.username ??
			'Alle Bearbeiter',
		value: $page.params.assignedTeacher ? $page.params.assignedTeacher : undefined
	};
</script>

<div class="flex min-h-full grow flex-col gap-4">
	<Card.Root class="w-full">
		<Card.Content class="flex w-full flex-row justify-end p-3">
			<div class="w-[300px]">
				<Select.Root selected={selectedAssignee} onSelectedChange={selectionChanged}>
					<Select.Trigger>
						<Select.Value placeholder="Alle Bearbeiter" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value={undefined} label="Alle Bearbeiter" />
						{#each data.allTeacher as teacher}
							<Select.Item value={teacher.id} label={teacher.username} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</Card.Content>
	</Card.Root>

	<div class="flex min-h-full w-full grow flex-row justify-between gap-4 overflow-x-auto">
		{#each ticketStatus as status}
			<Card.Root class="min-h-full min-w-[300px] max-w-[300px]">
				<Card.Content class="flex h-full flex-col gap-4 pt-6">
					<h2 class="text-semibold text-lg">{status}</h2>

					<div class="h-[1px] w-full bg-gray-200"></div>

					<div
						class="flex h-full grow flex-col gap-2"
						use:dndzone={{ items: tickets[status] ?? [], flipDurationMs }}
						on:consider={(e) => handleDndConsiderCards(status, e)}
						on:finalize={(e) => handleDndFinalizeCards(status, e)}
						data-status={status}
					>
						{#each tickets[status] ?? [] as ticket (ticket.id)}
							<div
								class="transition-all hover:scale-105"
								on:click={async () => await goto(`/teacher/show-issue/${ticket.id}`)}
							>
								<Card.Root class="w-full">
									<Card.Content class="p-2">
										<h2 class="max-h-6 text-xs text-muted-foreground">
											{ticket.expand!.course.title}
										</h2>

										<div class="mt-2 max-h-6 overflow-auto break-all text-sm">
											{ticket.title}
										</div>

										<div class="mt-2 w-full text-end text-xs text-muted-foreground">
											@{ticket.expand!.assignee.username}
										</div>
									</Card.Content>
								</Card.Root>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
