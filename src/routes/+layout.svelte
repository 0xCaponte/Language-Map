<script lang="ts">
	import '../app.postcss';
	import { XCompanySolid, GithubSolid, GlobeOutline } from 'flowbite-svelte-icons';

	const currentYear = new Date().getFullYear();
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<!-- Header / Navbar -->
	<nav class="flex items-center justify-between p-4">
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

	<!-- Footer -->

	<footer class="flex flex-col items-center py-2">
		<!--     <footer class="flex flex-col items-center fixed bottom-0 z-20 w-full py-2 m-4"> -->

		<div class="flex space-x-10">
			<a href="https://x.com/caponte" target="_blank" class="w-6 h-6">
				<XCompanySolid class="w-6 h-6" />
			</a>
			<a href="https://github.com/0xcaponte" target="_blank" class="w-6 h-6">
				<GithubSolid class="w-6 h-6" />
			</a>
			<a href="https://caponte.io" target="_blank" class="w-6 h-6">
				<GlobeOutline class="w-6 h-6" />
			</a>
		</div>
		<div>
			<p class="text-xs">© {currentYear} Carlos Aponte - All Rights Reserved.</p>
		</div>
	</footer>
</div>