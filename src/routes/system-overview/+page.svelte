<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex w-full flex-row items-center justify-center">
	<div class="text-2xl font-semibold">Systemübersicht</div>
</div>

<div class="mt-6 grid grid-cols-4 gap-4">
	<Card.Root class="w-full">
		<Card.Content class="h-full pt-6">
			<div class="flex h-full flex-col items-center justify-between gap-6">
				<h2 class="text-center text-xl font-semibold">Abgeschlossene Tickets</h2>

				<h3 class="text-lg font-light">{data.dashboard.DoneTickets} Tickets</h3>
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root class="w-full">
		<Card.Content class="h-full pt-6">
			<div class="flex h-full flex-col items-center justify-between gap-6">
				<h2 class="text-center text-xl font-semibold">Offene Tickets</h2>

				<h3 class="text-lg font-light">{data.dashboard.OpenTickets} Tickets</h3>
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root class="w-full">
		<Card.Content class="h-full pt-6">
			<div class="flex h-full flex-col items-center justify-between gap-6">
				<h2 class="text-center text-xl font-semibold">Registrierte Studenten</h2>

				<h3 class="text-lg font-light">{data.dashboard.StudentUser} Studenten</h3>
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root class="w-full">
		<Card.Content class="h-full pt-6">
			<div class="flex h-full flex-col items-center justify-between gap-6">
				<h2 class="text-center text-xl font-semibold">Registrierte Lehrende</h2>

				<h3 class="text-lg font-light">{data.dashboard.TeacherUser} Lehrende</h3>
			</div>
		</Card.Content>
	</Card.Root>
</div>

<div class="mt-8 flex w-full flex-row items-center justify-center">
	<div class="text-2xl font-semibold">Beispielzugangsdaten</div>
</div>

<div class="mt-6 grid grid-cols-2 gap-4">
	<Card.Root class="w-full">
		<Card.Content class="pt-6">
			<div class="flex flex-row items-center justify-between">
				<div class="flex w-full flex-col gap-4">
					<h2 class="text-xl font-semibold">Studentenzugänge</h2>

					<div class="w-full grow rounded-md bg-gray-50 p-3">
						<div class="text-lg">Benutzername:</div>
						<Input value="max.student@test.com" readonly class="w-full" />

						<div class="mt-4 text-lg">Passwort:</div>
						<Input value="passwort123123" readonly class="w-full" />
					</div>

					<div class="w-full grow rounded-md bg-gray-50 p-3">
						<div class="text-lg">Benutzername:</div>
						<Input value="maxima.student@test.com" readonly class="w-full" />

						<div class="mt-4 text-lg">Passwort:</div>
						<Input value="passwort123123" readonly class="w-full" />
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root class="w-full">
		<Card.Content class="pt-6">
			<div class="flex flex-row items-center justify-between">
				<div class="flex w-full flex-col gap-4">
					<h2 class="text-xl font-semibold">Lehrendenzugänge</h2>

					<div class="w-full grow rounded-md bg-gray-50 p-3">
						<div class="text-lg">Benutzername:</div>
						<Input value="max.teacher@test.com" readonly class="w-full" />

						<div class="mt-4 text-lg">Passwort:</div>
						<Input value="passwort123123" readonly class="w-full" />
					</div>

					<div class="w-full grow rounded-md bg-gray-50 p-3">
						<div class="text-lg">Benutzername:</div>
						<Input value="maxima.teacher@test.com" readonly class="w-full" />

						<div class="mt-4 text-lg">Passwort:</div>
						<Input value="passwort123123" readonly class="w-full" />
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
