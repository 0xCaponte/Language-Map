import type Language from '$lib/model/language';
import { BASE_URL } from '$env/static/private'; // Only used in server code

// Static pre-generated map with the language data
const STATIC_LANGUAGE_DATA_URL = '/data/languageMap.json';

/**
 * Server-side only: Loads the language data
 */
export async function loadLanguageMap(baseUrl?: string): Promise<Map<string, Language>> {
    const url = baseUrl || BASE_URL || '';

    const response = await fetch(`${url}${STATIC_LANGUAGE_DATA_URL}`);

    if (!response.ok) {
        throw new Error('Failed to load language map data');
    }

    const languageMapData = await response.json();
    return new Map<string, Language>(languageMapData);
}

/**
 * Server-side only: Gets all language names
 */
export async function getAllLanguageNames(baseUrl?: string): Promise<string[]> {

    try {
        const languageMap = await loadLanguageMap(baseUrl);
        const languages = Array.from(languageMap.keys());
        return languages;
    } catch (error) {
        console.error("Error loading language names:", error);
        return [];
    }
}

/**
 * Server-side only: Gets language by name
 */
export async function getLanguageByName(languageName: string, baseUrl?: string): Promise<Language | null> {
    try {
        const languageMap = await loadLanguageMap(baseUrl);
        return languageMap.get(languageName.toLowerCase()) || null;
    } catch (error) {
        console.error(`Error loading language ${languageName}:`, error);
        return null;
    }
}