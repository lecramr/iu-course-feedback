<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
</script>

<div class="flex h-full w-full flex-col">
	<div class="w-full">
		<form action="?/updatePassword" method="POST" class="flex w-full flex-col space-y-2">
			<div class="text-3xl font-bold md:text-5xl">Passwort ändern</div>
			<div class="divider"></div>
			<Input
				name="oldPassword"
				id="oldPassword"
				type="password"
				required
				placeholder="Derzeitiges Passwort"
			/>
			<Input name="password" id="password" type="password" required placeholder="Neues Passwort" />
			<Input
				name="passwordConfirm"
				id="passwordConfirm"
				type="password"
				required
				placeholder="Passwort bestätigen"
			/>

			<div class="">
				<div class="mt-2 w-full max-w-lg">
					<Button type="submit" class="w-full max-w-lg">Passwort aktualisieren</Button>
				</div>
			</div>
		</form>
	</div>
</div>
