<script lang="ts">
        import { Modal } from 'flowbite-svelte';
        import { selectedCountry } from '$lib/store';
        import type Country from '$lib/model/country';
        import { StringHelper } from '$lib/helpers/StringHelper';

        const stringHelper = new StringHelper();

        let open = false;
        let country: Country | null = null;

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

<Modal bind:open title={modalTitle} size="lg" on:close={handleClose} outsideclose>
        {#if country}
                <div class="space-y-6" aria-live="polite">
                        <section class="text-sm text-gray-600" aria-label="Country overview">
                                <p><span class="font-semibold">UN status:</span> {country.unMember ? 'UN member' : 'Non-UN member'}</p>
                                <p>
                                        <span class="font-semibold">Population:</span>
                                        {formatPopulation(country.population)}
                                </p>
                        </section>

                        <section class="space-y-3" aria-label="Languages">
                                <h4 class="text-base font-semibold text-gray-800">Languages spoken</h4>
                                {#if country.languages.length === 0}
                                        <p class="text-sm text-gray-600">No language data available.</p>
                                {:else}
                                        <ul class="space-y-2">
                                                {#each country.languages as language (language.language)}
                                                        <li class="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-2 last:border-none">
                                                                <span class="text-sm font-medium text-gray-900">{language.language}</span>
                                                                <span class="text-sm text-gray-600">{formatPercentage(language.percentage)}%</span>
                                                        </li>
                                                {/each}
                                        </ul>
                                {/if}
                        </section>
                </div>
        {/if}
</Modal>
