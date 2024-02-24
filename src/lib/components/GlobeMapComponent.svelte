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

	// Calculate Globe Radious
	let padding = 50;
	let viewBoxSize = 960;
	let diameter = viewBoxSize - 2 * padding;
	let radius = diameter / 2;

	// Map setup & rendering
	let projection = geoOrthographic()
		.scale(radius)
		.translate([viewBoxSize / 2, viewBoxSize / 2]);

	let path = geoPath().projection(projection);
	let rotation = [0, 0, 0]; // Initial rotation
	let sphere = { type: 'Sphere' }; // Globe Outline

	let countries = MapHelper.processCountries(worldData);
	let borders = MapHelper.processBorders(worldData);

	// Reactive code to update on map dragging
	$: if (projection) {
		projection.rotate(rotation);
		path = geoPath().projection(projection);
	}

	/**
	 * Calculates the rotation of the globe when the user drags on the map
	 *
	 * @param event
	 */
	function dragged(event: { dx: number; dy: number }) {
		const dx = event.dx;
		const dy = event.dy;
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

	onMount(() => {
		const globe = select('.globe-path');

		// Define drag behavior
		const dragHandler = drag().on(
			'drag',
			(event: { sourceEvent: { target: any }; dx: number; dy: number }) => {
				dragged({ dx: event.dx, dy: event.dy });
			}
		);

		// Apply the drag behavior
		dragHandler(globe);
	});
</script>

<svg width="100%" height="100%" viewBox="0 0 960 960" preserveAspectRatio="xMidYMid meet">
	
	<!-- Globe outline with transparent fill -->
	<path d={path(sphere)} fill="rgba(0,0,0,0)" stroke="#000" class="globe-path" />

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
