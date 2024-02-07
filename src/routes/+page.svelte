<script lang="ts">
	import CommunicationStats from '$lib/components/CommunicationStats.svelte';
	import LanguageBar from '$lib/components/LanguageBar.svelte';
	import SearchSuggestions from '$lib/components/SearchSuggestions.svelte';
	import WorldMap from '$lib/components/WorldMap.svelte';
	import { onMount } from 'svelte';

	let possibleLanguages: string[] = [];
	let selectedSuggestion: string = '';
	let inputValue = ''; // Bound to LanguageBar's input

	/**
	 * Fetch the available language names on mount of the component
	 */
	onMount(async () => {
		const response = await fetch('/api/languages');
		if (response.ok) {
			possibleLanguages = await response.json();
		} else {
			console.error('Failed to fetch language names');
		}
	});

	/**
	 * Passes along the input value recieved from the LanguageBar
	 * @param event
	 */
	function updateInputValue(event: CustomEvent<string>) {
		inputValue = event.detail;
	}

	/**
	 * Passes along the selected suggestion recieved from the SearchSuggestions
	 * @param event
	 */
	function handleSuggestionSelect(event: CustomEvent<string>) {
		selectedSuggestion = event.detail;
	}
</script>

<div class="flex flex-col overflow-hidden h-full">
	<!-- Language Bar -->
	<div class="w-full mx-auto px-4 relative">
		<LanguageBar {possibleLanguages} {selectedSuggestion} on:updateInputValue={updateInputValue} />

		<!-- Search Suggestions -->
		<div class="absolute w-full z-50 pr-8 -mt-5">
			<SearchSuggestions
				{inputValue}
				{possibleLanguages}
				on:suggestionSelectedEvent={handleSuggestionSelect}
			/>
		</div>
	</div>

	<!-- Main Content and Sidebar -->
	<div class="flex flex-grow h-full">
		<!-- Map Container -->
		<div
			class="flex flex-grow items-center justify-center pl-3 w-3/4 lg:w-4/5"
			style="max-height: calc(100vh - var(--header-height) - var(--footer-height));"
		>
			<WorldMap />
		</div>

		<!-- Communication Stats -->
		<div
			class="w-1/4 lg:w-1/5 m-3"
			style="max-height: calc(100vh - var(--header-height) - var(--footer-height));"
		>
			<CommunicationStats />
		</div>
	</div>
</div>
