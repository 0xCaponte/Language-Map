<script lang="ts">
        import { createEventDispatcher } from 'svelte';

        export let open = false;
        export let title = '';

        const dispatch = createEventDispatcher();

        $: dispatch(open ? 'open' : 'close');

        function close() {
                open = false;
                dispatch('close');
        }
</script>

{#if open}
        <div role="dialog" aria-label={title} class="modal-stub">
                <button type="button" aria-label="Close modal" on:click={close}>Close modal</button>
                <slot />
        </div>
{/if}
