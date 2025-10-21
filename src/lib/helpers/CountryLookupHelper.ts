/**
 * @fileoverview Client-side helper to fetch country data for the map interactions.
 */

import Country from '$lib/model/country';

interface RawCountryData {
        commonName: string;
        officialName?: string;
        flag?: string;
        population: number;
        languages: Country['languages'];
        countryId?: string;
        cca2?: string;
        independent?: boolean;
        unMember?: boolean;
}

type RawCountryEntry = [string, RawCountryData];

export class CountryLookupHelper {
        private static countryMap: Map<string, Country> | null = null;
        private static loadingPromise: Promise<Map<string, Country>> | null = null;

        /**
         * Clears the in-memory cache. Mainly used in tests.
         */
        public static clearCache(): void {
                this.countryMap = null;
                this.loadingPromise = null;
        }

        /**
         * Retrieves a country by its numeric ISO code.
         *
         * @param countryId - ISO 3166-1 numeric identifier as provided by the topojson file.
         */
        public static async getCountryById(countryId: string | undefined): Promise<Country | null> {
                if (!countryId) {
                        return null;
                }

                const map = await this.loadCountryMap();
                return map.get(countryId) ?? null;
        }

        private static async loadCountryMap(): Promise<Map<string, Country>> {
                if (this.countryMap) {
                        return this.countryMap;
                }

                if (!this.loadingPromise) {
                        this.loadingPromise = fetch('/data/countryMap.json')
                                .then((response) => {
                                        if (!response.ok) {
                                                throw new Error(`Failed to load country map: ${response.status}`);
                                        }
                                        return response.json() as Promise<RawCountryEntry[]>;
                                })
                                .then((entries) => {
                                        const map = new Map<string, Country>();

                                        entries.forEach(([, rawCountry]) => {
                                                if (!rawCountry?.countryId) return;

                                                map.set(rawCountry.countryId, new Country({ ...rawCountry }));
                                        });

                                        this.countryMap = map;
                                        return map;
                                })
                                .catch((error) => {
                                        console.error('Unable to load country data', error);
                                        this.countryMap = new Map();
                                        return this.countryMap;
                                });
                }

                return this.loadingPromise;
        }
}

export default CountryLookupHelper;
