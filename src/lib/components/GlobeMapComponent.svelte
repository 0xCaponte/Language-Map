<script lang="ts">
	import { geoGraticule, geoOrthographic, geoPath } from 'd3-geo';
	import { selectedLanguages } from '$lib/store';
	import type Language from '$lib/model/language';
	import { MapHelper } from '$lib/helpers/MapHelper';

	export let worldData: any;
	export let languages: Language[];

	// Map setup & rendering
    let projection = geoOrthographic().scale(250).translate([480, 250]); 
	let path = geoPath().projection(projection);
	let graticule = geoGraticule();
	let sphere = { type: 'Sphere' }; // Globe Outline

	let countries = MapHelper.processCountries(worldData);
	let borders = MapHelper.processBorders(worldData);

	// Reactive code to update based on the languages
	// Ensures updateCountries is called whenever there's a change in selectedLanguages
	$: $selectedLanguages, MapHelper.updateCountries(countries, languages);
</script>

<svg width="100%" height="100%" viewBox="0 0 960 500" preserveAspectRatio="xMidYMid meet">
	
    <!-- Globe outline -->
	<path d={path(sphere)} fill="none" stroke="#000" />

	{#each countries as country}
		<path
			d={path(country)}
			fill={MapHelper.getCountryFillColor(country.id, languages)}
			stroke="#000"
		/>
	{/each}
	<path d={path(borders)} fill="none" stroke="#000" />
</svg>
