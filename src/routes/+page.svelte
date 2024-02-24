<script lang="ts">
	import CommunicationStats from '$lib/components/CommunicationStats.svelte';
	import LanguageBar from '$lib/components/LanguageBar.svelte';
	import SearchSuggestions from '$lib/components/SearchSuggestions.svelte';
	import WorldMap from '$lib/components/WorldMap.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	let possibleLanguages: string[] = [];
	let selectedSuggestion: string = '';
	let inputValue = ''; // Bound to LanguageBar's input

	// References to the SearchSuggestions component
	let searchSuggestionsRef: SearchSuggestions;

	/**
	 * Fetch the available language names and sets a listener for the areas currently active
	 */
	onMount(async () => {
		const response = await fetch('/api/languages');
		if (response.ok) {
			possibleLanguages = await response.json();
		} else {
			console.error('Failed to fetch language names');
		}

		// Event listener for detecting clicks outside input area
		document.addEventListener('click', handleOutsideActivity);
		document.addEventListener('keydown', handleOutsideActivity);
	});

	/**
	 * Removes the listener set onMount
	 */
	onDestroy(() => {
		if (browser) {
			document.removeEventListener('click', handleOutsideActivity);
			document.removeEventListener('keydown', handleOutsideActivity);
		}
	});

	/**
	 * Passes along the input value received from the LanguageBar
	 * @param event
	 */
	function updateInputValue(event: CustomEvent<string>) {
		inputValue = event.detail;
	}

	/**
	 * Passes along the selected suggestion received from the SearchSuggestions
	 * @param event
	 */
	function handleSuggestionSelect(event: CustomEvent<string>) {
		selectedSuggestion = event.detail;
	}

	/**
	 * If clicked outside the input area (language bar or the suggestions), clear the suggestions shown
	 *
	 * @param event
	 */
	function handleOutsideActivity(event: any) {
		const outside = !event.target.closest('.input-area');
		if (outside) {
			searchSuggestionsRef.clearSuggestions();
		}
	}
</script>

<div class="container flex flex-col overflow-hidden h-full">
	<!-- Header Section -->
	<div class="text-center p-2 md:p-8">
		<p class="text-lg lg:text-2xl font-bold text-gray-800 mt-1 lg:mt-2">
			Explore Where Your Languages
			<span class="md:hidden"><br /></span><!-- active on small screens -->
			Connect You!
		</p>
	</div>

	<!-- Language Bar -->
	<div class="input-area w-full mx-auto px-4 relative z-10">
		<!-- Bound input to LanguageBar and listens for updates -->
		<LanguageBar
			{possibleLanguages}
			bind:selectedSuggestion
			on:updateInputValue={updateInputValue}
		/>

		<!-- SearchSuggestions shown as an overlay -->
		<div class="absolute w-full z-50 pr-8 -mt-7">
			<SearchSuggestions
				bind:this={searchSuggestionsRef}
				bind:inputValue
				{possibleLanguages}
				on:suggestionSelectedEvent={handleSuggestionSelect}
			/>
		</div>
	</div>

	<div class="flex flex-grow overflow-hidden flex-col lg:flex-row">
		<!-- Map Container - Flex-grow to fill available space -->
		<div class="w-full pt-8 xl:pt-0 lg:w-3/4 xl:flex-grow overflow-auto">
			<WorldMap />
		</div>

		<!-- Communication Stats - independent scrolling -->
		<div class="w-full pt-4 xl:pt-0 lg:w-1/4 xl:m-3 overflow-auto custom-scrollbar">
			<CommunicationStats />
		</div>
	</div>
</div>
