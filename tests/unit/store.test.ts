import { describe, it, expect, beforeEach } from 'vitest';
import { selectedCountry } from '$lib/store';
import Country from '$lib/model/country';

function createCountry() {
        return new Country({
                countryId: '840',
                cca2: 'US',
                commonName: 'United States',
                officialName: 'United States of America',
                flag: '🇺🇸',
                independent: true,
                unMember: true,
                population: 329484123,
                languages: []
        });
}

describe('selectedCountry store', () => {
        beforeEach(() => {
                selectedCountry.set(null);
        });

        it('updates when a country is selected', () => {
                let current = null;
                const unsubscribe = selectedCountry.subscribe((value) => {
                        current = value;
                });

                const country = createCountry();
                selectedCountry.set(country);

                expect(current).toEqual(country);

                unsubscribe();
        });

        it('resets to null when unselected', () => {
                let latest: Country | null = null;
                const unsubscribe = selectedCountry.subscribe((value) => {
                        latest = value;
                });

                const country = createCountry();

                selectedCountry.set(country);
                selectedCountry.set(null);

                expect(latest).toBeNull();

                unsubscribe();
        });
});
