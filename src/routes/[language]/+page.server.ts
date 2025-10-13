import { LanguageDataLoadingHelper } from '$lib/helpers/LanguageDataLoadingHelper';
import type { ServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const prerender = true;

// For static generation
export async function entries() {
    console.log('Starting generation of language pages...');

    try {
        // Use the hardcoded list from LanguageDataLoadingHelper
        const languages = LanguageDataLoadingHelper.DEFAULT_LANGUAGES;
        const languageNames = languages.map(lang => lang.toLowerCase());

        console.log(`Found ${languageNames.length} languages to generate pages for`);

        return languageNames.map((language: string) => {
            return { language };
        });

    } catch (error) {
        console.error(`Error generating language entries:`, error);
        return [];
    }
}

export const load: ServerLoad = async ({ params }) => {
    const { language } = params;
    console.log(`Server - Processing language page for: ${language}`);

    try {
        // Use the hardcoded list here as well for consistency
        const languages = LanguageDataLoadingHelper.DEFAULT_LANGUAGES;
        const validLanguages = languages.map(lang => lang.toLowerCase());

        if (!language || !validLanguages.includes(language.toLowerCase())) {
            throw redirect(307, '/'); // Redirect to home page for invalid languages
        }

        return { languageName: language };
    } catch (err) {
        console.error(`Server - Error in language page load for ${language}:`, err);
        throw err;
    }
};
