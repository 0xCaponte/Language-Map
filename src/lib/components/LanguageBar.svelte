<script lang="ts">
	import { Input, Helper } from 'flowbite-svelte';
	import { selectedLanguages } from '$lib/store';

	import type Language from '$lib/model/language';
	import DebounceHelper from '$lib/helpers/DebounceHelper';

	// Debounced fetch execution
	let debounceHelper = new DebounceHelper();
	const debouncedFetchLanguageData = debounceHelper.debounce(fetchLanguageData);

	// Properties that can be customized
	export let placeholder: string = 'What Languages Do You Speak?';
	export let helper: string = 'Separate languages with space or a comma';

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
			let languages: Language[] = await response.json();
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
