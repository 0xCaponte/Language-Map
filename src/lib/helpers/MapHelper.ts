/**
 * @fileoverview Helper Class to perform multiple map related functions and logic
 */

import type Language from '$lib/model/language';
import { json } from 'd3-fetch';
import { feature, mesh } from 'topojson-client';
import { ColoringHelper } from './ColoringHelper';

export class MapHelper {
	/**
	 * Fetches topo json from own api
	 *
	 * @param apiUrl
	 * @returns
	 */
	public static async fetchMapData(apiUrl = '/api/world') {
		const world = await json(apiUrl);
		return world;
	}

	/**
	 * Given the world topo json data it creates the country data.
	 * By default antartica is also included but that can be cahgned acording to the desired output map.
	 *
	 * @param world
	 * @param condensedVersion
	 * @returns
	 */
	public static processCountries(world: any, condensedVersion: boolean = false) {
		let countries: any = feature(world, world.objects.countries);
		countries = countries.features;

		if (condensedVersion) {
			// Filter out Antarctica (id '010')
			countries = countries.filter((country: { id: string }) => country.id !== '010');
		}

		return countries;
	}

	/**
	 * Given the world topo json data it creates the data for the borders between the countries.
	 *
	 * @param world
	 * @param condensedVersion
	 * @returns
	 */
	public static processBorders(world: any, condensedVersion: boolean = false) {
		const excludedIds = ['010']; // IDs for Antarctica ('010')

		const filteredGeometries = world.objects.countries.geometries.filter((geo: any) => {
			return !condensedVersion || !excludedIds.includes(geo.id);
		});

		const countriesCondensed: any = {
			...world.objects.countries,
			geometries: filteredGeometries
		};

		return mesh(world, countriesCondensed, (a: any, b: any) => a !== b);
	}
	/**
	 * Recalculates the colors of all countries based on the selected languages
	 */
	public static updateCountries(countries: any, languages: Language[]) {
		if (!countries) return; // Ensure data is loaded before attempting to update

		countries = countries.map((country: { id: string }) => ({
			...country,
			fill: this.getCountryFillColor(country.id, languages)
		}));
	}

	/**
	 * Get the color to be used to fill the country
	 */
	public static getCountryFillColor(countryId: string, languages: Language[]) {
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
}
