<script lang="ts">
	import { Input, Helper, Badge } from 'flowbite-svelte';
	import { selectedLanguages } from '$lib/store';
	import { ColoringHelper } from '$lib/helpers/ColoringHelper';
	import { createEventDispatcher } from 'svelte';
	import { SetHelper } from '$lib/helpers/SetHelper';
	import { RequestHelper } from '$lib/helpers/RequestsHelper';
	import { StringHelper } from '$lib/helpers/StringHelper';
	import DebounceHelper from '$lib/helpers/DebounceHelper';
	import type Language from '$lib/model/language';

	// Properties exported and accesible to the parent component
	export let placeholder: string = 'What Languages Do You Speak?';
	export let helper: string = 'Separate languages with spaces or commas';
	export let possibleLanguages: string[] = [];
	export let selectedSuggestion: string = '';

	// Input Reference
	let inputRef: HTMLInputElement;

	// Language input
	let inputValue: string = '';
	let realNewInput: string = '';
	let previousInputSet: Set<string> = new Set();
	let currentInputSet: Set<string> = new Set();
	let previousRequestSet: Set<string> = new Set();
	let invalidLanguages: string[];

	// Helpers
	const setHelper: SetHelper = new SetHelper();
	const stringHelper: StringHelper = new StringHelper();
	const requestHelper: RequestHelper = new RequestHelper();
	const dispatch = createEventDispatcher();

	// Debounced fetch execution
	let debounceHelper = new DebounceHelper();
	const debouncedFetchLanguageData = debounceHelper.debounce(fetchAndProcessLanguageData);

	// Reactive statement to check input validity
	$: {
		determineInvalidLanguages();
	}

	function determineInvalidLanguages() {
		invalidLanguages = Array.from(currentInputSet).filter(
			(lang) => !possibleLanguages.includes(lang.toLowerCase())
		);
	}

	// Reactive statement for the selection of a suggestion
	$: if (selectedSuggestion) {
		inputValue = stringHelper.replaceSubString(inputValue, realNewInput, selectedSuggestion);
		processInputedLanguages(inputValue);
		selectedSuggestion = ''; // clears selection
		focusInput();
	}

	/**
	 * Focus the input element
	 */
	function focusInput() {
		if (inputRef) {
			inputRef.focus();
		}
	}
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

		previousRequestSet = new Set(languageNames);
	}

	/**
	 * Processes the inputed language names, it updates the sets and determines the differences between them.
	 * @param newInput
	 */
	function processInputedLanguages(newInput: string) {
		const newLanguages = parseLanguageInput(newInput);

		// Determine real changes in the input
		if (!setHelper.areSetsEqual(currentInputSet, new Set(newLanguages))) {
			currentInputSet = new Set(newLanguages);
			determineInvalidLanguages();

			// No input or only invalid input
			if (currentInputSet.size == 0 || currentInputSet.size == invalidLanguages.length) {
				cleanLanguageStore([]);
			}
		}

		let difference = setHelper.difference(currentInputSet, previousInputSet);
		realNewInput = difference.size > 0 ? [...difference][0] : '';

		// If new valid input was given
		if (realNewInput !== '') {
			let validLanguages = Array.from(currentInputSet).filter((lang) =>
				possibleLanguages.includes(lang.toLowerCase())
			);

			// If valid languages that have not been processed
			if (
				validLanguages.length > 0 &&
				!setHelper.areSetsEqual(new Set(validLanguages), previousRequestSet)
			) {
				debouncedFetchLanguageData(validLanguages);
			}

			previousInputSet = currentInputSet;
		} else {
			cleanLanguageStore(Array.from(currentInputSet));
		}
	}

	/**
	 * Update the language store to only keep languages whose names are in the passed  array.
	 *
	 * @param languageNames
	 */
	function cleanLanguageStore(languageNames: string[]): void {

		selectedLanguages.update((currentLanguages) => {
			const filteredLanguages = currentLanguages.filter((lang) =>
				languageNames.includes(lang.name.toLowerCase())
			);
			
			return filteredLanguages;
		});
	}
	/**
	 * Updates the input value and calls the debounced fetch function.
	 *
	 * @param {Event} event - Input event from the language input field.
	 */
	function onInput(event: Event): void {
		let newInput = (event.target as HTMLInputElement).value;
		inputValue = newInput.replace(/[^\p{L}\s,-]/gu, ''); // only letters, spaces, commas, and hyphens
		newInput = inputValue;

		processInputedLanguages(newInput);

		// Notify SearchSuggestions of the input
		dispatch('updateInputValue', realNewInput);
	}
</script>

<input
	bind:this={inputRef}
	bind:value={inputValue}
	on:input={onInput}
	class="text-lg text-center bg-white border border-gray-300 focus:border-sky-500 border-2 shadow-md w-full mx-auto px-4 py-2 rounded-lg focus:outline-none"
	{placeholder}
/>

<!-- Helper and Invalid Input Badges -->
<div class="flex flex-col items-center mt-2" style="min-height: 1.5rem;">
	{#if invalidLanguages.length > 0}
		<div class="flex flex-wrap justify-center gap-2">
			{#each invalidLanguages as invalidLang}
				<Badge color="red">{invalidLang}</Badge>
			{/each}
		</div>
	{:else}
		<Helper class="text-xs text-center" color="disabled">{helper}</Helper>
	{/if}
</div>
