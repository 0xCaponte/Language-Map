/**
 * @fileoverview Interface representing the objects in the countryData.json
 */

interface CountryData {
	ccn3: string;
	name: {
		common: string;
		official: string;
	};
	independent: boolean;
	unMember: boolean;
	languages: Record<string, string>;
	population: number;
}
