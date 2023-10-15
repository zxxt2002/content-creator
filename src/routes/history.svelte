<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let visible = false;  // accept the prop from parent
    export let onClose = () => {};  // accept the close function from parent

    const closeHistoryPopup = () => {
        onClose();  // use the function passed from the parent to close the popup
        dispatch('close');  // this will notify any parent component if needed
    };
</script>

<!-- Your content before the button -->



{#if visible}
<div class="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-10"></div>
<div class="modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg flex flex-col justify-between z-20">
    <button on:click={closeHistoryPopup} class="close-btn">x</button>
    <h2 class="text-3xl font-medium pb-1">History</h2>
    <!-- Here you can list out your history content -->
    <ul class="history-list">
        <li class="history-item">
            <span class="content">Generated content example 1...</span>
        </li>
        <li class="history-item">
            <span class="content">Generated content example 2...</span>
        </li>
        <li class="history-item">
            <span class="content">Generated content example 3...</span>
        </li>
        <!-- Add more history items as required -->
    </ul>
</div>
{/if}

<style>
    /* Add the same styles for overlay, modal, and close-btn from your login.svelte */
    .history-list {
        list-style: none;
        padding: 0;
    }

    .history-item {
        display: flex;
        align-items: center;
        padding: 5px 0;
    }

    .content {
        font-size: 1rem;
    }

    .close-btn {
        background-color: #f0f0f0;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 10px;
        right: 10px;
    }
</style>
