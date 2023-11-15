<script lang="ts">
    import { selectedLanguages } from '$lib/store';
    import { CountryDataHelper } from '$lib/helpers/CountryDataHelper';
    import LanguageStats from '$lib/components/LanguageStats.svelte';
    import type Language from '$lib/model/language';

    let countryDataHelper = new CountryDataHelper();
    let languages: Language[];

    // Reactive subscription to the store
    $: languages = $selectedLanguages;

    // Reactive totals
    let totals : Language;
    $: if (languages) {
        totals = countryDataHelper.getLanguageSummary(languages);
    }

</script>

<span class="font-semibold"> People you can communicate with: {totals.statistics.totalSpeakers} </span>
<span class="font-semibold"> Countries you can communicate in: {totals.statistics.numberOfCountries} </span>

{#each languages as language}
    <LanguageStats {language} />
{/each}
