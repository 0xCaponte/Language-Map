import type { Handle } from '@sveltejs/kit';
import type Country from '$lib/model/country';
import type Language from '$lib/model/language';
import CountryDataLoader from '$lib/server/helpers/CountryDataLoader';

const countryDataLoader = new CountryDataLoader();

// Load JSON on server startup
countryDataLoader.loadAndParseCountryDataJson();

export const handle: Handle = async ({ event, resolve }) => {
	// Logic before resolving the request
	return await resolve(event);
};

// Global Maps - Server side
export const countryMap: Map<string, Country> = countryDataLoader.countryMap;
export const languageMap: Map<string, Language> = countryDataLoader.languageMap;
