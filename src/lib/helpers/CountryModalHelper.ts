import { StringHelper } from '$lib/helpers/StringHelper';

const defaultStringHelper = new StringHelper();

const browserLocale = (): string => (typeof navigator !== 'undefined' ? navigator.language : 'en-US');

export function formatPopulation(population: number, helper: StringHelper = defaultStringHelper): string {
        return helper.formatNumber(population);
}

export function formatSpeakers(
        percentage: number,
        population: number,
        helper: StringHelper = defaultStringHelper
): string {
        const speakers = percentage * population;
        return helper.formatNumber(speakers);
}

export function formatLanguagePercentage(percentage: number, locale: string = browserLocale()): string {
        const value = Math.round(percentage * 1000) / 10;
        const hasDecimal = !Number.isInteger(value);

        return new Intl.NumberFormat(locale, {
                maximumFractionDigits: 1,
                minimumFractionDigits: hasDecimal ? 1 : 0
        }).format(value);
}

export function getUnBadgeLabel(isMember: boolean): string {
        return isMember ? 'UN Member' : 'Non-UN Member';
}
