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

	// Multi-word languages that need special handling
	const MULTI_WORD_LANGUAGES = [
		'sign language',
		'swiss german',
		'taiwanese hokkien',
		'taiwanese hakka'
	];

	// Pre-compile regex patterns and create lookup maps
	const LANGUAGE_REGEX_MAP = new Map();
	const LANGUAGE_UNDERSCORED_MAP = new Map();

	MULTI_WORD_LANGUAGES.forEach((language) => {
		// Regex pattern for each multi-word language
		LANGUAGE_REGEX_MAP.set(language, new RegExp(language.replace(/\s+/g, '\\s+'), 'gi'));

		// underscored version for each multi-word language
		LANGUAGE_UNDERSCORED_MAP.set(language, language.replace(/\s+/g, '_'));
	});

	/**
	 * Parses the input from the language bar and handles multi-word language names.
	 *
	 * @param input User input string
	 * @returns Array of parsed language names
	 */
	function parseLanguageInput(input: string): string[] {
		// Pre-process to handle multi-word languages as special cases
		let processedInput = input.toLowerCase();

		// Replace spaces with underscores in multi-word languages
		for (const language of MULTI_WORD_LANGUAGES) {
			const regex = LANGUAGE_REGEX_MAP.get(language);
			const underscoredLang = LANGUAGE_UNDERSCORED_MAP.get(language);
			processedInput = processedInput.replace(regex, underscoredLang);
		}

		// Split by space or comma
		let languageNames: string[] = processedInput.split(/,|\s+/);

		// Post-process to restore multi-word languages and clean up
		languageNames = languageNames
			.map((term) => {
				term = term.trim();
				if (!term) return '';

				for (const [language, underscoredLang] of LANGUAGE_UNDERSCORED_MAP.entries()) {
					if (term === underscoredLang) {
						return language;
					}
				}
				return term;
			})
			.filter(Boolean);

		return Array.from(new Set(languageNames));
	}

	/**
	 * Fetches language data from the API and processes the returning data
	 * @param languageNames Array of language names
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
	 * Formats language list with commas as separators and capitalizes each language
	 * @param languages Array of language names
	 * @returns Formatted string with comma separators and capitalized languages
	 */
	function formatLanguagesWithCommas(languages: string[]): string {
		return languages.map((lang) => stringHelper.capitalize(lang)).join(', ');
	}

	/**
	 * Processes the inputed language names, it updates the sets and determines the differences between them.
	 * @param newInput
	 */
	function processInputedLanguages(newInput: string) {
		const newLanguages = parseLanguageInput(newInput);

		// Store cursor position
		const cursorPos = inputRef?.selectionStart || 0;
		const originalLength = inputValue.length;

		// Determine real changes in the input
		if (!setHelper.areSetsEqual(currentInputSet, new Set(newLanguages))) {
			currentInputSet = new Set(newLanguages);
			determineInvalidLanguages();

			// No input or only invalid input
			if (currentInputSet.size == 0 || currentInputSet.size == invalidLanguages.length) {
				cleanLanguageStore([]);
				previousRequestSet = new Set();
				previousInputSet = new Set();
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

				// Format when we have valid languages that match our possible languages list
				if (validLanguages.length >= 1) {
					formatInput();
				}
			}

			previousInputSet = currentInputSet;
		} else {
			cleanLanguageStore(Array.from(currentInputSet));
		}
	}

	/**
	 * Formats the input with comma separators while preserving cursor position
	 */
	function formatInput() {
		// Store cursor position
		const cursorPos = inputRef?.selectionStart || 0;
		const originalLength = inputValue.length;
		let cursorOffset = 0;

		// Get valid languages
		const validLanguages = Array.from(currentInputSet).filter(
			(lang) => !invalidLanguages.includes(lang)
		);

		if (validLanguages.length > 0) {
			// Only reformat if necessary
			const formattedInput = formatLanguagesWithCommas(validLanguages);
			if (formattedInput !== inputValue) {
				inputValue = formattedInput;

				// Try to maintain cursor position relative to input length change
				cursorOffset = inputValue.length - originalLength;

				// Restore cursor position after formatting
				setTimeout(() => {
					if (inputRef && cursorOffset !== 0) {
						// If cursor was at the end, keep it at the end
						if (cursorPos === originalLength) {
							inputRef.selectionStart = inputRef.selectionEnd = inputValue.length;
						} else {
							// Otherwise adjust position by the length change
							const newPos = Math.min(inputValue.length, Math.max(0, cursorPos + cursorOffset));
							inputRef.selectionStart = inputRef.selectionEnd = newPos;
						}
					}
				}, 0);
			}
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
		// Don't overwrite inputValue directly, just clean invalid chars
		const cleanedInput = newInput.replace(/[^\p{L}\s,-]/gu, ''); // only letters, spaces, commas, and hyphens

		if (cleanedInput !== newInput) {
			(event.target as HTMLInputElement).value = cleanedInput;
			newInput = cleanedInput;
		}

		processInputedLanguages(newInput);

		// Notify SearchSuggestions of the input
		dispatch('updateInputValue', realNewInput);
	}
</script>

<input
	bind:this={inputRef}
	bind:value={inputValue}
	on:input={onInput}
	class="text-lg text-center bg-white border border-sky-300 focus:border-sky-500 border-2 shadow-md w-full mx-auto px-4 py-2 rounded-lg focus:outline-none"
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
