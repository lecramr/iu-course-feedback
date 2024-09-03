<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="w-full max-w-5xl grow">
	<slot />
</div>
