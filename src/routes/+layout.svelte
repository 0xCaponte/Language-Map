<script lang="ts">
	import '../app.postcss';
	import '../app.css';

	import { MetaTags } from 'svelte-meta-tags';
	import { TwitterSolid, GlobeOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	const currentYear = new Date().getFullYear();

	onMount(() => {
		// Only used for statistics, no PII
		if (!sessionStorage.getItem('sessionID')) {
			const uuid = crypto.randomUUID();
			sessionStorage.setItem('sessionID', uuid);
		}
	});
</script>

<MetaTags
	title="Language Map 🗺️🗣️"
	description="Your Languages, Your Map - Explore Where Your Languages Connect You!"
	canonical="https://www.languagemap.world/"
	openGraph={{
		url: 'https://www.languagemap.world',
		title: 'Language Map',
		description: 'Your Languages, Your Map - Explore Where Your Languages Connect You!',
		images: [
			{
				url: 'https://r2.languagemap.world/resources/images/og.png',
				width: 1200,
				height: 630,
				alt: 'Language Map Image Alt'
			}
		],
		siteName: 'Language Map'
	}}
	twitter={{
		handle: '@0xCaponte',
		cardType: 'summary_large_image',
		title: 'Language Map',
		description: 'Your Languages, Your Map - Explore Where Your Languages Connect You!',
		image: 'https://r2.languagemap.world/resources/images/og.png',
		imageAlt: 'Language Map image alt'
	}}
/>

<div class="flex flex-col lg:h-screen overflow-hidden">
	<!-- Header / Navbar -->
	<nav class="header flex items-center justify-between p-4" style="height: var(--header-height);">
		<!-- Title name -->
		<a href="/" class="flex items-center">
			<span class="text-xl font-bold text-gray-800">Language Map</span>
		</a>

		<!-- Navigation Links -->
		<div class="flex">
			<a href="/" class="ml-4 text-gray-800">Home</a>
			<a href="/about" class="ml-4 text-gray-800">About</a>
		</div>
	</nav>

	<!-- Main Content +page.svelte is inserted here -->
	<div
		class="flex-grow overflow-y-auto"
		style="max-height: calc(100vh - var(--header-height) - var(--footer-height));"
	>
		<slot />
	</div>

	<!-- Footer -->
	<footer
		class="flex flex-col justify-between w-full px-4 py-2 lg:flex-row lg:items-center"
		style="height: var(--footer-height);"
	>
		<div class="grid grid-cols-2 gap-4 lg:flex lg:flex-1 lg:gap-0">
			<!-- Globe and All Rights Reserved -->
			<div class="flex flex-row items-center justify-start col-span-1">
				<a href="https://caponte.io" target="_blank" class="block">
					<GlobeOutline size="lg" />
				</a>
				<p class="text-xs ml-2">© {currentYear} All Rights Reserved.</p>
			</div>

			<!-- Twitter Icon -->
			<div class="col-span-1 ml-auto">
				<a
					href="https://x.com/0xcaponte"
					target="_blank"
					class="flex items-center font-semibold border shadow-md rounded-xl justify-center px-4 py-2 lg:justify-end"
				>
					<TwitterSolid size="md" /> @0xCaponte
				</a>
			</div>
		</div>
	</footer>
</div>
