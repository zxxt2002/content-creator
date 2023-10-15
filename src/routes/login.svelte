<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    let username = '';
    let password = '';

    const handleLogin = () => {
        // Handle your login logic here
        // Likely involves sending username and password to your backend
    };

    const closeLogin = () => {
        isPopupVisible = false;
        dispatch('close');
    };

    let isPopupVisible = true; // This variable will handle the visibility of the popup

    const closePopup = () => {
        isPopupVisible = false;
    };
</script>



<style>
    div.modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 100;
    }

    div.overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        z-index: 50;
    }

    .close-btn {
        position: absolute;
        right: 10px;
        top: 10px;
        background-color: transparent;
        border: 2px solid gray; /* Adding a border */
        color: gray; /* Change the button text color */
        cursor: pointer;
        font-size: 20px;
        border-radius: 50%; /* Makes it round */
        width: 24px;
        height: 24px;
        line-height: 20px; /* Center the 'X' vertically */
        text-align: center; /* Center the 'X' horizontally */
    }
    .close-btn:hover {
        background-color: gray;
        color: white;
    }

    input {
        padding: 8px 12px;
        border: 2px solid gray; /* Gray outline */
        border-radius: 4px; /* Optional: to have rounded corners */
    }

    input:focus {
        outline: none;
        border-color: darkgray; /* Darker border when the input is focused */
    }
</style>

{#if isPopupVisible}
<div class="overlay"></div>
<div class="modal">
    <button on:click={closeLogin} class="close-btn">x</button>
    <h2>Login</h2>
    <form on:submit|preventDefault={handleLogin}>
        <label for="username">Username:</label>
        <input type="text" bind:value={username} />

        <label for="password">Password:</label>
        <input type="password" bind:value={password} />

        <button type="submit">Login</button>
    </form>
</div>
{/if}
