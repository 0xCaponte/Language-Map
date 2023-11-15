<script lang="ts">
	import CommunicationStats from '$lib/components/CommunicationStats.svelte';
    import LanguageBar from '$lib/components/LanguageBar.svelte';
</script>
<div class="flex flex-col min-h-screen">

    <!-- Language Bar -->
    <div class="w-full bg-gray-100 mx-auto sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/2 px-4">
        <LanguageBar />
    </div>

    <!-- Main Content and Sidebar -->
    <div class="flex flex-grow">
      
        <!-- Map -->
        <div class="bg-blue-100 shadow rounded-lg flex-grow m-2 p-4">
            <div class="text-lg">Map content (80%)</div>
        </div>

        <!-- Languages -->
        <div class="bg-red-100 shadow rounded-lg flex-none w-1/5 m-2 p-4">
            <CommunicationStats />
        </div>
    </div>
</div>

