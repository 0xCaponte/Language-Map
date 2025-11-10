import * as sitemap from 'super-sitemap';
import type { RequestHandler } from '@sveltejs/kit';
import { LanguageDataLoadingHelper } from '$lib/helpers/LanguageDataLoadingHelper';
import CountrySlugService from '$lib/server/helpers/CountrySlugService';

export const prerender = true;

export const GET: RequestHandler = async () => {
 
  // Get all languages from the helper class and country slugs from the static data
  let languageValues = LanguageDataLoadingHelper.DEFAULT_LANGUAGES.map(language => language.toString());
  const countryValues = await CountrySlugService.getAllCountrySlugs();

  // Create the sitemap with all routes
  return await sitemap.response({
    origin: 'https://www.languagemap.world',
    paramValues: { // pre-rendered routes
      '/[language]': languageValues,
      '/country/[country]': countryValues
    },    
    additionalPaths: [ // static routes
      '/about'
    ],
    defaultChangefreq: 'monthly',
    defaultPriority: 0.7
  });
};
