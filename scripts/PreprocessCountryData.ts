import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

import Country from '../src/lib/model/country';
import Language from '../src/lib/model/language';
import Statistics from '../src/lib/model/statistics';
import { CountryData } from '../src/lib/model/CountryData';


async function main() {

    const jsonUrl = 'https://languagemap.world/resources/countryData.json';

    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch Country Json data: ${response.statusText}`);
        }
        const data : CountryData[] = (await response.json()) as CountryData[];

        // Initialize maps
      	const countryMap: Map<string, Country> = new Map<string, Country>();
		const languageMap: Map<string, Language> = new Map<string, Language>();

        // Process data
        data.forEach((item) => {
            populateCountryMap(item, countryMap);
            const country = countryMap.get(item.name.common);

            if (country) {
                populateLanguageMap(item, country, languageMap);
            }
        });

        sortLanguageCountries(languageMap);

        // Write maps to files
        const staticDirPath = path.join(__dirname, '..', 'static', 'data');
        fs.mkdirSync(staticDirPath, { recursive: true });

        // Write maps to files
        fs.writeFileSync(path.join(staticDirPath, 'countryMap.json'), JSON.stringify(Array.from(countryMap.entries())));
        fs.writeFileSync(path.join(staticDirPath, 'languageMap.json'), JSON.stringify(Array.from(languageMap.entries())));

        console.log('Static data maps have been generated & saved to: ', staticDirPath);

    } catch (error) {
        console.error('Error processing data:', error);
    }
}

function populateCountryMap(item, countryMap) {
    const { common, official } = item.name;
    const country = new Country(
        item.ccn3,
        item.cca2,
        common,
        official,
        item.flag,
        item.independent,
        item.unMember,
        item.population,
        item.languages
    );

    countryMap.set(common, country);
}

	function populateLanguageMap(item: CountryData, country: Country, languageMap: Map<string, Language>): void {
		
		item.languages.forEach((language) => {
			let languageName: string = language.language.toLowerCase();
			let languageData = languageMap.get(languageName);

			if (!languageData) {
				languageData = new Language(languageName, new Statistics(0, 0, 0, 0), []);
				languageMap.set(languageName, languageData);
			}

			if (item.unMember) {
				// Not all population speaks the language
				languageData.statistics.totalUNSpeakers += item.population * language.percentage;
				languageData.statistics.numberOfUNCountries += 1;
			}

			// Not all population speaks the language
			languageData.statistics.totalSpeakers += item.population * language.percentage;
			languageData.statistics.numberOfCountries += 1;
			languageData.countries.push(country);
		});
	}

	function sortLanguageCountries(languageMap : Map<string, Language>) {
    languageMap.forEach((language) => {
        language.countries.sort((a, b) => a.commonName.localeCompare(b.commonName));
    });
}

main();
