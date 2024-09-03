<script lang="ts">
	import { goto } from '$app/navigation';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { pb } from '$lib/pocketbase';
	import { currentUser } from '$lib/stores/user';
	import { gsap } from 'gsap';
	import { Lock, LogOut, PersonStanding } from 'lucide-svelte';
	import { onMount } from 'svelte';

	function handleLogout() {
		pb.authStore.clear();
		// Clear AI chat messages
		// chatMessages.set([]);
		localStorage.removeItem('chatMessages');
		goto('/');
	}

	onMount(() => {
		gsap.from('.dropdown-menu-item', {
			opacity: 0,
			stagger: 0.1,
			duration: 2.25
		});
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} class="rounded-full p-0">
			<Avatar />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="mt-3 w-fit max-w-64 bg-background" align="end">
		<DropdownMenu.Label class=" p-0">
			<DropdownMenu.Item class="">
				<a
					href="/my/settings/profile"
					data-sveltekit-preload-data="hover"
					class="flex w-full items-center gap-2"
				>
					<div class="dropdown-menu-item">
						<Avatar />
					</div>
					<div class="truncate">
						<h3 class="overflow-hidden text-ellipsis text-base">@{$currentUser.username}</h3>
						<p class="overflow-hidden text-ellipsis text-xs font-thin text-foreground/70">
							{$currentUser.email}
						</p>
					</div>
				</a>
			</DropdownMenu.Item>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />

		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<a
					href="/my/settings/account"
					data-sveltekit-preload-data="hover"
					class="flex w-full items-center"
				>
					<PersonStanding />
					<span>Account</span>
				</a>
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<a
					href="/my/settings/security"
					data-sveltekit-preload-data="hover"
					class="flex w-full items-center"
				>
					<Lock />
					<span>Security</span>
				</a>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<form
				class="flex w-full"
				method="POST"
				action="/auth/logout"
				on:submit={handleLogout}
				aria-label="Logout"
			>
				<button type="submit" class="flex w-full items-center">
					<LogOut />
					<span>Logout</span>
				</button>
			</form>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
