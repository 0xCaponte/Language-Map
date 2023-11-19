<script lang="ts">
	import { selectedLanguages } from '$lib/store';
	import { geoEqualEarth, geoPath } from 'd3-geo';
	import { feature, mesh } from 'topojson-client';
	import { onMount } from 'svelte';
	import { json } from 'd3-fetch';
	import type Language from '$lib/model/language';

	// Input Languages
	let languages: Language[];

	// Reactive subscription to the store
	$: languages = $selectedLanguages;

	// Prepare Projection.
	const projection = geoEqualEarth();
	const path = geoPath().projection(projection);

	let land: any = null;
	let borders: any = null;

	/**
	 * OnMount load the Geo Data form World-Atlas
	 */
	onMount(async () => {
		// Geo Data from World-Atlas
		json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((world: any) => {
			land = feature(world, world.objects.land);
			borders = mesh(world, world.objects.countries, (a: any, b: any) => a !== b);
		});
	});
</script>

<svg width="100%" height="auto" viewBox="0 0 960 500" style:max-width="100%" style:height="auto">
	<path d={path(land)} fill="none" stroke="#000" />
	<path d={path(borders)} fill="none" stroke="#000" />
</svg>
