<script lang="ts">
	import { geoOrthographic, geoPath } from 'd3-geo';
	import { drag } from 'd3-drag';
	import { select } from 'd3-selection';
	import { selectedLanguages } from '$lib/store';
	import type Language from '$lib/model/language';
	import { MapHelper } from '$lib/helpers/MapHelper';
	import { onMount } from 'svelte';

	export let worldData: any;
	export let languages: Language[];

	// Reactive code to update the map colors based on the languages
	$: $selectedLanguages, MapHelper.updateCountries(countries, languages);

	// Map setup & rendering
	let projection = geoOrthographic().scale(250).translate([480, 250]);
	let path = geoPath().projection(projection);
	let rotation = [0, 0, 0]; // Initial rotation
	let sphere = { type: 'Sphere' }; // Globe Outline

	let countries = MapHelper.processCountries(worldData);
	let borders = MapHelper.processBorders(worldData);

	// Reactive code to update on map dragging
	$: if (projection) {
		projection.rotate(rotation);
		path = geoPath().projection(projection); // Ensure path is updated here too
	}

	/**
	 * Calculates the rotation effects when the user drags on the map
	 *
	 * @param dragEvent
	 */
	function onDrag(dragEvent: { dx: any; dy: any }) {
		const dx = dragEvent.dx;
		const dy = dragEvent.dy;
		const currentRotation = projection.rotate();
		const radius = projection.scale();
		const scale = 360 / (2 * Math.PI * radius);

		rotation = [
			currentRotation[0] + dx * scale,
			currentRotation[1] - dy * scale,
			currentRotation[2]
		];

		projection.rotate(rotation);
	}

	// Called at the start of a touch event, currently does nothing but it is needed for functionality
	function onStart(event: { dx: any; dy: any }) {
		console.log('start draging');
	}

	// Called at the end of a touch event, currently does nothing but it is needed for functionality
	function onEnd(event: { dx: any; dy: any }) {
		console.log('end draging');
	}

	/**
	 * Sets-up the drag event for the SVG map and partially prevent defautl scroll behav
	 */
	onMount(() => {
		const svg = select('svg').call(drag().on('start', onStart).on('drag', onDrag).on('end', onEnd));
	});
	
</script>

<svg width="100%" height="100%" viewBox="0 0 960 500" preserveAspectRatio="xMidYMid meet">
	<!-- Globe outline -->
	<path d={path(sphere)} fill="none" stroke="#000" />

	<!--Countries -->
	{#each countries as country}
		<path
			d={path(country)}
			fill={MapHelper.getCountryFillColor(country.id, languages)}
			stroke="#000"
		/>
	{/each}

	<!--Borders -->
	<path d={path(borders)} fill="none" stroke="#000" />
</svg>
