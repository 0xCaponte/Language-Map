<script lang="ts">
        import { createEventDispatcher } from 'svelte';

        export let open = false;
        export let title = '';
        export let classDialog = '';
        export let classBody = '';
        export let classHeader = '';

        const dispatch = createEventDispatcher();

        $: dispatch(open ? 'open' : 'close');

        function close() {
                open = false;
                dispatch('close');
        }
</script>

{#if open}
        <div role="dialog" aria-label={title} class={`modal-stub ${classDialog}`} data-testid="modal-stub">
                <div class={`modal-header ${classHeader}`}>
                        <button type="button" aria-label="Close modal" on:click={close}>Close modal</button>
                </div>
                <div class={`modal-body ${classBody}`}>
                        <slot />
                </div>
        </div>
{/if}
