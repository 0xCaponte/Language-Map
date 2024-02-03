<script lang="ts">
	import CommunicationStats from '$lib/components/CommunicationStats.svelte';
	import LanguageBar from '$lib/components/LanguageBar.svelte';
	import WorldMap from '$lib/components/WorldMap.svelte';
</script>

<div class="flex flex-col overflow-hidden h-full">
	<!-- Language Bar -->
	<div class="w-full mx-auto sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/2 px-4">
		<LanguageBar />
	</div>

	<!-- Main Content and Sidebar -->
	<div class="flex flex-grow h-full">
		<!-- Map Container -->
		<div
			class="flex flex-grow items-center justify-center pl-3"
			style="max-height: calc(100vh - var(--header-height) - var(--footer-height));"
		>
			<WorldMap />
		</div>

		<!-- Communication Stats -->
		<div
			class="w-1/5 m-3"
			style="max-height: calc(100vh - var(--header-height) - var(--footer-height));"
		>
			<CommunicationStats />
		</div>
	</div>
</div>
