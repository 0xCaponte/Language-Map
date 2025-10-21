<script lang="ts">
        import { Modal } from 'flowbite-svelte';
        import { selectedCountry } from '$lib/store';
        import type Country from '$lib/model/country';
        import { StringHelper } from '$lib/helpers/StringHelper';

        const stringHelper = new StringHelper();

        let open = false;
        let country: Country | null = null;

        const modalDialogClass =
                'fixed top-0 start-0 end-0 z-50 w-full h-modal md:inset-0 md:h-full p-2 sm:p-4 flex items-center justify-center';
        const modalHeaderClass =
                'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-6 border-b border-gray-200';
        const modalBodyClass = 'p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto';

        $: country = $selectedCountry;
        $: open = Boolean(country);

        function formatPopulation(population: number): string {
                return stringHelper.formatNumber(population);
        }

        function formatPercentage(percentage: number): string {
                return stringHelper.formatPercentageNumber(percentage * 100);
        }

        function handleClose() {
                selectedCountry.set(null);
        }

        $: if (!open && country) {
                selectedCountry.set(null);
        }

        $: modalTitle = country
                ? `${country.flag ? `${country.flag} ` : ''}${country.commonName}`.trim()
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
                        <section class="text-sm sm:text-base" aria-label="Country overview">
                                <p class="flex flex-wrap gap-x-1">
                                        <span class="font-semibold text-gray-900">UN status:</span>
                                        <span>{country.unMember ? 'UN member' : 'Non-UN member'}</span>
                                </p>
                                <p class="flex flex-wrap gap-x-1">
                                        <span class="font-semibold text-gray-900">Population:</span>
                                        <span>{formatPopulation(country.population)}</span>
                                </p>
                        </section>

                        <section class="space-y-4" aria-label="Languages">
                                <h4 class="text-base font-semibold text-gray-900">Languages spoken</h4>
                                {#if country.languages.length === 0}
                                        <p class="text-sm text-gray-600">No language data available.</p>
                                {:else}
                                        <ul class="space-y-3">
                                                {#each country.languages as language (language.language)}
                                                        <li
                                                                class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 border-b border-gray-200 pb-3 last:border-none"
                                                        >
                                                                <span class="text-sm font-medium text-gray-900 sm:text-base">{language.language}</span>
                                                                <span class="text-sm text-gray-600">{formatPercentage(language.percentage)}%</span>
                                                        </li>
                                                {/each}
                                        </ul>
                                {/if}
                        </section>
                </div>
        {/if}
</Modal>
