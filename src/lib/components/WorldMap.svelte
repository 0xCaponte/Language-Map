<script lang="ts">
	import { selectedLanguages } from '$lib/store';
	import { ColoringHelper } from '$lib/helpers/ColoringHelper';
	import { geoEqualEarth, geoPath } from 'd3-geo';
	import { feature, mesh } from 'topojson-client';
	import { onMount } from 'svelte';
	import { json } from 'd3-fetch';
	import type Language from '$lib/model/language';

	// Inputs
	let languages: Language[];

	// Reactive subscriptions
	$: languages = $selectedLanguages;

	// Map Projection.
	const projection = geoEqualEarth();
	const path = geoPath().projection(projection);

	let rawCountries: any = null;
	let countries: any = null;
	let borders: any = null;

	onMount(async () => {
		const world = await json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');

		rawCountries = feature(world, world.objects.countries);
		rawCountries = rawCountries.features;

		borders = mesh(world, world.objects.countries, (a: any, b: any) => a !== b);

		updateCountries();
	});

	// Reactive code to update based on the languages
	$: if (languages && rawCountries) {
		updateCountries();
	}

	/**
	 * Recalculates the  colors of all countries
	 */
	function updateCountries() {
		countries = rawCountries.map((country: { id: string }) => ({
			...country,
			fill: getFillColor(country.id)
		}));
		console.log(countries);
	}

	/**
	 * Get the color to be used to fill the country
	 */
	function getFillColor(countryId: string) {
		let countryInLanguages = false;

		if (languages && languages.length >= 0) {
			countryInLanguages = languages.some((language: Language) =>
				language.hasCountryById(countryId)
			);
		}

		return ColoringHelper.getColorByCountryId(countryId);
	}
</script>

<svg width="100%" height="auto" viewBox="0 0 960 500" style="max-width: 100%; height: auto;">
	{#if countries}
		{#each countries as country}
			<path d={path(country)} fill={country.fill} stroke="#000" />
		{/each}
	{/if}
	{#if borders}
		<path d={path(borders)} fill="none" stroke="#000" />
	{/if}
</svg>
