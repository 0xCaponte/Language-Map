<script lang="ts">
	import '../app.postcss';
	import { XCompanySolid, GithubSolid, GlobeOutline } from 'flowbite-svelte-icons';
</script>

<!-- Header -->
<nav class="flex flex-col p-4">
	<a href="/">Home - Language Map</a>
</nav>

<!-- the page's content will be inserted between the slots -->
<slot />

<!-- Footer -->
<footer class="flex flex-col items-center fixed bottom-0 z-20 w-full py-2 m-4">

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
</footer>

<style>
</style>
