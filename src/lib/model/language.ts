/**
 * @fileoverview Language Class containing the language's statistics and
 * a list of countries that speak that language.
 */

import type Country from './country';
import type Statistics from './statistics';

class Language {
	
	// Properties
	statistics: Statistics;
	countries: Country[];

	// Constructors
	constructor(statistics: Statistics, countries: Country[]) {
		this.statistics = statistics;
		this.countries = countries;
	}
}

export default Language;
