<script lang="ts">
	import { Input, Helper } from 'flowbite-svelte';
	import { selectedLanguages } from '$lib/store';

	import DebounceHelper from '$lib/helpers/DebounceHelper';
	import Language from '$lib/model/language';
	import type Country from '$lib/model/country';
	import type Statistics from '$lib/model/statistics';
	import { ColoringHelper } from '$lib/helpers/ColoringHelper';
	
	// Properties that can be customized
	export let placeholder: string = 'What Languages Do You Speak?';
	export let helper: string = 'Separate languages with spaces or commas';

	// Debounced fetch execution
	let debounceHelper = new DebounceHelper();
	const debouncedFetchLanguageData = debounceHelper.debounce(fetchLanguageData);

	/**
	 * Parses the input from the language input bar and returns an array of Language objects.
	 *
	 * @param event
	 */
	function parseLanguageInput(event: Event): string[] {
		const input: string = (event.target as HTMLInputElement).value;

		// Input split and clean-up
		let languageNames: string[] = input.split(/,|\s+/); // Split by space or comma
		languageNames = languageNames.map((e) => e.toLowerCase().trim()).filter(Boolean);

		return languageNames;
	}

	/**
	 * Fetches language data from the API using a POST request with an array of language names.
	 *
	 * @param languageNames
	 */
	async function fetchLanguageData(languageNames: string[]) {
		const response = await fetch('/api/languages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ languageNames })
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
		}
	}

	/**
	 * Updates the selectedLanguages store with the parsed languages
	 *
	 * @param {Event} event - Input event from the language input field.
	 */
	function updateLanguageStore(event: Event): void {
		const languages: string[] = parseLanguageInput(event);
		debouncedFetchLanguageData(languages);
	}
</script>

<Input
	id="languages-input"
	class="text-lg text-center bg-transparent"
	{placeholder}
	on:input={updateLanguageStore}
/>

<Helper class="pt-2 text-xs text-center" color="disabled">{helper}</Helper>
