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
	<div class="sticky top-0 z-10 p-4 bg-white">
		<!-- Added bg-white to maintain the background of the sticky header -->
		<p class="font-semibold text-ms">Communication Stats:</p>

		<div class="py-1">
			<span>
				🗺️{totals.statistics.getCountries(unMember)} 
			</span>
			<span>
				🗣️{formatter.formatNumber(totals.statistics.getSpeakers(unMember))}
			</span>
		</div>
	</div>

	<!-- Scrollable List -->
	<div
		class="overflow-auto custom-scrollbar"
		style="max-height: calc(100vh - var(--header-height) - var(--footer-height));"
	>
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
