<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import FlatMapComponent from './FlatMapComponent.svelte';
	import GlobeMapComponent from './GlobeMapComponent.svelte';
	import { writable } from 'svelte/store';
	import type Language from '$lib/model/language';
	import { selectedLanguages } from '$lib/store';
	import { Spinner } from 'flowbite-svelte';
	import { MapHelper } from '$lib/helpers/MapHelper';

	// Screensize flag
	let isMediumScreen = writable(false);

	// Map Data
	let worldData: any = null;
	let isLoading: boolean = true;

	// Reactive subscriptions - Input
	let languages: Language[] = [];
	$: languages = $selectedLanguages;

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
	onMount(async () => {
		
		isLoading = true;

		// Fetch topo json from own api
		worldData = await MapHelper.fetchMapData();

		// Ensure 'window' is accessed only client-side
		if (typeof window !== 'undefined') {
			// Set screen size event listener
			window.addEventListener('resize', checkScreenSize);
			checkScreenSize();
		}

		isLoading = false;
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

<!-- Map Components -->
{#if isLoading}
	<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
		<Spinner color="blue" />
	</div>
{:else if $isMediumScreen}
	<GlobeMapComponent {worldData} {languages} />
{:else}
	<FlatMapComponent {worldData} {languages} />
{/if}
