/**
 * @fileoverview Helper Class to perform all the necessary backend requests
 */

import type Country from "$lib/model/country";
import Language from "$lib/model/language";
import type Statistics from "$lib/model/statistics";

export class RequestHelper {


    /**
	 * Fetches language data from the API using a POST request with an array of language names.
	 *
	 * @param languageNames
	 */
    public async fetchLanguageData(languageNames: string[]): Promise<Language[]> {
        const sessionID = sessionStorage.getItem('sessionID');
        try {
            const response = await fetch('/api/languages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ languageNames, sessionID })
            });
    
            if (response.ok) {
                const languageData: Language[] = await response.json();
                let languages = languageData.map(
                    (lang: { name: string; statistics: Statistics; countries: Country[] }) =>
                        new Language(lang.name, lang.statistics, lang.countries)
                );

                return languages;

            } else {
                console.error('Failed to fetch language names');
                return [];
            }
        } catch (error) {
            console.error('Error fetching language data:', error);
            return [];
        }
    }
	
}
