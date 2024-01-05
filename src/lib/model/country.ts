/**
 * @fileoverview Country Class containing all the data of the country. 
 * This includes: common name, oficial name, UN member status, independent status,
 *  population and languages spoken.
 */

class Country {

    // Properties
	countryId: string; // ISO 3166-1 numeric 
	cca2: string; // ISO 3166-1 alpha-2
	commonName: string;
	officialName: string;
	flag: string; // Emoji
	independent: boolean;
	unMember: boolean;
	population: number;
	languages: CountryLanguage[];

    // Constructors
	constructor(
		countryId: string,
		cca2: string,
		commonName: string,
		officialName: string,
		flag: string,
		independent: boolean,
		unMember: boolean,
		population: number,
		languages: CountryLanguage[]
	) {
		this.countryId = countryId;
		this.commonName = commonName;
		this.officialName = officialName;
		this.independent = independent;
		this.unMember = unMember;
		this.population = population;
		this.languages = languages;
		this.cca2 =cca2;
		this.flag = flag;
	}
}

export default Country;
