<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let isPopupVisible = false;

    const showHistoryPopup = () => {
        isPopupVisible = true;
    };

    const closeHistoryPopup = () => {
        isPopupVisible = false;
        dispatch('close');  // this will notify any parent component if needed
    };
</script>

<!-- Your content before the button -->



{#if isPopupVisible}
<div class="overlay" on:click={closeHistoryPopup}></div>
<div class="modal">
    <button on:click={closeHistoryPopup} class="close-btn">x</button>
    <h2>History</h2>
    <!-- You can list out your history content here, whether it's in a list, table, etc. -->
</div>
{/if}

<style>
    /* Add the same styles for overlay, modal, and close-btn from your login.svelte */
</style>
