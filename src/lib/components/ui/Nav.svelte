<script lang="ts">
	import DropdownMenu from '$lib/components/ui/DropdownMenu.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import { currentUser } from '$lib/stores/user';
	import { cn } from '$lib/utils';
	import { Bell, BellDot } from 'lucide-svelte';
	import type { RecordModel } from 'pocketbase';
	import { ScrollArea } from './scroll-area';

	async function openChange(e: boolean) {
		if (e) {
			await setNotificationsRead();
		} else {
			notifications.forEach((x) => (x.isRead = true));
			notifications = [...notifications];
		}
	}

	export let notifications: RecordModel[];
	$: hasUnreadNotification = notifications.some((x) => !x.isRead);

	async function setNotificationsRead() {
		await fetch('/api/read-notifications', {
			method: 'POST'
		});
	}
</script>

<nav class={`nav sticky top-0 -z-[-1] border-b bg-background p-2`}>
	<div class="mx-auto flex w-full max-w-5xl items-center justify-between">
		<a href="/" class="nav-logo" aria-label="Home">
			<div class="px-2 text-lg font-light">IU - Course Feedback System</div>
		</a>

		<div class="buttons flex items-center gap-2">
			{#if $currentUser}
				<Popover.Root onOpenChange={openChange}>
					<Popover.Trigger>
						<Button variant="ghost" on:click={setNotificationsRead} size="icon">
							{#if hasUnreadNotification}
								<BellDot class="text-light animate-bounce" />
							{:else}
								<Bell class="text-light" />
							{/if}
						</Button>
					</Popover.Trigger>
					<Popover.Content>
						<ScrollArea class="h-[300px] w-full">
							<div class="flex flex-col">
								{#each notifications as notification}
									<div
										class={cn(
											'my-2 rounded-sm border-b border-gray-100 p-2',
											!notification.isRead ? 'bg-gray-100' : ''
										)}
									>
										<div class="text-xs font-semibold">{notification.title}</div>
										<div class="mt-2 text-xs">{@html notification.body}</div>
									</div>
								{/each}
							</div>
						</ScrollArea>
					</Popover.Content>
				</Popover.Root>
				<ThemeToggle />
				<DropdownMenu />
			{:else}
				<div class="flex items-center gap-2">
					<a href="/auth/login">
						<Button variant="ghost">Login</Button>
					</a>
					<a href="/auth/register">
						<Button variant="ghost">Registrieren</Button>
					</a>
				</div>
			{/if}
		</div>
	</div>
</nav>
