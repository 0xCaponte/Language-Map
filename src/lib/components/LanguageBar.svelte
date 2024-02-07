<script lang="ts">
	import { Input, Helper } from 'flowbite-svelte';
	import { selectedLanguages } from '$lib/store';
	import { ColoringHelper } from '$lib/helpers/ColoringHelper';
	import { createEventDispatcher } from 'svelte';
	import { SetHelper } from '$lib/helpers/SetHelper';
	import { RequestHelper } from '$lib/helpers/RequestsHelper';
	import { StringHelper } from '$lib/helpers/StringHelper';
	import DebounceHelper from '$lib/helpers/DebounceHelper';

	// Properties exported and accesible to the parent component
	export let placeholder: string = 'What Languages Do You Speak?';
	export let helper: string = 'Separate languages with spaces or commas';
	export let possibleLanguages: string[] = [];
	export let selectedSuggestion: string = '';

	// Language input
	let inputValue: string = '';
	let realNewInput: string = '';
	let inputElement: Input;
	let previousInputSet: Set<string> = new Set();

	const setHelper: SetHelper = new SetHelper();
	const stringHelper: StringHelper = new StringHelper();
	const requestHelper: RequestHelper = new RequestHelper();
	const dispatch = createEventDispatcher();

	// Reacts to the selection of a suggestion
	$: if (selectedSuggestion) {
		inputValue = stringHelper.replaceSubString(inputValue, realNewInput, selectedSuggestion);
		selectedSuggestion = ''; // clears suggestions to start over
		inputElement.focus(); // Go back to typing in the input
	}

	// Debounced fetch execution
	let debounceHelper = new DebounceHelper();
	const debouncedFetchLanguageData = debounceHelper.debounce(fetchAndProcessLanguageData);

	/**
	 * Parses the input from the language input bar and returns an array of Language objects.
	 *
	 * @param input
	 */
	function parseLanguageInput(input: string): string[] {
		let languageNames: string[] = input.split(/,|\s+/); // Split by space or comma
		languageNames = languageNames.map((e) => e.toLowerCase().trim()).filter(Boolean);
		return Array.from(new Set(languageNames));
	}

	/**
	 *  Fetches language data from the API and processes the returning data
	 *
	 * @param languageNames
	 */
	async function fetchAndProcessLanguageData(languageNames: string[]) {
		let languages = await requestHelper.fetchLanguageData(languageNames);

		// Initialize the colors
		ColoringHelper.assignColors(languages);

		// Set languages in the store
		selectedLanguages.set(languages);

		previousInputSet = new Set(languageNames);
	}

	/**
	 * Updates the input value and calls the debounced fetch function.
	 *
	 * @param {Event} event - Input event from the language input field.
	 */
	function onInput(event: Event): void {
		const newInputValue = (event.target as HTMLInputElement).value;
		const newLanguages = parseLanguageInput(newInputValue);

		// Determine real changes in the input
		const newInputSet = new Set(newLanguages);
		let difference = setHelper.difference(newInputSet, previousInputSet);
		realNewInput = difference.size > 0 ? [...difference][0] : '';

		// Notify SearchSuggestions of the input
		dispatch('updateInputValue', realNewInput);

		if (!setHelper.areSetsEqual(previousInputSet, newInputSet)) {
			// TODO debouncedFetchLanguageData(newLanguages);
		}

		previousInputSet = newInputSet; // Update the previousInputSet
	}
</script>

<Input
	bind:this={inputElement}
	bind:value={inputValue}
	on:input={onInput}
	class="text-lg text-center bg-transparent"
	{placeholder}
/>

<Helper class="pt-2 text-xs text-center" color="disabled">{helper}</Helper>
