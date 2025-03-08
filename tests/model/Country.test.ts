import { describe, test, expect } from 'vitest';
import Country from '$lib/model/country';
import { mockCountries } from '../mockData';

describe('Country', () => {

    test('getSpeakers should correctly calculate speakers based on population and language percentage', () => {

        // Get a first country and a language from mockData
        const country = mockCountries.US;
        const language = country.languages[0];
        const languageName = language.language;
        
        const expectedSpeakers = country.population * language.percentage;
        
        // Call getSpeakers and verify it returns the expected value
        // 331,900,000 * 0.9  = ~298.710.000

        const actualSpeakers = country.getSpeakers(languageName);
        
        expect(actualSpeakers).toBeDefined();
        expect(actualSpeakers).toBeGreaterThan(0);  
        expect(actualSpeakers).toBeCloseTo(expectedSpeakers);
    });

    test('getSpeakers should return 0 if the language is not present in the country', () => {

        // Get US and ES data
        const country = mockCountries.US;
        const language = mockCountries.ES.languages[0];
        const languageName = language.language;
        
        const actualSpeakers = country.getSpeakers(languageName);
        expect(actualSpeakers).toBeDefined();
        expect(actualSpeakers).toBe(0);
    });

});