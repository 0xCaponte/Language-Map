<script lang="ts">
	import { ColoringHelper } from '$lib/helpers/ColoringHelper';
	import { FormatHelper } from '$lib/helpers/FormatHelper';
	import type Language from '$lib/model/language';
	import { AngleDownSolid, ChevronDoubleDownOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	// Properties that can be customized
	export let language: Language;
	export let unMember: boolean;
	export let active: boolean; // This accordion is active
	export let onToggle: (id: string) => void;

	const dispatch = createEventDispatcher();

	// Reactive subscription to the store
	let languageColor: string;
	$: languageColor = ColoringHelper.getColorByLanguageName(language.name);

	const formatter = new FormatHelper();

	// Accordion click
	function handleAccordionClick() {
		onToggle(language.name);
	}

	// Keydown for accordion
	function handleAccordeonKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			handleAccordionClick();
		}
	}
</script>

{#if language}
	<div class="list-container py-3">
		<div class="border border-gray-200 rounded-lg shadow-sm p-3">
			<!-- First Row: Circle and Language Name -->
			<div
				tabindex="0"
				role="button"
				on:click={() => onToggle(language.name)}
				on:keydown={(event) => handleAccordeonKeydown(event)}
				class="cursor-pointer flex justify-between items-center"
			>
				<!-- Content and Circle -->
				<div class="flex items-center">
					<span class="circle" style="background-color: {languageColor};" />
					<span class="ml-2">{formatter.capitalize(language.name)}</span>
				</div>

				<!-- Arrow to open/clode area -->
				<AngleDownSolid class="{active ? 'rotate-180' : ''}" size="sm" aria-hidden="true" />
			</div>
			<!-- Second Row: Countries and Speakers Information -->
			<div class="flex flex-col">
				<div class="flex flex-nowrap py-1">
					<span class="whitespace-nowrap">
						🗺️{language.statistics.getCountries(unMember)}
						🗣️{formatter.formatNumber(language.statistics.getSpeakers(unMember))}
					</span>
				</div>
			</div>

			{#if active}
				<ul>
					{#each language.countries as country}
						<li class="list-item">
							<span class="emoji-flag" style="font-family: 'FlagEmoji';">
								{country.flag}
							</span>
							{country.commonName}:
							<span>{formatter.formatNumber(country.getSpeakers(language.name))}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}

<style>
	.circle {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		margin-right: 8px;
		display: inline-block;
		vertical-align: middle;
	}
</style>
