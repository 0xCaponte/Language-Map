import { describe, it, expect, beforeEach, vi } from 'vitest';
import CountryLookupHelper from '$lib/helpers/CountryLookupHelper';

const mockResponse = [
        [
                'Testland',
                {
                        commonName: 'Testland',
                        officialName: 'The Republic of Testland',
                        flag: '🏳️',
                        population: 1000,
                        languages: [{ language: 'Testish', percentage: 0.5, notes: '' }],
                        countryId: '001',
                        cca2: 'TL',
                        independent: true,
                        unMember: true
                }
        ]
];

describe('CountryLookupHelper', () => {
        beforeEach(() => {
                CountryLookupHelper.clearCache();
                vi.resetModules();
                vi.restoreAllMocks();
        });

        it('returns a country by its id', async () => {
                const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => mockResponse });
                // @ts-expect-error - allow assigning mock fetch
                global.fetch = fetchMock;

                const country = await CountryLookupHelper.getCountryById('001');

                expect(fetchMock).toHaveBeenCalledWith('/data/countryMap.json');
                expect(country?.commonName).toBe('Testland');
                expect(country?.languages[0].language).toBe('Testish');
        });

        it('normalises flags to emoji when response is not already an emoji', async () => {
                const response = [
                        [
                                'Taiwan',
                                {
                                        commonName: 'Chinese Taipei',
                                        population: 23568000,
                                        languages: [],
                                        countryId: '158',
                                        cca2: 'TW',
                                        flag: 'TW',
                                        unMember: false
                                }
                        ]
                ];

                const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => response });
                // @ts-expect-error - allow assigning mock fetch
                global.fetch = fetchMock;

                const country = await CountryLookupHelper.getCountryById('158');

                expect(country?.flag).toBe('🇹🇼');
        });

        it('returns null when id is missing', async () => {
                const fetchMock = vi.fn();
                // @ts-expect-error
                global.fetch = fetchMock;

                const country = await CountryLookupHelper.getCountryById(undefined);

                expect(country).toBeNull();
                expect(fetchMock).not.toHaveBeenCalled();
        });

        it('handles fetch errors gracefully', async () => {
                const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
                // @ts-expect-error
                global.fetch = fetchMock;

                const country = await CountryLookupHelper.getCountryById('001');

                expect(country).toBeNull();
        });
});
