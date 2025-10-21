<script lang="ts">
        import { geoOrthographic, geoPath } from 'd3-geo';
        import { drag } from 'd3-drag';
        import { select } from 'd3-selection';
        import { selectedCountry, selectedLanguages } from '$lib/store';
        import type Language from '$lib/model/language';
        import { MapHelper } from '$lib/helpers/MapHelper';
        import { onMount } from 'svelte';
        import { ReplyOutline } from 'flowbite-svelte-icons';
        import CountryLookupHelper from '$lib/helpers/CountryLookupHelper';
        import { tick } from 'svelte';

	export let worldData: any;
	export let languages: Language[];

        // Reactive code to update the map colors based on the languages
        $: $selectedLanguages, MapHelper.updateCountries(countries, languages);

        let activeCountryId: string | null = null;
        $: activeCountryId = $selectedCountry?.countryId ?? null;

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

        async function handleCountrySelection(countryId: string | undefined) {
                const country = await CountryLookupHelper.getCountryById(countryId);

                if (country) {
                        selectedCountry.set(country);
                        await tick();
                }
        }

        function onCountryClick(event: MouseEvent, countryId: string | undefined) {
                event.stopPropagation();
                if (event.currentTarget instanceof SVGPathElement) {
                        event.currentTarget.focus();
                }
                handleCountrySelection(countryId);
        }

        function onCountryKeydown(event: KeyboardEvent, countryId: string | undefined) {
                if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleCountrySelection(countryId);
                }
        }
</script>

<div class="container">
	<div class="svg-container">
		<svg width="100%" height="100%" viewBox="0 0 960 960" preserveAspectRatio="xMidYMid meet">
			<!-- Globe outline with transparent fill -->
			<path d={path(sphere)} fill="rgba(0,0,0,0)" stroke="#000" class="globe-path" />

                        <!--Countries -->
                        {#each countries as country}
                                {@const fillColor = MapHelper.getCountryFillColor(country.id, languages)}
                                {@const isDefaultFill = !fillColor || fillColor === 'none'}
                                <path
                                        d={path(country)}
                                        fill={isDefaultFill ? '#ffffff' : fillColor}
                                        fill-opacity={isDefaultFill ? 0.01 : 1}
                                        pointer-events="fill"
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

                        <!--Borders -->
                        <path d={path(borders)} fill="none" stroke="#1f2933" stroke-width="0.7" pointer-events="none" />
                </svg>
        </div>

	<!-- Rotation icons -->
	<div class="icons">
		<ReplyOutline
			color="darkgray"
			class="w-4 h-4 sm:w-6 sm:h-6 md:w-8 h-8"
			style="transform: rotate(230deg);"
		/>
		<ReplyOutline
			color="darkgray"
			class="w-4 h-4 sm:w-6 sm:h-6 md:w-8 h-8"
			style="transform: rotate(50deg);"
		/>
	</div>
</div>

<style>
        .container {
                position: relative; /* This makes it a reference for absolutely positioned children */
                overflow: hidden;
        }

        .icons {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 40%;
                display: flex;
                justify-content: space-between;
                padding: 0 50;
                pointer-events: none !important;
        }

        .country-path {
                cursor: pointer;
                transition: stroke-width 0.2s ease, filter 0.2s ease;
                touch-action: manipulation;
                pointer-events: fill;
        }

        .country-path:hover {
                stroke-width: 1.5;
        }

        .selected-country {
                filter: drop-shadow(0 0 6px rgba(37, 99, 235, 0.6));
        }
</style>
