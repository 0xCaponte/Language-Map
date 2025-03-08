/**
 * @fileoverview Country Class containing all the data of the country.
 * This includes: common name, oficial name, UN member status, independent status,
 *  population and languages spoken.
 */

class Country {
	// Properties
	countryId: string | undefined; // ISO 3166-1 numeric
	cca2: string | undefined; // ISO 3166-1 alpha-2
	commonName: string = '';
	officialName: string | undefined;
	flag: string | undefined; // Emoji
	independent: boolean | undefined;
	unMember: boolean | undefined;
	population: number = 0;
	languages: CountryLanguage[] = [];


	 // Overloaded Constructors
	 constructor(data: Partial<Country>);
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
	 );
	 constructor(countryId: string, unMember: boolean);
	 constructor(
		 countryIdOrData: string | Partial<Country>,
		 cca2OrUnMember?: string | boolean,
		 commonName?: string,
		 officialName?: string,
		 flag?: string,
		 independent?: boolean,
		 unMember?: boolean,
		 population?: number,
		 languages?: CountryLanguage[] 
	 ) {
		 if (typeof countryIdOrData === 'object') {
			 // Initialize from object
			 Object.assign(this, countryIdOrData);
		 } else if (typeof cca2OrUnMember === 'boolean') {
			 // Initialize from countryId and unMember
			 this.countryId = countryIdOrData as string;
			 this.unMember = cca2OrUnMember;
		 } else {
			 // Initialize from properties
			 this.countryId = countryIdOrData as string;
			 this.cca2 = cca2OrUnMember as string;
			 this.commonName = commonName!;
			 this.officialName = officialName!;
			 this.flag = flag!;
			 this.independent = independent!;
			 this.unMember = unMember!;
			 this.population = population!;
			 this.languages = languages!;
		 }
	 }

	/**
	 * Get the total of speakers of a language for this country
	 *
	 * @param languageName
	 * @returns
	 */
	getSpeakers(languageName: string): number {
	
		for (const language of this.languages) {
			if (language.language.toLowerCase() === languageName.toLowerCase()) {
				return language.percentage * this.population;
			}
		}
	
		return 0;
	}
	
}

export default Country;
