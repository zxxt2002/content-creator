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

    let isPopupVisible = true;
</script>

<!-- Your content before the button -->



{#if isPopupVisible}
<div class="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-10"></div>
<div class="modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg flex flex-col justify-between z-20">
    <button on:click={closeHistory} class="close-btn">x</button>
    <h2 class="text-3xl font-medium pb-1">History</h2>
    <!-- Here you can list out your history content, whether it's in a list, table, etc. -->
    <ul>
        <!-- Example history list -->
        <li>Visited: Home Page</li>
        <li>Visited: About Page</li>
    </ul>
</div>
{/if}

<style>
    /* Add the same styles for overlay, modal, and close-btn from your login.svelte */
</style>
