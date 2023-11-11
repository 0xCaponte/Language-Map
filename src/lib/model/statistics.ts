/**
 * @fileoverview Statistics Class containing the general statistics and total 
 * data for a language.
 */

class Statistics {
	
	// Properties
	totalSpeakers: number;
	numberOfCountries: number;

	// Constructors
	constructor(totalSpeakers: number, numberOfCountries: number) {
		this.totalSpeakers = totalSpeakers;
		this.numberOfCountries = numberOfCountries;
	}
}

export default Statistics;
