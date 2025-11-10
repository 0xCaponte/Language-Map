<script lang="ts">
	import MainPage from '../../+page.svelte';
	export let data;
</script>

<MainPage defaultCountrySlug={data.countrySlug} />
