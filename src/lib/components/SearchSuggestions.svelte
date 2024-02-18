<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { StringHelper } from '$lib/helpers/StringHelper';
	import { createEventDispatcher } from 'svelte';

	export let inputValue: string = '';
	export let possibleLanguages: string[] = [];

	let displayedSuggestions: string[] = [];
	let focusedIndex = 0; // Index of the highlighted suggestion

	// Helpers
	const stringHelper = new StringHelper();
	let dispatch = createEventDispatcher(); // Event dispatcher for selected suggestion

	// Exported function to clear suggestions shown
	export function clearSuggestions() {
		displayedSuggestions = [];
	}

	// Derive suggestions based on passed input
	$: {
		if (inputValue.trim().length === 0) {
			clearSuggestions();
		} else {
			let suggestions = possibleLanguages.filter((lang) =>
				lang.toLowerCase().startsWith(inputValue.trim().toLowerCase())
			);

			let exactMatch = possibleLanguages.some(
				(lang) => lang.toLowerCase() === inputValue.toLowerCase()
			);

			if (!exactMatch) {
				displayedSuggestions =
					suggestions.length > 5 ? [...suggestions.slice(0, 5), '...'] : suggestions;
			} else {
				clearSuggestions();
			}
		}
	}

	/**
	 * Reacts to the selection of a suggestion, dispatching the appropriate event and clearing the suggestions list.
	 * @param suggestion
	 */
	function suggestionSelected(suggestion: string) {
		dispatch('suggestionSelectedEvent', suggestion.toLowerCase());
		clearSuggestions();
	}

	/**
	 * On mount of the component set-up the logic for the pressing of the enter key
	 *
	 */
	onMount(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && displayedSuggestions.length > 0) {
				event.preventDefault(); // prevents default actions
				suggestionSelected(displayedSuggestions[focusedIndex]);
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
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
					on:touchend={() => suggestionSelected(suggestion.toLowerCase())}
				>
					{stringHelper.capitalize(suggestion)}
				</button>
			{:else}
				<li class="px-4 py-2 text-gray-500 text-lg">. . .</li>
			{/if}
		{/each}
	</ul>
{/if}
