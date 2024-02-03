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
	<nav class="header flex items-center justify-between p-4">
		<!-- Logo and Name -->
		<a href="/" class="flex items-center">
			<!-- <img src="/logo.svg" alt="Logo" class="h-8 mr-2" /> -->
			<span class="text-xl font-bold">Language Map</span>
		</a>

		<!-- Navigation Links -->
		<div class="flex">
			<a href="/" class="ml-4">Home</a>
			<a href="/about" class="ml-4">About</a>
		</div>
	</nav>

	<!-- +page.svelte is inserted here  -->
	<div class="flex-grow overflow-y-auto">
		<slot />
	</div>

	<!-- Ko-Fi -->
	<div>
		<KoFi />
	</div>

	<!-- Footer -->
	<footer class="footer flex flex-col items-center py-2">
		<!--     <footer class="flex flex-col items-center fixed bottom-0 z-20 w-full py-2 m-4"> -->

		<div class="flex space-x-10">
			<a href="https://x.com/caponte" target="_blank">
				<TwitterSolid size="lg" />
			</a>
			<a href="https://github.com/0xcaponte" target="_blank">
				<GithubSolid size="lg" />
			</a>
			<a href="https://caponte.io" target="_blank">
				<GlobeOutline size="lg" />
			</a>
		</div>
		<div>
			<p class="text-xs">© {currentYear} Carlos Aponte - All Rights Reserved.</p>
		</div>
	</footer>
</div>
