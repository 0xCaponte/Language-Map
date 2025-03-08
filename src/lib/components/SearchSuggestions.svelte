<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { StringHelper } from '$lib/helpers/StringHelper';
	import { createEventDispatcher } from 'svelte';

	export let inputValue: string = '';
	export let possibleLanguages: string[] = [];

	let displayedSuggestions: string[] = [];
	let focusedIndex = -1; // Start with no focus (-1)

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
	 * Handle keyboard navigation through suggestions
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (displayedSuggestions.length === 0) return;
		
		switch (event.key) {
		  case 'ArrowDown':
			event.preventDefault();
			// Move focus down, but only through actual suggestions (not the "..." item)
			focusedIndex = Math.min(
			  focusedIndex + 1, 
			  displayedSuggestions.length - (displayedSuggestions[displayedSuggestions.length - 1] === '...' ? 2 : 1)
			);
			break;
			
		  case 'ArrowUp':
			event.preventDefault();
			// Move focus up (minimum is 0)
			focusedIndex = Math.max(focusedIndex - 1, 0);
			break;
			
		  case 'Enter':
			if (focusedIndex >= 0 && focusedIndex < displayedSuggestions.length) {
			  event.preventDefault(); // prevents default actions
			  suggestionSelected(displayedSuggestions[focusedIndex]);
			}
			break;
			
		  case 'Escape':
			event.preventDefault();
			clearSuggestions();
			break;
		}
	  }

	/**
	 * Reset focus index when suggestions change
	 */
	$: if (displayedSuggestions.length > 0 && focusedIndex < 0) {
		focusedIndex = 0;
	} else if (displayedSuggestions.length === 0) {
		focusedIndex = -1;
	}

	/**
	 * On mount of the component set-up the keyboard navigation
	 */
	onMount(() => {
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
					class="px-4 py-2 w-full text-left text-lg hover:bg-gray-100 {index === focusedIndex ? 'bg-gray-100 font-semibold' : ''}"
					on:click={() => suggestionSelected(suggestion.toLowerCase())}
					on:touchend={() => suggestionSelected(suggestion.toLowerCase())}
					on:mouseover={() => focusedIndex = index}
					on:focus={() => focusedIndex = index}
				>
					{stringHelper.capitalize(suggestion)}
				</button>
			{:else}
				<li class="px-4 py-2 text-gray-500 text-lg">. . .</li>
			{/if}
		{/each}
	</ul>
{/if}
