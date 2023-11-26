/**
 * @fileoverview Language Class containing the language's statistics and
 * a list of countries that speak that language.
 */

import type Country from './country';
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
		this.countries = countries;
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
}

export default Language;
