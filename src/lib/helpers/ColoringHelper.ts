import type Language from '$lib/model/language';
import { get } from 'svelte/store';
import { languageColors, countryColors } from '$lib/store';

const baseColors = [
	'#D32F2F', // Red
	'#1976D2', // Blue
	'#388E3C', // Green
	'#FBC02D', // Yellow
	'#8E24AA', // Purple
	'#F57C00', // Orange
	'#0288D1', // Light Blue
	'#C2185B', // Pink
	'#7B1FA2', // Deep Purple
	'#C0CA33', // Lime
	'#FF5722', // Deep Orange
	'#009688', // Teal
	'#607D8B', // Blue Grey
	'#795548', // Brown
	'#9E9E9E', // Grey
	'#E91E63', // Hot Pink
	'#3F51B5', // Indigo
	'#00BCD4', // Cyan
	'#8BC34A', // Light Green
	'#FFEB3B' // Bright Yellow
];

export class ColoringHelper {
	/**
	 * Populates the stored maps with the colors assigned to each language and country.
	 *
	 * @param languages
	 */
	public static assignColors(languages: Language[]): void {
		
		const countryMapping = new Map<string, string>();
		const laguageMapping = new Map<string, string>();

		languages.forEach((language, index) => {
			const color = this.getLanguageColorByIndex(index);

			laguageMapping.set(language.name, color);

			language.countries.forEach((country) => {
				if (!countryMapping.has(country.countryId)) {
					countryMapping.set(country.countryId, color);
				}
			});
		});

		languageColors.set(laguageMapping);
		countryColors.set(countryMapping);
	}

	/**
	 * Returns the color assigned to this language or 'none' if the language is not mapped
	 * 
	 * @param languageName
	 * @returns
	 */
	public static getColorByLanguageName(languageName: string): string {
		const currentLanguageColors = get(languageColors);
		return currentLanguageColors.get(languageName) || 'none';
	}

	/**
	 * Returns the color assigned to this country or 'none' if the country is not mapped
	 * 
	 * @param countryId
	 * @returns
	 */
	public static getColorByCountryId(countryId: string): string {
		const currentCountryColorMapping = get(countryColors);
		return currentCountryColorMapping.get(countryId) || 'none';
	}

	/**
	 * Returns the pre-defined color asigned to this index or to its module
	 *
	 * @param index
	 * @returns
	 */
	private static getLanguageColorByIndex(index: number): string {
		return baseColors[index % baseColors.length];
	}
}
