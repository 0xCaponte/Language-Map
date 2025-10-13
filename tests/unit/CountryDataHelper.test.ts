import { describe, test, expect, beforeEach } from 'vitest';
import { CountryDataHelper } from '$lib/helpers/CountryDataHelper';
import { mockLanguages } from './mockData';
import type Language from '$lib/model/language';

describe('CountryDataHelper', () => {
    let countryDataHelper: CountryDataHelper;
    let testLanguages: Language[];

    beforeEach(() => {
        countryDataHelper = new CountryDataHelper();
        
        // Create a copy of the mock languages to prevent test interference
        testLanguages = [...mockLanguages];
    });

    describe('getFilteredCountries', () => {
        test('should filter countries based on UN membership status - get UN members', () => {
            const filteredLanguages = countryDataHelper.getFilteredCountries(testLanguages, true);
            
            // Check that we got the right number of languages
            expect(filteredLanguages.length).toBe(3); // All three languages should be present
            
            // Check English language
            const english = filteredLanguages.find(lang => lang.name === 'english');
            expect(english).toBeDefined();
            expect(english!.countries.length).toBe(2); // US and UK are both UN members
            expect(english!.countries.some(c => c.commonName === 'United States')).toBe(true);
            expect(english!.countries.some(c => c.commonName === 'United Kingdom')).toBe(true);
            
            // Check Spanish language
            const spanish = filteredLanguages.find(lang => lang.name === 'spanish');
            expect(spanish).toBeDefined();
            expect(spanish!.countries.length).toBe(2); // Spain and Mexico are both UN members
            expect(spanish!.countries.some(c => c.commonName === 'Spain')).toBe(true);
            expect(spanish!.countries.some(c => c.commonName === 'Mexico')).toBe(true);
            
            // Check Chinese language
            const chinese = filteredLanguages.find(lang => lang.name === 'chinese');
            expect(chinese).toBeDefined();
            expect(chinese!.countries.length).toBe(0); // Taiwan is not a UN member
        });
        
        test('should filter countries based on UN membership status - get non-UN members', () => {
            const filteredLanguages = countryDataHelper.getFilteredCountries(testLanguages, false);
            
            // Check that we got the right number of languages
            expect(filteredLanguages.length).toBe(3); // All three languages should be present
            
            // Check English language
            const english = filteredLanguages.find(lang => lang.name === 'english');
            expect(english).toBeDefined();
            expect(english!.countries.length).toBe(0); // No non-UN countries for English
            
            // Check Spanish language
            const spanish = filteredLanguages.find(lang => lang.name === 'spanish');
            expect(spanish).toBeDefined();
            expect(spanish!.countries.length).toBe(0); // No non-UN countries for Spanish
            
            // Check Chinese language
            const chinese = filteredLanguages.find(lang => lang.name === 'chinese');
            expect(chinese).toBeDefined();
            expect(chinese!.countries.length).toBe(1); // Taiwan is a non-UN member
            expect(chinese!.countries[0].commonName).toBe('Taiwan');
        });
    });

    describe('getLanguageSummary', () => {
        test('should summarize all languages correctly', () => {
            const summary = countryDataHelper.getLanguageSummary(testLanguages);
            
            // Check summary name
            expect(summary.name).toBe('Totals');
            
            // Check countries count (should be unique countries)
            expect(summary.countries.length).toBe(5); // US, UK, Spain, Mexico, Taiwan
            
            // Check statistics
            expect(summary.statistics.totalSpeakers).toBeCloseTo(
                (331900000 * 0.9) + (67330000 * 0.98) + // English
                (47350000 * 0.99) + (128900000 * 0.95) + // Spanish
                (23570000 * 0.95) // Chinese
            );
            
            expect(summary.statistics.totalUNSpeakers).toBeCloseTo(
                (331900000 * 0.9) + (67330000 * 0.98) + // English (all UN)
                (47350000 * 0.99) + (128900000 * 0.95) // Spanish (all UN)
                // Chinese has no UN countries
            );
            
            expect(summary.statistics.numberOfCountries).toBe(5);
            expect(summary.statistics.numberOfUNCountries).toBe(4); // All except Taiwan
        });
        
        test('should handle empty languages array', () => {
            const summary = countryDataHelper.getLanguageSummary([]);
            
            expect(summary.name).toBe('Totals');
            expect(summary.countries.length).toBe(0);
            expect(summary.statistics.totalSpeakers).toBe(0);
            expect(summary.statistics.totalUNSpeakers).toBe(0);
            expect(summary.statistics.numberOfCountries).toBe(0);
            expect(summary.statistics.numberOfUNCountries).toBe(0);
        });
    });
});
