<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let inputValue: string = '';
	export let possibleLanguages: string[] = [];

	let suggestions: string[] = [];
	let displayedSuggestions: string[] = [];

    // Event dispatcher for selected suggestion
    const dispatch = createEventDispatcher<{ select: string }>();

	// Derive suggestions based on inputValue
	$: {
		suggestions = possibleLanguages.filter((lang) =>
			lang.toLowerCase().startsWith(inputValue.toLowerCase())
		);

		// Check if the input value exactly matches any suggestion
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
		}else{
            displayedSuggestions = [];
        }
	}

	/**
	 * Fetch the available language names on mount of the component
	 */
	onMount(async () => {
		const response = await fetch('/api/languages');

		if (response.ok) {
			possibleLanguages = await response.json();
		} else {
			console.error('Failed to fetch language names');
		}
	});

	/**
	 * Event to notify the parent of the selection
	 * @param suggestion
	 */
	function onSelectSuggestion(suggestion: string) {
		dispatch('select', suggestion);
	}
</script>

{#if displayedSuggestions.length > 0}
	<ul class="bg-white border border-gray-200 divide-y divide-gray-200 shadow-md rounded-bl-lg rounded-br-lg">
		{#each displayedSuggestions as suggestion, index}
			{#if index < 5}
				<button
					class="px-4 py-2 w-full text-left text-lg hover:bg-gray-100"
					on:click={() => onSelectSuggestion(suggestion)}
				>
					{suggestion}
				</button>
			{:else}
				<li class="px-4 py-2 text-gray-500 text-lg">. . .</li>
			{/if}
		{/each}
	</ul>
{/if}
