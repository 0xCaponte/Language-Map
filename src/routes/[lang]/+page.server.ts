import type { ServerLoad } from '@sveltejs/kit';
import { getAllLanguageNames } from '$lib/helpers/ServerLanguageHelper';
import { redirect } from '@sveltejs/kit';

export const prerender = true;

// For static generation
export async function entries() {
    
    console.log('Starting generation of language pages...');

    try {
        const languageNames = await getAllLanguageNames();
        console.log(`Found ${languageNames.length} languages to generate pages for`);

        return languageNames.map(lang => {
            return { lang };
        });

    } catch (error) {
        console.error(`Error generating language entries:`, error);
        return [];
    }
}

export const load: ServerLoad = async ({ params }) => {

    const { lang } = params;
    console.log(`Server - Processing language page for: ${lang}`);

    try {
        const validLanguages = await getAllLanguageNames();

        if (!lang || !validLanguages.includes(lang.toLowerCase())) {
            throw redirect(307, '/'); // Redirect to home page for invalid languages
        }

        return { languageName: lang };
    } catch (err) {
        console.error(`Server - Error in language page load for ${lang}:`, err);
        throw err;
    }
};
