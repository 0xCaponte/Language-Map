<script lang="ts">
        import { geoNaturalEarth1, geoPath } from 'd3-geo';
        import { selectedCountry, selectedLanguages } from '$lib/store';
        import type Language from '$lib/model/language';
        import { MapHelper } from '$lib/helpers/MapHelper';
        import CountryLookupHelper from '$lib/helpers/CountryLookupHelper';
        import { tick } from 'svelte';

	export let worldData: any;
	export let languages: Language[];

	// Map setup & rendering
	const condensedVersion = true; // without Antarctica
	let projection = geoNaturalEarth1();
	let path = geoPath().projection(projection);
        let countries = MapHelper.processCountries(worldData, condensedVersion);
        let borders = MapHelper.processBorders(worldData, condensedVersion);

        let activeCountryId: string | null = null;
        $: activeCountryId = $selectedCountry?.countryId ?? null;

	// Reactive code to update based on the languages
	// Ensures updateCountries is called whenever there's a change in selectedLanguages
        $: $selectedLanguages, MapHelper.updateCountries(countries, languages);

        async function handleCountrySelection(countryId: string | undefined) {
                const country = await CountryLookupHelper.getCountryById(countryId);

                if (country) {
                        selectedCountry.set(country);
                        await tick();
                }
        }

        function onCountryClick(event: MouseEvent, countryId: string | undefined) {
                event.stopPropagation();
                handleCountrySelection(countryId);
        }

        function onCountryKeydown(event: KeyboardEvent, countryId: string | undefined) {
                if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleCountrySelection(countryId);
                }
        }
</script>

<svg width="100%" height="100%" viewBox="0 0 960 500" preserveAspectRatio="xMidYMid meet">
        {#each countries as country}
                <path
                        d={path(country)}
                        fill={MapHelper.getCountryFillColor(country.id, languages)}
                        stroke={activeCountryId === country.id ? '#1d4ed8' : '#000'}
                        stroke-width={activeCountryId === country.id ? 2 : 1}
                        class="country-path"
                        class:selected-country={activeCountryId === country.id}
                        data-country-id={country.id}
                        data-country-name={country.properties?.name}
                        role="button"
                        tabindex="0"
                        aria-pressed={activeCountryId === country.id}
                        aria-label={country.properties?.name ?? `Country ${country.id}`}
                        on:click={(event) => onCountryClick(event, country.id)}
                        on:keydown={(event) => onCountryKeydown(event, country.id)}
                />
        {/each}
        <path d={path(borders)} fill="none" stroke="#1f2933" stroke-width="0.7" pointer-events="none" />
</svg>

<style>
        .country-path {
                cursor: pointer;
                transition: stroke-width 0.2s ease, filter 0.2s ease;
        }

        .country-path:hover {
                stroke-width: 1.5;
        }

        .selected-country {
                filter: drop-shadow(0 0 6px rgba(37, 99, 235, 0.6));
        }
</style>
