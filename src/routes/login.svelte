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
