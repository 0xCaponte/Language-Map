<script lang="ts">
	import { selectedLanguages } from '$lib/store';
	import { geoEqualEarth, geoPath } from 'd3-geo';
	import { feature, mesh } from 'topojson-client';
	import { onMount } from 'svelte';
	import { json } from 'd3-fetch';
	import type Language from '$lib/model/language';

	// Input Languages
	let languages: Language[];

	// Reactive subscriptions
	$: languages = $selectedLanguages;

	// Prepare Projection.
	const projection = geoEqualEarth();
	const path = geoPath().projection(projection);

	let countries: any = null;
	let borders: any = null;

	/**
	 * OnMount load the Geo Data form World-Atlas
	 */
	onMount(async () => {
		// Geo Data from World-Atlas
		const world = await json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');

		countries = feature(world, world.objects.countries);
		countries = countries.features;

		borders = mesh(world, world.objects.countries, (a: any, b: any) => a !== b);
	});

	/**
	 * Get country fill color based on the country's ISO 3166-1 numeric country code (ID)
	 * 
	 * @param countryId
	 */
	function getFillColor(countryId: string) {
		const countryInLanguages = languages.some((lang) => lang.hasCountryById(countryId));
		return countryInLanguages ? 'blue' : 'lightgray'; // Change colors as needed.
	}
</script>

<svg width="100%" height="auto" viewBox="0 0 960 500" style:max-width="100%" style:height="auto">
	{#if countries}
		{#each countries as country}
			<path d={path(country)} fill={getFillColor(country.id)} stroke="#000" />
		{/each}
	{/if}
	{#if borders}
		<path d={path(borders)} fill="none" stroke="#000" />
	{/if}
</svg>
