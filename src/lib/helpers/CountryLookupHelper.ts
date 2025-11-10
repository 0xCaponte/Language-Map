/**
 * @fileoverview Client-side helper to fetch country data for the map interactions.
 */

import Country from '$lib/model/country';
import { normalizeCountrySlug, toCountrySlug } from '$lib/helpers/CountrySlugHelper';

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
        private static countrySlugMap: Map<string, Country> | null = null;
        private static loadingPromise: Promise<Map<string, Country>> | null = null;

        /**
         * Clears the in-memory cache. Mainly used in tests.
         */
        public static clearCache(): void {
                this.countryMap = null;
                this.countrySlugMap = null;
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

        /**
         * Retrieves a country by its slugified common name.
         *
         * @param slug - Country slug as it appears in the URL.
         */
        public static async getCountryBySlug(slug: string | undefined): Promise<Country | null> {
                const normalizedSlug = normalizeCountrySlug(slug);
                if (!normalizedSlug) {
                        return null;
                }

                await this.loadCountryMap();
                return this.countrySlugMap?.get(normalizedSlug) ?? null;
        }

        private static async loadCountryMap(): Promise<Map<string, Country>> {
                if (this.countryMap && this.countrySlugMap) {
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
                                        const slugMap = new Map<string, Country>();

                                        entries.forEach(([, rawCountry]) => {
                                                if (!rawCountry?.countryId) return;

                                                const country = new Country({
                                                        ...rawCountry,
                                                        flag: this.ensureFlagEmoji(rawCountry)
                                                });

                                                map.set(rawCountry.countryId, country);

                                                const slug = toCountrySlug(rawCountry.commonName);
                                                if (slug) {
                                                        slugMap.set(slug, country);
                                                }
                                        });

                                        this.countryMap = map;
                                        this.countrySlugMap = slugMap;
                                        return map;
                                })
                                .catch((error) => {
                                        console.error('Unable to load country data', error);
                                        this.countryMap = new Map();
                                        this.countrySlugMap = new Map();
                                        return this.countryMap;
                                });
                }

                return this.loadingPromise;
        }

        public static toFlagEmoji(flag: string | undefined, cca2: string | undefined): string {
                if (this.isFlagEmoji(flag)) {
                        return flag ?? '';
                }

                return this.cca2ToFlag(cca2) ?? '';
        }

        private static ensureFlagEmoji(country: RawCountryData): string | undefined {
                const emoji = this.toFlagEmoji(country.flag, country.cca2);
                return emoji || undefined;
        }

        private static isFlagEmoji(flag: string | undefined): boolean {
                if (!flag) {
                        return false;
                }

                const characters = Array.from(flag);

                if (characters.length === 0) {
                        return false;
                }

                const regionalIndicatorRangeStart = 0x1f1e6;
                const regionalIndicatorRangeEnd = 0x1f1ff;

                return characters.every((char) => {
                        const codePoint = char.codePointAt(0);

                        return (
                                !!codePoint &&
                                codePoint >= regionalIndicatorRangeStart &&
                                codePoint <= regionalIndicatorRangeEnd
                        );
                });
        }

        private static cca2ToFlag(cca2: string | undefined): string | undefined {
                if (!cca2) {
                        return undefined;
                }

                const base = 0x1f1e6 - 'A'.charCodeAt(0);

                return Array.from(cca2.toUpperCase())
                        .map((char) => String.fromCodePoint(base + char.charCodeAt(0)))
                        .join('');
        }
}

export default CountryLookupHelper;
