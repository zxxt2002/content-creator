<script>
    let userHistory = [];
    // Fetch user history from your backend and populate the userHistory array
</script>

<h2>Your History</h2>
<ul>
    {#each userHistory as historyItem}
        <li>{historyItem}</li>
    {/each}
</ul>
