/**
 * @fileoverview Country Class containing all the data of the country. 
 * This includes: common name, oficial name, UN member status, independent status,
 *  population and languages spoken.
 */

class Country {

    // Properties
	countryId: string; // ISO 3166-1 
	commonName: string;
	officialName: string;
	independent: boolean;
	unMember: boolean;
	population: number;
	languages: string[];

    // Constructors
	constructor(
		countryId: string,
		commonName: string,
		officialName: string,
		independent: boolean,
		unMember: boolean,
		population: number,
		languages: string[]
	) {
		this.countryId = countryId;
		this.commonName = commonName;
		this.officialName = officialName;
		this.independent = independent;
		this.unMember = unMember;
		this.population = population;
		this.languages = languages;
	}
}

export default Country;
