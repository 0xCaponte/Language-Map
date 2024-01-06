<script lang="ts">
	import { selectedLanguages } from '$lib/store';
	import { ColoringHelper } from '$lib/helpers/ColoringHelper';
	import { geoEquirectangular, geoPath } from 'd3-geo';
	import { feature, mesh } from 'topojson-client';
	import { onMount } from 'svelte';
	import { json } from 'd3-fetch';
	import { Spinner } from 'flowbite-svelte';
	import type Language from '$lib/model/language';
	
	// Inputs
	let languages: Language[];

	// Reactive subscriptions
	$: languages = $selectedLanguages;

	// Map Projection.
	const projection = geoEquirectangular();
	const path = geoPath().projection(projection);

	let rawCountries: any = null;
	let countries: any = null;
	let borders: any = null;
	let isLoading: boolean = true;

	onMount(async () => {
		isLoading = true;

		// Fetch topo json from own api
		const world = await json('/api/world');

		// Filter out Antarctica (id '010')
		rawCountries = feature(world, world.objects.countries);
		rawCountries = rawCountries.features;
		rawCountries = rawCountries.filter((country: { id: string }) => country.id !== '010');

		// Excluse Antarctica for the borders
		const countriesWithoutAntarctica = {
			...world.objects.countries,
			geometries: world.objects.countries.geometries.filter((geo: any) => geo.id !== '010')
		};

		// Generate borders excluding Antarctica
		borders = mesh(world, countriesWithoutAntarctica, (a: any, b: any) => a !== b);

		isLoading = false;

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

{#if isLoading}
	<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
		<Spinner color="blue" />
	</div>
{:else}
	<svg width="100%" height="100%" viewBox="0 0 960 400" preserveAspectRatio="xMidYMid meet">
		{#if countries}
			{#each countries as country}
				<path d={path(country)} fill={country.fill} stroke="#000" />
			{/each}
		{/if}
		{#if borders}
			<path d={path(borders)} fill="none" stroke="#000" />
		{/if}
	</svg>
{/if}
