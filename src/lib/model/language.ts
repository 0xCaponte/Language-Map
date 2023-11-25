/**
 * @fileoverview Language Class containing the language's statistics and
 * a list of countries that speak that language.
 */

import type Country from './country';
import type Statistics from './statistics';

class Language {
	// Properties
	name: String;
	statistics: Statistics;
	countries: Country[];

	// Constructors
	constructor(name: String, statistics: Statistics, countries: Country[]) {
		this.name = name;
		this.statistics = statistics;
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
		for (const country of this.countries) {
			if (country.countryId === countryId) {
				return true;
			}
		}
		return false;
	}
}

export default Language;
