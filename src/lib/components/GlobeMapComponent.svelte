<script lang="ts">
	import { geoOrthographic, geoPath } from 'd3-geo';
	import { selectedLanguages } from '$lib/store';
	import type Language from '$lib/model/language';
	import { MapHelper } from '$lib/helpers/MapHelper';

	export let worldData: any;
	export let languages: Language[];

	// Map setup & rendering
	let projection = geoOrthographic();
	let path = geoPath().projection(projection);
	let countries = MapHelper.processCountries(worldData);
	let borders = MapHelper.processBorders(worldData);

	// Reactive code to update based on the languages
	// Ensures updateCountries is called whenever there's a change in selectedLanguages
	$: $selectedLanguages, MapHelper.updateCountries(countries, languages);
</script>

<svg width="100%" height="100%" viewBox="0 0 960 500" preserveAspectRatio="xMidYMid meet">
	{#each countries as country}
		<path
			d={path(country)}
			fill={MapHelper.getCountryFillColor(country.id, languages)}
			stroke="#000"
		/>
	{/each}
	<path d={path(borders)} fill="none" stroke="#000" />
</svg>
