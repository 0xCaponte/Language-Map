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
		<div
			class="flex items-center font-semibold mb-2"
			tabindex="0"
			role="button"
			on:click={toggleCollapse}
			on:keydown={handleKeydown}
			style="cursor: pointer;"
		>
			<div>
				<span class="circle" style="background-color: {languageColor};" />
				<span class="font-semibold">{formatter.capitalize(language.name)}</span>
			</div>
			
			<div class="flex items-center font-semibold">
				<span class="">
					{language.statistics.getCountries(unMember)}
					{language.statistics.getCountries(unMember) === 1 ? 'Country' : 'Countries'}
				</span>
				<span class=""> -- </span>
				<span class=""> {formatter.formatNumber(language.statistics.getSpeakers(unMember))} people </span>
			</div>
		</div>

		{#if !isCollapsed}
			<ul>
				{#each language.countries as country}
					<li class="list-item">
						<span>{country.commonName}</span>
						<span>{formatter.formatNumber(country.population)}</span>
					</li>
				{/each}
			</ul>
		{/if}
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
