/**
 * @fileoverview Statistics Class containing the general statistics and total
 * data for a language.
 */

class Statistics {
	// Properties

	// UN-Stats
	totalUNSpeakers: number = 0;
	numberOfUNCountries: number = 0;

	// All Stats
	totalSpeakers: number = 0;
	numberOfCountries: number = 0;

	// Overloaded Constructors
	constructor(data: Partial<Statistics>);
	constructor(
		totalUNSpeakers: number,
		numberOfUNCountries: number,
		totalSpeakers: number,
		numberOfCountries: number
	);
	constructor(
		totalUNSpeakersOrData: number | Partial<Statistics>,
		numberOfUNCountries?: number,
		totalSpeakers?: number,
		numberOfCountries?: number
	) {
		if (typeof totalUNSpeakersOrData === 'object') {
			// Initialize from object
			Object.assign(this, totalUNSpeakersOrData);
		} else {
			// Initialize from properties
			this.totalUNSpeakers = totalUNSpeakersOrData as number;
			this.numberOfUNCountries = numberOfUNCountries!;
			this.totalSpeakers = totalSpeakers!;
			this.numberOfCountries = numberOfCountries!;
		}
	}

	/**************
	 *  Helpers
	 **************/

	/**
	 * Get the total of speakers based on the given UN status.
	 *
	 * @param unMember
	 * @returns
	 */
	getSpeakers(unMember: boolean): number {
		return unMember ? this.totalUNSpeakers : this.totalSpeakers;
	}

	/**
	 * Get the total of countries based on the given UN status.
	 *
	 * @param unMember
	 * @returns
	 */
	getCountries(unMember: boolean): number {
		return unMember ? this.numberOfUNCountries : this.numberOfCountries;
	}
}

export default Statistics;
