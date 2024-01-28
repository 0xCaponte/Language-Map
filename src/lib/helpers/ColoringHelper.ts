import type Language from '$lib/model/language';
import { get } from 'svelte/store';
import { languageColors, countryColors } from '$lib/store';

const baseColors = [
	'#1976D2', // Blue
	'#FFEB3B', // Bright Yellow
	'#D32F2F', // Red
	'#32B600', // Green
	'#A6A6ED', // Lavender
	'#F57C00', // Orange
	'#00BCD4', // Cyan
	'#E91E96', // Hot Pink
	'#FFFB91', // Neon Yellow
	'#9E9E9E', // Grey
	'#FF5722', // Deep Orange
	'#009688', // Teal
	'#795548', // Brown
	'#3F51B5', // Indigo
	'#8BC34A', // Light Green
	'#FBC02D' // Yellow
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
				if (country.countryId && !countryMapping.has(country.countryId)) {
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
