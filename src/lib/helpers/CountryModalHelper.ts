import { StringHelper } from '$lib/helpers/StringHelper';

const defaultStringHelper = new StringHelper();

const browserLocale = (): string => (typeof navigator !== 'undefined' ? navigator.language : 'en-US');

export const COUNTRY_MODAL_DIALOG_CLASS =
        'fixed top-0 start-0 end-0 z-50 w-full h-modal md:inset-0 md:h-full p-2 sm:p-4 flex items-center justify-center max-w-[92vw] sm:max-w-[56ch]';

export const COUNTRY_MODAL_BODY_CLASS = 'p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto';

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
