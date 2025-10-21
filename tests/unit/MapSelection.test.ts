import { describe, it, expect } from 'vitest';
import { MapHelper } from '$lib/helpers/MapHelper';
import Language from '$lib/model/language';
import Country from '$lib/model/country';
import Statistics from '$lib/model/statistics';
import { selectedCountry } from '$lib/store';

describe('Map and country selection interplay', () => {
        it('keeps language-based fill colors when a country is selected', () => {
                const stats = new Statistics(0, 0, 0, 0);
                const unitedStates = new Country({ countryId: '840', commonName: 'United States' });
                const english = new Language('English', stats, [unitedStates]);

                const fillBefore = MapHelper.getCountryFillColor('840', [english]);

                selectedCountry.set(new Country({ countryId: '840', commonName: 'United States' }));
                const fillAfter = MapHelper.getCountryFillColor('840', [english]);

                expect(fillAfter).toBe(fillBefore);

                selectedCountry.set(null);
        });
});
