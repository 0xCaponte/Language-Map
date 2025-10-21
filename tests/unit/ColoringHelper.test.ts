import { describe, test, expect, beforeEach } from 'vitest';
import { ColoringHelper } from '$lib/helpers/ColoringHelper';
import { mockLanguages } from './mockData';
import { get } from 'svelte/store';
import { languageColors, countryColors } from '$lib/store';

type MinimalLanguage = {
        name: string;
        countries: { countryId: string }[];
};

describe('ColoringHelper', () => {
	beforeEach(() => {
		// Reset the Svelte stores before each test
		languageColors.set(new Map());
		countryColors.set(new Map());
	});

        describe('assignColors', () => {
                test('should assign colors from baseColors to languages and countries', () => {
                        // Call the method we're testing
                        ColoringHelper.assignColors(mockLanguages);

			// Get the current values from the stores
			const currentLanguageColors = get(languageColors);
			const currentCountryColors = get(countryColors);

			// Verify languages have been assigned colors
			expect(currentLanguageColors.size).toBe(3); // english, spanish, chinese
			expect(currentLanguageColors.get('english')).toBe('#1976D2'); // First color in baseColors
			expect(currentLanguageColors.get('spanish')).toBe('#FFEB3B'); // Second color
			expect(currentLanguageColors.get('chinese')).toBe('#D32F2F'); // Third color

			// Verify countries have been assigned colors based on their language
			expect(currentCountryColors.size).toBe(5); // US, UK, Spain, Mexico, Taiwan

			// English-speaking countries should have the English color
			expect(currentCountryColors.get('840')).toBe('#1976D2'); // US 
			expect(currentCountryColors.get('826')).toBe('#1976D2'); // UK

			// Spanish-speaking countries should have the Spanish color
			expect(currentCountryColors.get('724')).toBe('#FFEB3B'); // Spain
			expect(currentCountryColors.get('484')).toBe('#FFEB3B'); // Mexico

			// Chinese-speaking country should have the Chinese color
			expect(currentCountryColors.get('158')).toBe('#D32F2F'); // Taiwan
		});

                test('should handle empty language array', () => {
                        // Call with empty array
                        ColoringHelper.assignColors([]);

                        // Verify stores are empty
                        const currentLanguageColors = get(languageColors);
                        const currentCountryColors = get(countryColors);

                        expect(currentLanguageColors.size).toBe(0);
                        expect(currentCountryColors.size).toBe(0);
                });

                test('should reuse palette colors predictably when languages exceed the base list', () => {
                        const extendedLanguages: MinimalLanguage[] = Array.from({ length: 18 }, (_, index) => ({
                                name: `language-${index}`,
                                countries: [{ countryId: `${1000 + index}` }]
                        }));

                        ColoringHelper.assignColors(extendedLanguages as any);

                        const currentLanguageColors = get(languageColors);
                        const currentCountryColors = get(countryColors);

                        expect(currentLanguageColors.size).toBe(18);
                        expect(currentCountryColors.size).toBe(18);
                        const firstColor = currentLanguageColors.get('language-0');
                        const seventeenthColor = currentLanguageColors.get('language-16');
                        expect(firstColor).toBeDefined();
                        expect(seventeenthColor).toBe(firstColor);
                });

                test('should replace previous assignments when called multiple times', () => {
                        const extendedLanguages: MinimalLanguage[] = Array.from({ length: 5 }, (_, index) => ({
                                name: `temporary-${index}`,
                                countries: [{ countryId: `${900 + index}` }]
                        }));

                        ColoringHelper.assignColors(extendedLanguages as any);
                        ColoringHelper.assignColors(mockLanguages);

                        const currentLanguageColors = get(languageColors);
                        const currentCountryColors = get(countryColors);

                        expect(currentLanguageColors.size).toBe(3);
                        expect(currentLanguageColors.has('temporary-0')).toBe(false);
                        expect(currentCountryColors.size).toBe(5);
                        expect(currentCountryColors.has('900')).toBe(false);
                });
        });

	describe('getColorByLanguageName', () => {
		test('should return correct color for existing languages', () => {
			// Setup by assigning colors
			ColoringHelper.assignColors(mockLanguages);

			// Test each language
			expect(ColoringHelper.getColorByLanguageName('english')).toBe('#1976D2');
			expect(ColoringHelper.getColorByLanguageName('spanish')).toBe('#FFEB3B');
			expect(ColoringHelper.getColorByLanguageName('chinese')).toBe('#D32F2F');
		});

		test('should return default color for non-existent language', () => {
			// Setup by assigning colors
			ColoringHelper.assignColors(mockLanguages);

			// Test non-existent language
			expect(ColoringHelper.getColorByLanguageName('french')).toBe('none');
		});
	});

	describe('getColorByCountryId', () => {
		test('should return correct color for existing countries', () => {
			// Setup by assigning colors
			ColoringHelper.assignColors(mockLanguages);

			// Test each country
			expect(ColoringHelper.getColorByCountryId('840')).toBe('#1976D2'); // US
			expect(ColoringHelper.getColorByCountryId('826')).toBe('#1976D2'); // UK
			expect(ColoringHelper.getColorByCountryId('724')).toBe('#FFEB3B'); // Spain
			expect(ColoringHelper.getColorByCountryId('484')).toBe('#FFEB3B'); // Mexico
			expect(ColoringHelper.getColorByCountryId('158')).toBe('#D32F2F'); // Taiwan
		});

		test('should return default color for non-existent country', () => {
			// Setup by assigning colors
			ColoringHelper.assignColors(mockLanguages);

			// Test non-existent country
			expect(ColoringHelper.getColorByCountryId('999')).toBe('none');
		});
	});

	describe('getDefaultColor', () => {
		test('should return "none" as default color', () => {
			expect(ColoringHelper.getDefaultColor()).toBe('none');
		});
	});
});