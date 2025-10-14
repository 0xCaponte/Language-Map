<!-- src/routes/+error.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import RedirectMessage from '$lib/components/RedirectMessage.svelte';

  const friendlyMessage =
    "Lost in translation? 🗺️ This language doesn't speak to us... yet. Let's head back and explore the languages that do! 🌍";
</script>

{#if $page.status === 404}
  <RedirectMessage message={friendlyMessage} />
{:else}
  <div class="flex flex-col items-center justify-center min-h-screen text-center p-4">
    <div class="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
        {$page.status}: {$page.error?.message}
      </h1>
    </div>
  </div>
{/if}
