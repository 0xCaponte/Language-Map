/**
 * @fileoverview Language Class containing the language's statistics and
 * a list of countries that speak that language.
 */

import type Country from './country';
import type Statistics from './statistics';

class Language {
	
	// Properties
	name : String; 
	statistics: Statistics;
	countries: Country[];

	// Constructors
	constructor(name: String, statistics: Statistics, countries: Country[]) {
		this.name = name;
		this.statistics = statistics;
		this.countries = countries;
	}
}

export default Language;
