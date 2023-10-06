<script>
    let username = '';
    let password = '';

    const handleLogin = () => {
        // Handle your login logic here
        // Likely involves sending username and password to your backend
    };
</script>

<h2>Login</h2>
<form on:submit|preventDefault={handleLogin}>
    <label for="username">Username:</label>
    <input type="text" bind:value={username} />

    <label for="password">Password:</label>
    <input type="password" bind:value={password} />

    <button type="submit">Login</button>
</form>

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
</style>

<div class="overlay"></div>
<div class="modal">
    <h2>Login</h2>
    <form on:submit|preventDefault={handleLogin}>
        <label for="username">Username:</label>
        <input type="text" bind:value={username} />

        <label for="password">Password:</label>
        <input type="password" bind:value={password} />

        <button type="submit">Login</button>
    </form>
</div>
