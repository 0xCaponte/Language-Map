import { describe, expect, it } from 'vitest';
import {
        formatLanguagePercentage,
        formatPopulation,
        formatSpeakers,
        getUnBadgeLabel
} from '$lib/helpers/CountryModalHelper';
import CountryLookupHelper from '$lib/helpers/CountryLookupHelper';

describe('Country detail modal helpers', () => {
        it('returns the correct UN membership labels', () => {
                expect(getUnBadgeLabel(true)).toBe('UN Member');
                expect(getUnBadgeLabel(false)).toBe('Non-UN Member');
        });

        it('formats population counts with locale separators', () => {
                expect(formatPopulation(331002651)).toBe('331,002,651');
        });

        it('formats language summaries with speaker counts and percentages', () => {
                const speakers = formatSpeakers(0.795, 331002651);
                const percentage = formatLanguagePercentage(0.795);
                const summary = `English: ${speakers} (${percentage}%)`;

                expect(summary).toMatchInlineSnapshot(`"English: 263,147,108 (79.5%)"`);
        });

        it('resolves country flags to emoji for multiple samples', () => {
                const cases: Array<[string | undefined, string | undefined, string]> = [
                        ['🇵🇹', 'PT', '🇵🇹'],
                        ['DE', 'DE', '🇩🇪'],
                        [undefined, 'US', '🇺🇸'],
                        ['TW', 'TW', '🇹🇼']
                ];

                cases.forEach(([flag, cca2, expected]) => {
                        expect(CountryLookupHelper.toFlagEmoji(flag, cca2)).toBe(expected);
                });
        });
});
