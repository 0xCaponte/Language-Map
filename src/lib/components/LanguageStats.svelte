<script lang="ts">
	import type Language from '$lib/model/language';

	export let language: Language;
</script>

{#if language}
	<div class="list-container">
		<div class="flex items-center mb-2">
			<span class="dot mr-2" />
			<span class="font-semibold"> {language.name} </span>
			<span class="">
				{language.statistics.numberOfCountries}
				{language.statistics.numberOfCountries === 1 ? 'Country' : 'Countries'}
			</span>
			<span class=""> {language.statistics.totalSpeakers}</span>
		</div>

		<ul>
			{#each language.countries as country}
				<li class="list-item">
					<span>{country.commonName}</span>
					<span>{country.population}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}
