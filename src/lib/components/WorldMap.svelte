<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import FlatMapComponent from './FlatMapComponent.svelte';
	import GlobeMapComponent from './GlobeMapComponent.svelte';
	import { writable } from 'svelte/store';

	let isMediumScreen = writable(false);

	/**
	 * Check screen size initially and on resize
	 */
	function checkScreenSize() {
		if (typeof window !== 'undefined') {
			isMediumScreen.set(window.innerWidth <= 768);
		}
	}
	
	/**
	 * Determines the size of the screen and sets a listener for screen resize events.
	 */
	onMount(() => {
		// Ensure 'window' is accessed only client-side
		if (typeof window !== 'undefined') {
			// Set screen size event listener
			window.addEventListener('resize', checkScreenSize);
			checkScreenSize();
		}
	});

	/**
	 * Removes a previously added listener for screen resize events.
	 */
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', checkScreenSize);
		}
	});
</script>

<svelte:component this={$isMediumScreen ? GlobeMapComponent : FlatMapComponent} />
