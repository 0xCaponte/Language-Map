<script lang="ts">
	import { FormatHelper } from '$lib/helpers/FormatHelper';
	import { createEventDispatcher, onMount } from 'svelte';

	export let inputValue: string = '';
	export let possibleLanguages: string[] = [];

	const formatter = new FormatHelper();

	let suggestions: string[] = [];
	let displayedSuggestions: string[] = [];

	// Event dispatcher for selected suggestion
	let dispatch = createEventDispatcher();

	// Derive suggestions based on the input
	$: {
		suggestions = possibleLanguages.filter((lang) =>
			lang.toLowerCase().startsWith(inputValue.toLowerCase())
		);

		// Input matches a suggestion
		let exactMatch = possibleLanguages.some(
			(lang) => lang.toLowerCase() === inputValue.toLowerCase()
		);

		if (!exactMatch) {
			if (suggestions.length > 5) {
				displayedSuggestions = suggestions.slice(0, 5);
				displayedSuggestions.push('...');
			} else {
				displayedSuggestions = suggestions;
			}
		} else {
			// If there is a match, no need for suggestions
			displayedSuggestions = [];
		}
	}

	function suggestionSelected(suggestion: string) {
		dispatch('suggestionSelectedEvent', suggestion.toLowerCase());
	}
</script>

{#if displayedSuggestions.length > 0}
	<ul
		class="bg-white border border-gray-200 divide-y divide-gray-200 shadow-md rounded-bl-lg rounded-br-lg"
	>
		{#each displayedSuggestions as suggestion, index}
			{#if index < 5}
				<button
					class="px-4 py-2 w-full text-left text-lg hover:bg-gray-100"
					on:click={() => suggestionSelected(suggestion.toLowerCase())}
				>
					{formatter.capitalize(suggestion)}
				</button>
			{:else}
				<li class="px-4 py-2 text-gray-500 text-lg">. . .</li>
			{/if}
		{/each}
	</ul>
{/if}
