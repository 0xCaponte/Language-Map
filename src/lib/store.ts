import { writable } from 'svelte/store';
import type Language from './model/language';

// Input languages (from the language bar)
export const selectedLanguages = writable<Language[]>([]);

// Colors assigned to each language and country
export const languageColors = writable<Map<string, string>>(new Map());
export const countryColors = writable<Map<string, string>>(new Map());
