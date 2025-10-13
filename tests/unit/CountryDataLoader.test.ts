import { describe, it, expect, vi } from 'vitest';
import CountryDataLoader from '$lib/server/helpers/CountryDataLoader';
import Country from '$lib/model/country';
import Language from '$lib/model/language';

// Mock fetch
global.fetch = vi.fn();

const mockCountryData = [
  {
    name: { common: 'Utopia', official: 'Republic of Utopia' },
    ccn3: '123',
    cca2: 'UT',
    flag: '🇺🇹',
    independent: true,
    unMember: true,
    population: 1000,
    languages: [
      { language: 'English', percentage: 0.8 },
      { language: 'Utopian', percentage: 1.0 },
    ],
  },
  {
    name: { common: 'Elbonia', official: 'State of Elbonia' },
    ccn3: '456',
    cca2: 'EB',
    flag: '🇪🇱',
    independent: false,
    unMember: false,
    population: 500,
    languages: [{ language: 'Elbonian', percentage: 1.0 }],
  },
];

describe('CountryDataLoader', () => {
  it('should load and parse country data correctly', async () => {
    const response = {
      ok: true,
      json: () => Promise.resolve(mockCountryData),
    };
    global.fetch.mockResolvedValue(response);

    const loader = new CountryDataLoader();
    await loader.loadAndParseCountryDataJson();

    expect(fetch).toHaveBeenCalledWith('https://r2.languagemap.world/resources/countryData.json');

    // Check countryMap
    expect(loader.countryMap.size).toBe(2);
    expect(loader.countryMap.get('Utopia')).toBeInstanceOf(Country);
    expect(loader.countryMap.get('Utopia')?.commonName).toBe('Utopia');

    // Check languageMap
    expect(loader.languageMap.size).toBe(3);
    expect(loader.languageMap.get('english')).toBeInstanceOf(Language);
    expect(loader.languageMap.get('english')?.statistics.totalSpeakers).toBe(800);
    expect(loader.languageMap.get('english')?.statistics.numberOfUNCountries).toBe(1);
    expect(loader.languageMap.get('elbonian')?.statistics.totalSpeakers).toBe(500);
    expect(loader.languageMap.get('elbonian')?.statistics.numberOfUNCountries).toBe(0);
  });

  it('should handle fetch errors gracefully', async () => {
    const response = {
      ok: false,
      statusText: 'Not Found',
    };
    global.fetch.mockResolvedValue(response);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const loader = new CountryDataLoader();
    await loader.loadAndParseCountryDataJson();

    expect(loader.countryMap.size).toBe(0);
    expect(loader.languageMap.size).toBe(0);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});