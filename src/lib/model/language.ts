/**
 * @fileoverview Language Class containing the language's statistics and
 * a list of countries that speak that language.
 */

import Country from './country';
import Statistics from './statistics';

class Language {
	// Properties
	name: string;
	statistics: Statistics;
	countries: Country[];

	// Constructors
	constructor(name: string, statistics: Statistics, countries: Country[]) {
		this.name = name;
		this.statistics = new Statistics(statistics);

		this.countries = countries.map(country => new Country(
			country.countryId,
			country.cca2,
			country.commonName,
			country.officialName,
			country.flag,
			country.independent,
			country.unMember,
			country.population,
			country.languages
		));
	}

	/**************
	 *  Helpers
	 **************/

	/**
	 * Based on the ISO 3166-1 country ID, checks if a country is in the countries list of the object.
	 *
	 * @param countryId
	 * @returns
	 */
	hasCountryById(countryId: string): boolean {
		return this.countries.some((country) => country.countryId === countryId);
	}

	/**
 	* Checks if non-UN countries are present in this language's data
 	* 
 	* @returns True if there are non-UN countries in the data
 	*/
	 hasNonUNCountries(): boolean {
		return this.statistics.numberOfCountries > this.statistics.numberOfUNCountries;
	}
}

export default Language;
