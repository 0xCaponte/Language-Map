<script lang="ts">
	import { StringHelper } from '$lib/helpers/StringHelper';
	import { createEventDispatcher, onMount } from 'svelte';

	export let inputValue: string = '';
	export let possibleLanguages: string[] = [];

	const stringHelper = new StringHelper();

	let displayedSuggestions: string[] = [];

	// Event dispatcher for selected suggestion
	let dispatch = createEventDispatcher();

	// Exported function to clear suggestions shown
	export function clearSuggestions() {
        displayedSuggestions = [];
    }

	// Derive suggestions based on passed input
	$: {

		// Empty input, no need for suggestions
		if (inputValue.trim().length === 0) {
			clearSuggestions()
		} else {
			// Filter valiid suggestions
			let suggestions = possibleLanguages.filter((lang) =>
				lang.toLowerCase().startsWith(inputValue.trim().toLowerCase())
			);

			// Input exactly matches a suggestion
			let exactMatch = possibleLanguages.some(
				(lang) => lang.toLowerCase() === inputValue.toLowerCase()
			);

			if (!exactMatch) {
				// Determine is a subset of suggestions is needed
				displayedSuggestions =
					suggestions.length > 5 ? [...suggestions.slice(0, 5), '...'] : suggestions;
			}
		}
	}

	/**
	 * Reacts to the selection of a suggestion, dispatching the appropriate event and clearing the sugestions list
	 * @param suggestion
	 */
	function suggestionSelected(suggestion: string) {
		dispatch('suggestionSelectedEvent', suggestion.toLowerCase());
		clearSuggestions()

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
					{stringHelper.capitalize(suggestion)}
				</button>
			{:else}
				<li class="px-4 py-2 text-gray-500 text-lg">. . .</li>
			{/if}
		{/each}
	</ul>
{/if}
