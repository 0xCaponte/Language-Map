<script lang="ts">
	import { Input, Helper } from 'flowbite-svelte';
	import { selectedLanguages } from '$lib/store';
	import { Badge } from 'flowbite-svelte';
	import DebounceHelper from '$lib/helpers/DebounceHelper';
	import Language from '$lib/model/language';
	import type Country from '$lib/model/country';
	import type Statistics from '$lib/model/statistics';
	import { ColoringHelper } from '$lib/helpers/ColoringHelper';
	import SearchSuggestions from './SearchSuggestions.svelte';

	// Properties that can be customized
	export let placeholder: string = 'What Languages Do You Speak?';
	export let helper: string = 'Separate languages with spaces or commas';

	// Language input
	let trailingSpaces = '';
	let inputValue = '';
	let previousInputSet: Set<string> = new Set();
	let processedInput: { word: string; isSuggested: boolean }[] = [];
	let isInputFocused = false; // Track focus state

	// Debounced fetch execution
	let debounceHelper = new DebounceHelper();
	const debouncedFetchLanguageData = debounceHelper.debounce(fetchLanguageData);

	/**
	 * Parses the input from the language input bar and returns an array of Language objects.
	 *
	 * @param input
	 */
	function parseLanguageInput(input: string): string[] {

		const trailingSpacesMatch = input.match(/\s*$/);
   		trailingSpaces = trailingSpacesMatch ? trailingSpacesMatch[0] : '';

		let languageNames: string[] = input.split(/,|\s+/); // Split by space or comma
		languageNames = languageNames.map((e) => e.toLowerCase().trim()).filter(Boolean);
		return Array.from(new Set(languageNames));
	}

	/**
	 * Fetches language data from the API using a POST request with an array of language names.
	 *
	 * @param languageNames
	 */
	async function fetchLanguageData(languageNames: string[]) {
		const sessionID = sessionStorage.getItem('sessionID');
		const response = await fetch('/api/languages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ languageNames, sessionID })
		});

		if (response.ok) {
			let languageData = await response.json();
			let languages = languageData.map(
				(lang: { name: string; statistics: Statistics; countries: Country[] }) =>
					new Language(lang.name, lang.statistics, lang.countries)
			);

			// Initialize the colors
			ColoringHelper.assignColors(languages);

			// Set languages in the store
			selectedLanguages.set(languages);

			// Update value in the search bar with the pre-proccesses languages
			inputValue = languageNames.join(' ') + trailingSpaces;
			previousInputSet = new Set(languageNames);
		}
	}

	/**
	 * Updates the input value and calls the debounced fetch function.
	 *
	 * @param {Event} event - Input event from the language input field.
	 */
	 function onInput(event: Event): void {
        inputValue = (event.target as HTMLInputElement).value;
        const languages = parseLanguageInput(inputValue);

        if (areSetsEqual(previousInputSet, new Set(languages))) {
            return;
        }

        debouncedFetchLanguageData(languages);
    }

	/**
	 * Checks if two sets of strings have the same size and elements.
	 *
	 * @param setA
	 * @param setB
	 */
	function areSetsEqual(setA: Set<string>, setB: Set<string>): boolean {
		if (setA.size !== setB.size) return false;
		for (let a of setA) if (!setB.has(a)) return false;
		return true;
	}

	function handleSelectionSelect(event: { detail: any; }) {
		const selectedSuggestion = event.detail;
		console.log(selectedSuggestion);
		inputValue = selectedSuggestion;
	}

</script>

<Input
	bind:value={inputValue}
	id="languages-input"
	class="text-lg text-center bg-transparent"
	placeholder={placeholder}
	on:focus={() => isInputFocused = true}
    on:blur={() => isInputFocused = false}
	on:input={onInput}
/>

<!-- Language Suggestions -->
<div class="z-1">
	{#if isInputFocused}
    <SearchSuggestions {inputValue} on:select={handleSelectionSelect} />
{/if}
</div>

<!-- Wrong languages -->
<div class="flex flex-wrap gap-2">
    {#each processedInput as { word, isSuggested }}
        {#if !isSuggested}
            <Badge dismissable large color="red">{word}</Badge>
        {/if}
    {/each}
</div>

<Helper class="pt-2 text-xs text-center" color="disabled">{helper}</Helper>
