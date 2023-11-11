<script>
	import { Input, FloatingLabelInput, Helper } from 'flowbite-svelte';
</script>

<div class="flex flex-col min-h-screen">
    <!-- Search Bar -->
    <div class="w-full bg-gray-100 mx-auto sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/2 px-4">
        <Input
            id="languages-input"
            class="text-lg text-center bg-transparent"
            placeholder="What Languages Do You Speak?"
        />

        <Helper class="pt-2 text-xs text-center" color="disabled"
            >Separate languages with space or a comma</Helper
        >
    </div>

    <!-- Main Content and Sidebar -->
    <div class="flex flex-grow">
        <!-- Map -->
        <div class="bg-blue-100 shadow rounded-lg flex-grow m-2 p-4">
            <div class="text-lg">Main content (80%)</div>
        </div>

        <!-- Languages -->
        <div class="bg-red-100 shadow rounded-lg flex-none w-1/5 m-2 p-4">
            <div class="text-lg">Sidebar content (20%)</div>
        </div>
    </div>
</div>

