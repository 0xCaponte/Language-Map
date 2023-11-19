/**
 * @fileoverview Helper Class with functions to summarize the information of the selected languages.
 */

import type Country from '$lib/model/country';
import Language from '$lib/model/language';
import Statistics from '$lib/model/statistics';

export class CountryDataHelper {

	/**
	 * Filters the countries of a language based on the UN membership statud desired. 
	 * 
	 * @param languages 
	 * @param unMember 
	 * @returns 
	 */
	public getFilteredCountries(languages: Language[], unMember: boolean): Language[] {
		let filteredData: Language[] = [];

		languages.forEach((language) => {
			// Filter countries based on unMember parameter
			let filteredCountries = language.countries.filter((country) => country.unMember === unMember);

			let newLanguage: Language = {
				...language,
				countries: filteredCountries
			};

			filteredData.push(newLanguage);
		});

		return filteredData;
	}

	/**
	 * Add up all the countries and speakers of the input languages
	 *
	 * @param languages
	 * @returns
	 */
	public getLanguageSummary(languages: Language[]): Language {
		let countriesSet = new Set<Country>();
		let totalSpeakers = 0;

		languages.forEach((language) => {
			language.countries.forEach((e) => countriesSet.add(e));

			let statistics = language.statistics;
			totalSpeakers += statistics.totalSpeakers;
		});

		let countries = [...countriesSet];

		const languageStatistics = new Statistics(totalSpeakers, countries.length);
		const languageSummary = new Language('Totals', languageStatistics, countries);

		return languageSummary;
	}
}
