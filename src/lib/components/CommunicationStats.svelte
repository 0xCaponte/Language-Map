<script lang="ts">
	import { selectedLanguages } from '$lib/store';
	import { CountryDataHelper } from '$lib/helpers/CountryDataHelper';
	import { StringHelper } from '$lib/helpers/StringHelper';

	import LanguageStats from '$lib/components/LanguageStats.svelte';
	import type Language from '$lib/model/language';
	import { ShareNodesSolid } from 'flowbite-svelte-icons';

	let countryDataHelper = new CountryDataHelper();
	const stringHelper = new StringHelper();

	// Filter is data for all or for just UN countries is used
	let unMember = true;

	// Track the currently active accordion
	let activeAccordion: string | null = null;

	function setActiveAccordion(languageName: string) {
		activeAccordion = activeAccordion === languageName ? null : languageName;
	}

	// Reactive stats
	let totals: Language;
	let speakers: string = '0';
	let countries: number = 0;
	let worldPercentage: string = '0';

	// Use a separate reactive statement for updating derived stats
	$: if (totals) {
		speakers = stringHelper.formatNumber(totals.statistics.getSpeakers(unMember));
		countries = totals.statistics.getCountries(unMember);
		worldPercentage = stringHelper.formatPercentageNumber(
			totals.statistics.getWorldPercentage(unMember)
		);
	}

	// Reactive subscription to the store
	let languages: Language[];
	$: (languages = $selectedLanguages), updateTotals();
	$: totals = countryDataHelper.getLanguageSummary(languages);

	/**
	 * Recalculate the total values based on the currently selected languages
	 */
	function updateTotals() {
		if (!languages) return;
		const filteredLanguages = countryDataHelper.getFilteredCountries(languages, unMember);
		totals = countryDataHelper.getLanguageSummary(filteredLanguages);
	}

	/**
	 * Share communication stats on twitter
	 */
	function shareOnTwitter() {
		// Defualt Message
		let tweetText =
			'Your Languages, Your Map 🌐🗺️🗣️ Explore Where Your Languages Connect You! #LanguageMap https://languagemap.world by @0xCaponte';

		// Message for non 0 statistics
		if (!Number.isNaN(parseInt(speakers)) && parseInt(speakers) > 0) {
			const countryText = countries === 1 ? 'country' : 'countries';
			tweetText = `I can speak with ${speakers} people in ${countries} ${countryText} - that's ${worldPercentage}% of the world's population! 🌐🗺️🗣️ Explore where your languages connect you! #LanguageMap https://languagemap.world by @0xCaponte`;
		}

		const encodedTweet = encodeURIComponent(tweetText);
		const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}`;

		window.open(twitterIntentUrl, '_blank');
	}
</script>

<div>
	<!-- Sticky Stats Header -->
	<div class="relative sticky top-0 z-10 p-4 bg-white mx-auto lg:w-auto lg:max-w-4xl">
		<p class="font-semibold text-ms text-center">Communication Stats:</p>

		<!-- Content centered within the div -->
		<div class="flex justify-center space-x-2 py-1">
			<div><span>🗺️{countries}</span></div>
			<div><span>🗣️{speakers}</span></div>
			<div>
				<span>🌐{worldPercentage}%</span>
			</div>
		</div>

		<!-- Share Button, positioned with some horizontal space from the right -->
		<button
			on:click={shareOnTwitter}
			class="absolute right-4 top-1/2 transform -translate-y-1/2 twitter-share-button"
		>
			<ShareNodesSolid size="md" />
		</button>
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
