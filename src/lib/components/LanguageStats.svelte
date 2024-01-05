<script lang="ts">
	import { ColoringHelper } from '$lib/helpers/ColoringHelper';
	import { FormatHelper } from '$lib/helpers/FormatHelper';
	import type Language from '$lib/model/language';

	// Properties that can be customized
	export let language: Language;
	export let unMember: boolean;

	// Reactive subscription to the store
	let languageColor: string;
	$: languageColor = ColoringHelper.getColorByLanguageName(language.name);

	const formatter = new FormatHelper();

	// Reactive variable for collapse/expand state
	let isCollapsed = true;

	// Toggle the collapsed state for the list of countries
	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}

	// Toggle on enter or space key press
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			toggleCollapse();
		}
	}
</script>

{#if language}
	<div class="list-container py-3">
		<div class="border border-gray-200 rounded-lg shadow-sm p-3">
			<div
				tabindex="0"
				role="button"
				on:click={toggleCollapse}
				on:keydown={handleKeydown}
				class="cursor-pointer"
			>
				<!-- First Row: Circle and Language Name -->
				<div class="flex items-center font-semibold">
					<span class="circle" style="background-color: {languageColor};" />
					<span class="ml-2">{formatter.capitalize(language.name)}</span>
				</div>

				<!-- Second Row: Countries and Speakers Information -->
				<div class="flex flex-col">
					<div class="flex flex-nowrap">
						<span class="whitespace-nowrap">
							{language.statistics.getCountries(unMember)} 🗺️
						</span>
					</div>
					<div class="flex flex-nowrap">
						<span class="whitespace-nowrap">
							{formatter.formatNumber(language.statistics.getSpeakers(unMember))} 🗣️
						</span>
					</div>
				</div>
			</div>

			{#if !isCollapsed}
				<ul>
					{#each language.countries as country}
						<li class="list-item">
							<span>{country.flag} {country.commonName}:</span>
							<span>{formatter.formatNumber(country.population)}</span>
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
