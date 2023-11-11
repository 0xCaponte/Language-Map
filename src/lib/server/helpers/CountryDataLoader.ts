/**
 * @fileoverview Helper Class to load, parse and give shape to the country
 *  and language data from the countryData.json
 */

import fs from 'fs/promises';
import path from 'path';
import Country from '$lib/model/country';
import Language from '$lib/model/language';
import Statistics from '$lib/model/statistics';

class CountryDataLoader {
	countryMap: Map<string, Country>;
	languageMap: Map<string, Language>;

	constructor() {
		// Initialize the country and language hash maps.
		this.countryMap = new Map();
		this.languageMap = new Map();
	}

	/**
	 * Loads and parses the country data JSON from the server resources directory.
	 * Populates the country and language hash maps with the parsed data.
	 */
	async loadAndParseCountryDataJson(): Promise<void> {
		try {
			const filePath = path.resolve('src', 'lib', 'server', 'resources', 'countryData.json');
			const data = await fs.readFile(filePath, 'utf8');
			const parsedData: CountryData[] = JSON.parse(data);
			this.populateMaps(parsedData);
		} catch (error) {
			console.error('Error loading JSON data:', error);
		}
	}

	/**
	 * Iterates over the parsed country data to populate the country and language hash maps.
	 * @param data - An array of country data objects.
	 */
	private populateMaps(data: CountryData[]): void {
		data.forEach((item) => {
			this.populateCountryMap(item);
			const country = this.countryMap.get(item.name.common);

			if (country) {
				this.populateLanguageMap(item, country);
			}
		});

		this.sortLanguageCountries();
	}

	/**
	 * Populates the country hash map with a new country object.
	 * @param item - A single country data object.
	 */
	private populateCountryMap(item: CountryData): void {
		const { common, official } = item.name;
		const languages = Array.from(
			new Set(Object.values(item.languages).map((lang) => lang.toLowerCase()))
		).sort();
		const country = new Country(
			common,
			official,
			item.independent,
			item.unMember,
			item.population,
			languages
		);

		this.countryMap.set(common, country);
	}

	/**
	 * Populates the language hash map with new or existing language objects and updates their statistics.
	 * @param item - A single country data object.
	 * @param country - The corresponding Country object.
	 */
	private populateLanguageMap(item: CountryData, country: Country): void {
		Object.values(item.languages)
			.map((lang) => lang.toLowerCase())
			.forEach((language) => {
				let languageData = this.languageMap.get(language);
				if (!languageData) {
					languageData = new Language(new Statistics(0, 0), []);
					this.languageMap.set(language, languageData);
				}
				languageData.statistics.totalSpeakers += item.population;
				languageData.statistics.numberOfCountries += 1;
				languageData.countries.push(country);
			});
	}

	/**
	 * Sorts the countries within each language object alphabetically by common name.
	 */
	private sortLanguageCountries(): void {
		this.languageMap.forEach((language) => {
			language.countries.sort((a, b) => a.commonName.localeCompare(b.commonName));
		});
	}
}

export default CountryDataLoader;
