/**
 * @fileoverview Interface representing the objects in the countryData.json
 */

interface CountryData {
	name: {
		common: string;
		official: string;
	};
	independent: boolean;
	unMember: boolean;
	languages: Record<string, string>;
	population: number;
}
