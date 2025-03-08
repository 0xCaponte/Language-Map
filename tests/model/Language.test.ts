import { describe, test, expect } from 'vitest';
import { mockLanguageMap } from '../mockData';

describe('Language', () => {
    describe('hasCountryById', () => {

        test('should return true when country ID exists in language countries', () => {
            
            // English is spoken in US (ID '840')
            const englishLanguage = mockLanguageMap.get('english');
            expect(englishLanguage?.hasCountryById('840')).toBe(true);
        });
        
        test('should return false when country ID does not exist in language countries', () => {
           
            // English is not spoken in ES (ID '999'
            const englishLanguage = mockLanguageMap.get('english'); 
            expect(englishLanguage?.hasCountryById('724')).toBe(false);
        });
    });
    
    describe('hasNonUNCountries', () => {
        test('should return true when language has non-UN member countries', () => {
          
            // Chinese is spoken in Taiwan, which is not a UN member
            const chineseLanguage = mockLanguageMap.get('chinese');
            expect(chineseLanguage?.hasNonUNCountries()).toBe(true);
        });
        
        test('should return false when all language countries are UN members', () => {
           
            // English is only spoken in UN member countries in our mockData (US, UK)
            const englishLanguage = mockLanguageMap.get('english'); 
            expect(englishLanguage?.hasNonUNCountries()).toBe(false);
        });
    });
});