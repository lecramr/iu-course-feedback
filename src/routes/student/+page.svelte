<script lang="ts">
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex h-full w-full flex-col gap-4">
	<h1 class="text-xl font-semibold">Willkommen {data.user!.username},</h1>

	<Card.Root class="w-full">
		<Card.Content class="pt-6">
			<div class="flex flex-row items-center justify-between">
				<div class="flex flex-col gap-4">
					<h2 class="text-2xl font-semibold">Neuen Fehler melden</h2>

					<h3 class="text-xl font-light">Melden Sie einen neuen Fehler in einem Lehrmaterial.</h3>
				</div>

				<Button on:click={() => goto('student/report-issue')}>Fehler melden!</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Content class="pt-6">
			<div>
				<div class="flex flex-row items-center justify-between">
					<div class="flex flex-col gap-2">
						<h2 class="text-2xl font-semibold">Eigene Meldungen</h2>

						<h3 class="text-sm font-light">
							Hier sehen Sie eine Liste Ihrer bisherigen Meldungen.
						</h3>
					</div>
				</div>

				<div class="mt-5 flex flex-col gap-4">
					{#each data.tickets as ticket}
						<Card.Root class="w-full">
							<Card.Content class="p-4">
								<div class="flex flex-row items-center justify-between">
									<div class="flex flex-col gap-1">
										<h2 class="text-lg font-semibold"># {ticket.title}</h2>

										<div class="flex w-full flex-row flex-wrap items-center gap-2">
											<Badge variant="outline">{ticket.status}</Badge>
											<div class="text-sm text-muted-foreground">
												- Erstellt am: {new Date(ticket.created).toLocaleDateString()}
											</div>
										</div>
									</div>

									<Button variant="outline" on:click={() => goto(`student/show-issue/${ticket.id}`)}
										>Meldung anzeigen</Button
									>
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
