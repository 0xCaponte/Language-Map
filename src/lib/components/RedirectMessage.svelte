<!-- src/lib/components/RedirectMessage.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  export let message: string;
  export let redirectUrl: string = '/';
  export let delay: number = 4000;

  onMount(() => {
    const timer = setTimeout(() => {
      goto(redirectUrl, { replaceState: true });
    }, delay);

    return () => clearTimeout(timer);
  });
</script>

<div class="flex flex-col items-center justify-center min-h-screen text-center p-4">
  <div class="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
    <h1 data-testid="message" class="text-2xl font-bold text-gray-800 dark:text-white">{message}</h1>
  </div>
</div>
