/**
 * @fileoverview API in charge of managing the Language Data found in the server-side Language Map
 */

import type { RequestHandler } from '@sveltejs/kit';
import { languageMap } from '../../../hooks.server';

import type Language from '$lib/model/language';

/**
 * Return all the language data matching valid the valid names in the request
 *
 * @param request
 * @returns
 */
export const POST: RequestHandler = async ({ request }) => {
	const requestData = await request.json();
	const languageNames: string[] = requestData.languageNames;

	// Language data from global map
	let languages: Language[] = [];

	languageNames.forEach((name) => {
		const language = languageMap.get(name);

		// Filter undefined / invalid inputs
		if (language) {
			languages.push(language);
		}
	});

	return new Response(JSON.stringify(languages), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
