/**
 * @fileoverview Interface representing the objects in the countryData.json
 */

export interface CountryData {
	ccn3: string;
	cca2: string;
	name: {
		common: string;
		official: string;
	};
	flag: string;
	independent: boolean;
	unMember: boolean;
	population: number;
	languages: CountryLanguage[];
}
