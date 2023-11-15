import { writable } from 'svelte/store';
import type Language from './model/language';

export const selectedLanguages = writable<Language[]>([]);
