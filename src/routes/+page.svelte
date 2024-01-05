<script lang="ts">
	import CommunicationStats from '$lib/components/CommunicationStats.svelte';
	import LanguageBar from '$lib/components/LanguageBar.svelte';
	import WorldMap from '$lib/components/WorldMap.svelte';
</script>

<div class="flex flex-col overflow-hidden">

	<!-- Language Bar -->
	<div class="w-full mx-auto sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/2 px-4">
		<LanguageBar />
	</div>

	<!-- Main Content and Sidebar -->
	<div class="flex flex-grow overflow-hidden">
        <!-- Map -->
        <div class="flex flex-grow flex-shrink flex-col overflow-hidden m-2 items-center" style="max-height: calc(100vh - var(--other-elements-height));">
            <WorldMap />
        </div>

        <!-- Languages -->
        <div class="w-1/5 m-2">
            <CommunicationStats />
        </div>
    </div>
</div>

<style>
    :root {
        --other-elements-height: 210px; 
    }
</style>