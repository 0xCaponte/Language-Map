<script lang="ts">
        import { Modal } from 'flowbite-svelte';
        import { selectedCountry } from '$lib/store';
        import type Country from '$lib/model/country';
        import {
                COUNTRY_MODAL_BODY_CLASS,
                COUNTRY_MODAL_DIALOG_CLASS,
                formatLanguagePercentage,
                formatPopulation,
                formatSpeakers,
                getUnBadgeLabel
        } from '$lib/helpers/CountryModalHelper';
        import CountryLookupHelper from '$lib/helpers/CountryLookupHelper';

        let open = false;
        let country: Country | null = null;

        const modalDialogClass = COUNTRY_MODAL_DIALOG_CLASS;
        const modalHeaderClass =
                'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 border-b border-gray-200';
        const modalBodyClass = COUNTRY_MODAL_BODY_CLASS;

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

        $: modalTitle = country
                ? `${displayFlag ? `${displayFlag} ` : ''}${country.commonName}`.trim()
                : 'Country details';
</script>

<Modal
        bind:open
        title={modalTitle}
        size="md"
        on:close={handleClose}
        outsideclose
        classDialog={modalDialogClass}
        classHeader={modalHeaderClass}
        classBody={modalBodyClass}
>
        {#if country}
                <div class="space-y-6 text-gray-700" aria-live="polite">
                        <section class="space-y-4 text-sm sm:text-base" aria-label="Country overview">
                                <div class="flex items-start gap-3">
                                        {#if displayFlag}
                                                <span
                                                        class="text-4xl sm:text-5xl leading-none emoji-flag"
                                                        style="font-family: 'FlagEmoji';"
                                                        aria-hidden="true"
                                                >
                                                        {displayFlag}
                                                </span>
                                        {/if}
                                        <div class="flex-1 space-y-3">
                                                <h3 class="text-xl font-semibold text-gray-900 sm:text-2xl flex flex-wrap items-center gap-2">
                                                        {country.commonName}
                                                </h3>
                                                <span
                                                        class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700"
                                                        role="status"
                                                        aria-label={unBadgeLabel}
                                                >
                                                        <span aria-hidden="true">🇺🇳</span>
                                                        {unBadgeLabel}
                                                </span>
                                                <p class="flex items-baseline gap-2 text-sm text-gray-700 sm:text-base">
                                                        <span aria-hidden="true" class="text-lg leading-none">👥</span>
                                                        <span class="font-medium text-gray-900">Population</span>
                                                        <span>{formattedPopulation}</span>
                                                </p>
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
                                                                        class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                                                                >
                                                                        <span class="font-medium text-gray-900">
                                                                                {language.language}:
                                                                        </span>
                                                                        <span class="pl-5 sm:pl-0 text-gray-700">
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
