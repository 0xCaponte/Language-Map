<script lang="ts">
	import { selectedLanguages } from '$lib/store';
	import { CountryDataHelper } from '$lib/helpers/CountryDataHelper';
	import { FormatHelper } from '$lib/helpers/FormatHelper';

	import LanguageStats from '$lib/components/LanguageStats.svelte';
	import type Language from '$lib/model/language';

	let countryDataHelper = new CountryDataHelper();
	const formatter = new FormatHelper();

	let unMember = true;

	// Reactive subscription to the store
	let languages: Language[];
	$: languages = $selectedLanguages;

	// Reactive totals
	let totals: Language;
	$: if (languages) {
		languages = countryDataHelper.getFilteredCountries(languages, unMember);
		totals = countryDataHelper.getLanguageSummary(languages);
	}
</script>

<span class="font-semibold">
	People you can communicate with: {formatter.formatNumber(totals.statistics.totalSpeakers)}
</span>
<br />
<span class="font-semibold">
	Countries you can communicate in: {totals.statistics.numberOfCountries}
</span>
<br />
{#each languages as language}
	<LanguageStats {language} />
{/each}
