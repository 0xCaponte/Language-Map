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

<div class="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden">
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

	<!-- Footers -->

	<!-- Footer for larger screens ( >= LG)  -->
	<footer class="hidden lg:flex px-4 py-2 w-full" style="height: var(--footer-height);">
		<div class="flex flex-row justify-between items-center w-full">
			<!-- KoFi Component on the left -->
			<div class="mb-4 lg:mb-0">
				<!-- Custom KoFi Button -->
				<button on:click={() => window.open('https://ko-fi.com/caponte', '_blank')}>
					<img
						height="35"
						style="border:0; border-radius:8px; height:35px; width: auto;"
						src="https://storage.ko-fi.com/cdn/brandasset/kofi_button_stroke.png"
						alt="Support me on Ko-fi"
					/>
				</button>
			</div>

			<!-- Globe and Copyright centered for small screens, inline for larger -->
			<div
				class="flex flex-col lg:flex-row items-center justify-center lg:justify-between space-y-2 lg:space-y-0 lg:space-x-2"
			>
				<a href="https://caponte.io" target="_blank" class="block lg:mb-0">
					<GlobeOutline size="lg" />
				</a>
				<p class="text-xs">© {currentYear} All Rights Reserved.</p>
			</div>

			<!-- Twitter Icon on the right -->
			<div>
				<a
					href="https://x.com/0xcaponte"
					target="_blank"
					class="flex items-center font-semibold border shadow-md rounded-xl justify-center px-4 py-2 lg:justify-end"
					style="height:35px; width: auto;"
				>
					<TwitterSolid size="md" /> @0xCaponte
				</a>
			</div>
		</div>
	</footer>

	<!-- Footer for smaller screens ( < LG) -->
	<footer class="lg:hidden px-4 py-2 w-full">
		<div class="flex flex-col items-center space-y-2">
			<!-- First Row: KoFi Button and Twitter Icon -->
			<div class="flex justify-between items-center w-full">
				<!-- Custom KoFi Button with different image and text "Support me" -->
				<button
					on:click={() => window.open('https://ko-fi.com/caponte', '_blank')}
					class="flex items-center font-semibold border shadow-md rounded-xl justify-center px-2 py-2"
					style="height:35px; width: 150px;"
				>
					<img
						height="35"
						style="border:0; border-radius:8px; height:35px; width: auto;"
						src="https://storage.ko-fi.com/cdn/brandasset/kofi_s_logo_nolabel.png"
						alt="Support me on Ko-fi"
					/>
					<span class="ml-1">Support me</span>
				</button>

				<!-- Twitter Icon -->
				<a
					href="https://x.com/0xcaponte"
					target="_blank"
					class="flex items-center font-semibold border shadow-md rounded-xl justify-center px-2 py-2"
					style="height:35px; width: 150px;"
				>
					<TwitterSolid size="md" /> @0xCaponte
				</a>
			</div>

			<!-- Second Row: Globe and Copyright Notice -->
			<div class="flex justify-center items-center w-full">
				<a href="https://caponte.io" target="_blank" class="block">
					<GlobeOutline size="md" />
				</a>
				<p class="text-xs">© {currentYear} All Rights Reserved.</p>
			</div>
		</div>
	</footer>
</div>
