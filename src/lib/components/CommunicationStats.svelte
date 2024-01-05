<script lang="ts">
	import { selectedLanguages } from '$lib/store';
	import { CountryDataHelper } from '$lib/helpers/CountryDataHelper';
	import { FormatHelper } from '$lib/helpers/FormatHelper';

	import LanguageStats from '$lib/components/LanguageStats.svelte';
	import type Language from '$lib/model/language';

	let countryDataHelper = new CountryDataHelper();
	const formatter = new FormatHelper();

	// Filter is data for all or for just UN countries is used
	let unMember = true;

	// Reactive subscription to the store
	let languages: Language[];
	$: languages = $selectedLanguages;

	// Reactive totals
	let totals: Language;

	// Reactive update
	$: if (languages) {
		languages = countryDataHelper.getFilteredCountries(languages, unMember);
		totals = countryDataHelper.getLanguageSummary(languages);
	}
</script>

<div class="max-h-screen overflow-hidden">
    
	<!-- Sticky -->
    <div class="sticky top-0 z-10 p-4">
		<p class="font-semibold text-ms">Communication Stats:</p>
        <span class="font-semibold">
            🗣️ {formatter.formatNumber(totals.statistics.getSpeakers(unMember))}
        </span>
        <br />
        <span class="font-semibold">
            🌍 {totals.statistics.getCountries(unMember)}
        </span>
        <br />
    </div>

    <!-- List of LanguageStats -->
    {#each languages as language}
        <LanguageStats {language} {unMember} />
    {/each}
</div>