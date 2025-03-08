import Country from '$lib/model/country';
import Language from '$lib/model/language';
import Statistics from '$lib/model/statistics';

// Mock color maps for ColoringHelper tests
export const mockLanguageColorsMap = new Map<string, string>();
export const mockCountryColorsMap = new Map<string, string>();

// Mock individual countries that match the Country class structure
const usaCountry = new Country(
  '840', // countryId (ccn3)
  'US',  // cca2
  'United States', // commonName
  'United States of America', // officialName
  '🇺🇸', // flag
  true,  // independent
  true,  // unMember
  331900000, // population
  [{ language: 'english', percentage: 0.9 }] as CountryLanguage[] // languages
);

const ukCountry = new Country(
  '826', // countryId
  'GB',  // cca2
  'United Kingdom', // commonName
  'United Kingdom of Great Britain and Northern Ireland', // officialName
  '🇬🇧', // flag
  true,  // independent
  true,  // unMember
  67330000, // population
  [{ language: 'english', percentage: 0.98 }] as CountryLanguage[] // languages
);

const spainCountry = new Country(
  '724', // countryId
  'ES',  // cca2
  'Spain', // commonName
  'Kingdom of Spain', // officialName
  '🇪🇸', // flag
  true,  // independent
  true,  // unMember
  47350000, // population
  [{ language: 'spanish', percentage: 0.99 }] as CountryLanguage[] // languages
);

const mexicoCountry = new Country(
  '484', // countryId
  'MX',  // cca2
  'Mexico', // commonName
  'United Mexican States', // officialName
  '🇲🇽', // flag
  true,  // independent
  true,  // unMember
  128900000, // population
  [{ language: 'spanish', percentage: 0.95 }] as CountryLanguage[] // languages
);

const taiwanCountry = new Country(
  '158', // countryId
  'TW',  // cca2
  'Taiwan', // commonName
  'Republic of China', // officialName
  '🇹🇼', // flag
  true,  // independent
  false, // unMember (Taiwan is not a UN member)
  23570000, // population
  [{ language: 'chinese', percentage: 0.95 }] as CountryLanguage[] // languages
);

// Create mock country map as it would appear after CountryDataLoader.populateMaps()
export const mockCountryMap = new Map<string, Country>([
  ['United States', usaCountry],
  ['United Kingdom', ukCountry],
  ['Spain', spainCountry],
  ['Mexico', mexicoCountry],
  ['Taiwan', taiwanCountry]
]);

// Create statistics for each language
const englishStats = new Statistics(
  (331900000 * 0.9) + (67330000 * 0.98), // totalUNSpeakers
  2, // numberOfUNCountries
  (331900000 * 0.9) + (67330000 * 0.98), // totalSpeakers
  2  // numberOfCountries
);

const spanishStats = new Statistics(
  (47350000 * 0.99) + (128900000 * 0.95), // totalUNSpeakers
  2, // numberOfUNCountries
  (47350000 * 0.99) + (128900000 * 0.95), // totalSpeakers
  2  // numberOfCountries
);

const chineseStats = new Statistics(
  0, // totalUNSpeakers (Taiwan is not a UN member)
  0, // numberOfUNCountries
  23570000 * 0.95, // totalSpeakers
  1  // numberOfCountries
);

// Create language objects that match the Language class structure
const englishLanguage = new Language(
  'english',
  englishStats,
  [usaCountry, ukCountry]
);

const spanishLanguage = new Language(
  'spanish',
  spanishStats,
  [spainCountry, mexicoCountry]
);

const chineseLanguage = new Language(
  'chinese',
  chineseStats,
  [taiwanCountry]
);

const nonUsedLanguage = new Language(
  'klingon',
  new Statistics(0, 0, 0, 0),
  []
);

// Create mock language map as it would appear after CountryDataLoader.populateMaps()
export const mockLanguageMap = new Map<string, Language>([
  ['english', englishLanguage],
  ['spanish', spanishLanguage],
  ['chinese', chineseLanguage],
  ['klingon', nonUsedLanguage]
]);

// Create a list of languages for tests that need an array
export const mockLanguages = [englishLanguage, spanishLanguage, chineseLanguage];

// Helper function for creating statistics in tests
export function createMockStatistics(overrides: {
  totalUNSpeakers?: number;
  numberOfUNCountries?: number;
  totalSpeakers?: number;
  numberOfCountries?: number;
} = {}): Statistics {
  return new Statistics(
    overrides.totalUNSpeakers ?? 1000000,
    overrides.numberOfUNCountries ?? 2,
    overrides.totalSpeakers ?? 1500000,
    overrides.numberOfCountries ?? 3
  );
}

// Mock Statistics data for testing
export const mockStatistics = {
  // Complete statistics with non-UN countries
  complete: {
    totalUNSpeakers: 100000,
    numberOfUNCountries: 5,
    totalSpeakers: 200000,
    numberOfCountries: 10
  },
  
  // Statistics with only UN countries
  onlyUN: {
    totalUNSpeakers: 150000,
    numberOfUNCountries: 6,
    totalSpeakers: 150000,
    numberOfCountries: 6
  },
  
  // Statistics with partial data
  partial: {
    totalUNSpeakers: 300000,
    numberOfUNCountries: 8
  },
  
  // Empty statistics
  empty: {},
  
  // Statistics for world percentage calculations
  worldPercentage: {
    totalUNSpeakers: 404281350,
    numberOfUNCountries: 5,
    totalSpeakers: 600000000,
    numberOfCountries: 10
  },
  
  // Statistics with zero values
  zeros: {
    totalUNSpeakers: 0,
    numberOfUNCountries: 0,
    totalSpeakers: 0,
    numberOfCountries: 0
  }
};

// Export individual countries for tests that need specific countries
export const mockCountries = {
  US: usaCountry,
  GB: ukCountry,
  ES: spainCountry,
  MX: mexicoCountry,
  TW: taiwanCountry
};
