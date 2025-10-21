<script lang="ts">
        import { Modal } from 'flowbite-svelte';
        import { selectedCountry } from '$lib/store';
        import type Country from '$lib/model/country';
        import {
                formatLanguagePercentage,
                formatPopulation,
                formatSpeakers,
                getUnBadgeLabel
        } from '$lib/helpers/CountryModalHelper';
        import CountryLookupHelper from '$lib/helpers/CountryLookupHelper';

        let open = false;
        let country: Country | null = null;

        $: country = $selectedCountry;
        $: open = Boolean(country);

        let lastActiveElement: HTMLElement | null = null;

        $: displayFlag = country ? CountryLookupHelper.toFlagEmoji(country.flag, country.cca2) : '';
        $: formattedPopulation = country ? formatPopulation(country.population) : '';
        $: unBadgeLabel = country ? getUnBadgeLabel(Boolean(country.unMember)) : '';

        function handleClose() {
                selectedCountry.set(null);
        }

        $: if (!open && country) {
                selectedCountry.set(null);
        }

        $: if (open) {
                if (!lastActiveElement && typeof document !== 'undefined') {
                        const activeElement = document.activeElement;

                        if (activeElement instanceof HTMLElement) {
                                lastActiveElement = activeElement;
                        }
                }
        } else if (lastActiveElement) {
                lastActiveElement.focus();
                lastActiveElement = null;
        }

        $: modalHeading = country ? `${country.commonName} details` : 'Country details';
</script>

<Modal
        bind:open
        title=""
        size="sm"
        on:close={handleClose}
        outsideclose
        aria-labelledby="country-modal-title"
        placement="center"
>
        <svelte:fragment slot="header">
                <h2 id="country-modal-title" class="sr-only">{modalHeading}</h2>
        </svelte:fragment>
        {#if country}
                <div class="space-y-8 text-gray-700 mt-4 sm:mt-6" aria-live="polite">
                        <section class="space-y-4 text-center" aria-label="Country identity">
                                {#if displayFlag}
                                        <span
                                                class="emoji-flag text-3xl sm:text-4xl leading-none block"
                                                style="font-family: 'FlagEmoji';"
                                                aria-hidden="true"
                                        >
                                                {displayFlag}
                                        </span>
                                {/if}
                                <h3 class="text-3xl sm:text-4xl font-semibold text-gray-900 break-words">
                                        {country.commonName}
                                </h3>
                        </section>

                        <section class="space-y-3 text-sm sm:text-base" aria-label="Country overview">
                                <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <p class="flex items-baseline gap-2 text-gray-700">
                                                <span aria-hidden="true" class="text-lg leading-none">👥</span>
                                                <span class="font-medium text-gray-900">Population:</span>
                                                <span class="font-semibold text-gray-900">{formattedPopulation}</span>
                                        </p>
                                        <div class="ml-auto flex flex-wrap items-center justify-end gap-3 text-right"> 
                                                <span
                                                        class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700"
                                                        role="status"
                                                        aria-label={unBadgeLabel}
                                                >
                                                        {unBadgeLabel}
                                                </span>
                                        </div>
                                </div>
                        </section>

                        <section class="space-y-4" aria-label="Languages spoken">
                                <h4 class="flex items-center gap-2 text-base font-semibold text-gray-900">
                                        <span aria-hidden="true">🗣️</span>
                                        Languages spoken
                                </h4>
                                {#if country.languages.length === 0}
                                        <p class="text-sm text-gray-600">No language data available.</p>
                                {:else}
                                        <ul class="space-y-4">
                                                {#each country.languages as language (language.language)}
                                                        <li
                                                                class="border-b border-gray-200 pb-4 last:border-none text-sm sm:text-base"
                                                        >
                                                                <div
                                                                        class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                                                                >
                                                                        <span class="font-medium text-gray-900">
                                                                                {language.language}:
                                                                        </span>
                                                                        <span class="pl-5 sm:pl-0 sm:text-right text-gray-700">
                                                                                {formatSpeakers(language.percentage, country.population)}
                                                                                <span class="text-gray-500">
                                                                                        ({formatLanguagePercentage(language.percentage)}%)
                                                                                </span>
                                                                        </span>
                                                                </div>
                                                        </li>
                                                {/each}
                                        </ul>
                                {/if}
                        </section>
                </div>
        {/if}
</Modal>
