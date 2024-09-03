<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { currentUser } from '$lib/stores/user';
	import { getImageURL } from '$lib/utils';
</script>

<Avatar.Root class="border border-primary">
	<Avatar.Image
		class="transition-transform duration-200 ease-in-out hover:scale-105"
		src={$currentUser?.avatar
			? getImageURL($currentUser?.collectionId, $currentUser?.id, $currentUser?.avatar)
			: `https://ui-avatars.com/api/?name=${$currentUser?.email}`}
		alt="User avatar"
	/>
	<Avatar.Fallback class="text-foreground">CN</Avatar.Fallback>
</Avatar.Root>
