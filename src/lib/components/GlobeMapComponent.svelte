<script lang="ts">
	import { onMount } from 'svelte';
	import { json } from 'd3-fetch';
	import { geoOrthographic, geoPath } from 'd3-geo';
	import { feature, mesh } from 'topojson-client';
	import { Spinner } from 'flowbite-svelte';
	import { selectedLanguages } from '$lib/store';
	import { ColoringHelper } from '$lib/helpers/ColoringHelper';
	import type Language from '$lib/model/language';

	// Reactive subscriptions - Input
	let languages: Language[] = [];
	$: languages = $selectedLanguages;

	// Map setup & rendering
	let projection = geoOrthographic();
	let path = geoPath().projection(projection);

	let rawCountries: any = null;
	let countries: any = null;
	let borders: any = null;
	let isLoading: boolean = true;

	onMount(async () => {
		isLoading = true;

		// Fetch topo json from own api
		const world = await json('/api/world');

		// Generate countries
		rawCountries = feature(world, world.objects.countries);
		rawCountries = rawCountries.features;

		// Generate borders
		borders = mesh(world, rawCountries, (a: any, b: any) => a !== b);

		isLoading = false;

		updateCountries();
	});

	// Reactive code to update based on the languages
	// Ensures updateCountries is called whenever there's a change in selectedLanguages
	$: $selectedLanguages, updateCountries();

	/**
	 * Recalculates the colors of all countries based on the selected languages
	 */
	function updateCountries() {
		if (!rawCountries) return; // Ensure rawCountries is loaded before attempting to update

		countries = rawCountries.map((country: { id: string }) => ({
			...country,
			fill: getFillColor(country.id)
		}));
	}

	/**
	 * Get the color to be used to fill the country
	 */
	function getFillColor(countryId: string) {
		// Default for empty languages
		if (!languages || languages.length === 0) {
			return ColoringHelper.getDefaultColor();
		}

		let countryInLanguages = languages.some((language: Language) =>
			language.hasCountryById(countryId)
		);

		return countryInLanguages
			? ColoringHelper.getColorByCountryId(countryId)
			: ColoringHelper.getDefaultColor();
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
