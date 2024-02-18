<script lang="ts">
	import { selectedLanguages } from '$lib/store';
	import { CountryDataHelper } from '$lib/helpers/CountryDataHelper';
	import { StringHelper } from '$lib/helpers/StringHelper';

	import LanguageStats from '$lib/components/LanguageStats.svelte';
	import type Language from '$lib/model/language';

	let countryDataHelper = new CountryDataHelper();
	const stringHelper = new StringHelper();

	// Filter is data for all or for just UN countries is used
	let unMember = true;

	// Reactive subscription to the store
	let languages: Language[];
	$: languages = $selectedLanguages;

	// Reactive totals
	let totals: Language;

	// Track the currently active accordion
	let activeAccordion: string | null = null;

	function setActiveAccordion(languageName: string) {
		activeAccordion = activeAccordion === languageName ? null : languageName;
	}

	// Reactive update
	$: if (languages) {
		languages = countryDataHelper.getFilteredCountries(languages, unMember);
		totals = countryDataHelper.getLanguageSummary(languages);
	}
</script>

<div>
	<!-- Sticky Header -->
	<div class="sticky top-0 z-10 p-4 bg-white mx-auto lg:w-auto lg:max-w-4xl">
		<p class="font-semibold text-ms text-center">Communication Stats:</p>

		<!-- Content centered within the div -->
		<div class="flex justify-center space-x-2 py-1">
			<div><span>🗺️{totals.statistics.getCountries(unMember)}</span></div>
			<div><span>🗣️{stringHelper.formatNumber(totals.statistics.getSpeakers(unMember))}</span></div>
			<div>
				<span>🌐{stringHelper.formatNumber(totals.statistics.getWorlPercentage(unMember))}%</span>
			</div>
		</div>
	</div>

	<!-- Scrollable List -->
	<div class="overflow-auto custom-scrollbar">
		{#each languages as language}
			<LanguageStats
				{language}
				{unMember}
				active={activeAccordion === language.name}
				onToggle={setActiveAccordion}
			/>
		{/each}
	</div>
</div>
