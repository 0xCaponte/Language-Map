<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
		script.onload = () => {
			// Access kofiWidgetOverlay through the window object

			// @ts-ignore
			if (window.kofiWidgetOverlay) {
				// @ts-ignore
				window.kofiWidgetOverlay.draw('caponte', {
					type: 'floating-chat',
					'floating-chat.donateButton.text': '🚀',
					'floating-chat.donateButton.background-color': '#00b9fe',
					'floating-chat.donateButton.text-color': '#fff'
				});
			}
		};

		// Append script to the document body
		document.body.appendChild(script);
	});
</script>
