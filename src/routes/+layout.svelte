<script lang="ts">
	import '../app.postcss';
	import '../app.css';
	import { TwitterSolid, GithubSolid, GlobeOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import KoFi from '$lib/components/KoFi.svelte';

	const currentYear = new Date().getFullYear();

	onMount(() => {
		// Only used for statistics, no PII
		if (!sessionStorage.getItem('sessionID')) {
			const uuid = crypto.randomUUID();
			sessionStorage.setItem('sessionID', uuid);
		}
	});
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<!-- Header / Navbar -->
	<nav class="header flex items-center justify-between p-4" style="height: var(--header-height);">
		
		<!-- Title name -->
		<a href="/" class="flex items-center">
			<span class="text-xl font-bold">Language Map</span>
		</a>

		<!-- Navigation Links -->
		<div class="flex">
			<a href="/" class="ml-4">Home</a>
			<a href="/about" class="ml-4">About</a>
		</div>
	</nav>

	<!-- Main Content +page.svelte is inserted here  -->
	<div
		class="flex-grow overflow-y-auto"
		style="max-height: calc(100vh - var(--header-height) - var(--footer-height));"
	>
		<slot />
	</div>

	<!-- Footer -->
	<footer class="flex items-center py-2 w-full px-4 relative" style="height: var(--footer-height);">
		
		<!-- Left-aligned - Ko-Fi -->
		<div class="flex items-center">
			<KoFi />
		</div>

		<!-- Right-aligned - Twitter -->
		<a
			href="https://x.com/0xcaponte"
			target="_blank"
			class="ml-auto flex items-center font-semibold border shadow-md rounded-xl px-4 py-2"
		>
			<TwitterSolid size="md" class="mr-1" /> @0xCaponte
		</a>

		<!-- Absolute Centered Content -->
		<div class="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-center w-full">
			<div class="flex flex-col items-center">
				<a href="https://caponte.io" target="_blank" class="block">
					<GlobeOutline size="lg" />
				</a>
				<p class="text-xs">© {currentYear} Carlos Aponte - All Rights Reserved.</p>
			</div>
		</div>
	</footer>
</div>
