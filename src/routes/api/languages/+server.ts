/**
 * @fileoverview API in charge of managing the Language Data found in the server-side Language Map
 */

import type { RequestHandler } from '@sveltejs/kit';
import type Language from '$lib/model/language';
import { loadLanguageMap } from '$lib/helpers/LanguageDataLoadingHelper';

/**
 * Return the list of all the language names in the pre-processes data.
 * 
 * @param  
 * @returns 
 */
export const GET: RequestHandler = async ({ url }) => {
    try {
        const languageMap = await loadLanguageMap();
        const languageKeys = Array.from(languageMap.keys());

        return new Response(JSON.stringify(languageKeys), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'no language data available' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

/**
 * Return all the language data matching the valid languages names in the request
 *
 * @param request
 * @returns
 */
export const POST: RequestHandler = async ({ request, url }) => {
	const requestData = await request.json();
	const languageNames: string[] = requestData.languageNames;
	const sessionID = requestData.sessionID;

	// Language data from pre-processes map
	const languageMap = await loadLanguageMap();

	let languages: Language[] = [];
	let languageSet: Set<String> = new Set();

	languageNames.forEach((name) => {
		name = name.toLowerCase();

		if (!languageSet.has(name)) {
			
			languageSet.add(name);
			const language = languageMap.get(name);

			// Filter undefined / invalid inputs
			if (language) {
				languages.push(language);
			}
		}
	});

	// ----- Start - Logging for analytics -----
	const logEntry = {
		sessionID,
		timestamp: new Date().toISOString(),
		numberOfOriginalLanguages: languageNames.length,
		originalLanguages: languageNames,
		numberOfValidLanguages: languages.length,
		validLanguages: languages.map((lang) => lang.name.toLowerCase())
	};

	console.log(JSON.stringify(logEntry));
	// ----- End - Logging for analytics -----

	return new Response(JSON.stringify(languages), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};


