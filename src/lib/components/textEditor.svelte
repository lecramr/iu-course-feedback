<script lang="ts">
	import { cn } from '$lib/utils';
	import type Quill from 'quill';
	import 'quill/dist/quill.snow.css';

	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let value: string = '';

	export let placeholder: string = 'Beschreibung...';

	let className: string = '';
	export { className as class };

	let quillEditor: Quill;
	let editorDiv: Writable<HTMLDivElement | null> = writable(null);

	function handleQuillInput() {
		value = quillEditor!.getSemanticHTML();
	}

	onMount(async () => {
		const { default: quillModule } = await import('quill/quill');
		const Quill = quillModule;

		if ($editorDiv) {
			$editorDiv.innerHTML = value;

			quillEditor = new Quill($editorDiv, {
				modules: {
					toolbar: true
				},
				placeholder: placeholder,
				theme: 'snow'
			});

			quillEditor.on('text-change', handleQuillInput);
		}
	});

	export function resetValue() {
		console.log('we here');
		quillEditor.setText('');
	}
</script>

<div id="quill-editor-wrapper">
	<div bind:this={$editorDiv} id="quill-summary-editor" class={cn('h-48', className)}></div>
</div>
