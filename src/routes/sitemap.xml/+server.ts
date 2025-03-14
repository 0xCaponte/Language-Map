import * as sitemap from 'super-sitemap';
import type { RequestHandler } from '@sveltejs/kit';
import { LanguageDataLoadingHelper } from '$lib/helpers/LanguageDataLoadingHelper';

export const prerender = true;

export const GET: RequestHandler = async () => {
 
  // Get all languages from the helper class
  let languageValues = LanguageDataLoadingHelper.DEFAULT_LANGUAGES.map(language => language.toString());

  // Create the sitemap with all routes
  return await sitemap.response({
    origin: 'https://www.languagemap.world',
    paramValues: { // pre-rendered routes
      '/[language]': languageValues
    },    
    additionalPaths: [ // static routes
      '/about'
    ],
    defaultChangefreq: 'monthly',
    defaultPriority: 0.7
  });
};