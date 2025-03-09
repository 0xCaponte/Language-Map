import type Language from '$lib/model/language';
import { BASE_URL } from '$env/static/private';

// Static pre-generated map with the language data
const STATIC_LANGUAGE_DATA_URL = '/data/languageMap.json';

/**
 * Loads the pre-processes landuage data from the static files
*/
export async function loadLanguageMap(): Promise<Map<string, Language>> {
    
    const isDev = import.meta.env.DEV;
	const url = isDev ? BASE_URL : STATIC_LANGUAGE_DATA_URL;
    const response = await fetch(`${url}${STATIC_LANGUAGE_DATA_URL}`);
    
    if (!response.ok) {
        throw new Error('Failed to load language map data');
    }
    
    const languageMapData = await response.json();
    return new Map<string, Language>(languageMapData);
}

/**
 * Client-safe: Gets all language names
 */
export async function getAllLanguageNames(): Promise<string[]> {
    try {
        const languageMap = await loadLanguageMap();
        return Array.from(languageMap.keys());
    } catch (error) {
        console.error("Error loading language names:", error);
        return [];
    }
}

/**
 * Client-safe: Gets language by name
 */
export async function getLanguageByName(languageName: string): Promise<Language | null> {
    try {
        const languageMap = await loadLanguageMap();
        return languageMap.get(languageName.toLowerCase()) || null;
    } catch (error) {
        console.error(`Error loading language ${languageName}:`, error);
        return null;
    }
}