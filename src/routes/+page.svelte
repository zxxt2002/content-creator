<script lang="ts">
	import type { CreateCompletionResponse } from 'openai'
	import { SSE } from 'sse.js'
	import Login from './login.svelte'; // Ensure the correct path
	import History from './history.svelte';
	import ContentView from './contentView.svelte';

	let context = ''
	let requirement = ''
	let writingExample = ''

	let loading = false
	let error = false
	let answer = ''
	let copyDisabled = true;

	let selectedContent = null;
    	let showLogin = false; // Add this to track if the login modal should be shown
	let showHistory = false;

	const generateContent = async (currentContext) => {

		const eventSource = new SSE('/api/explain', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ context: currentContext })
		});


		eventSource.addEventListener('error', (e) => {
			error = true
			loading = false
			alert('Something went wrong!')
		})

	        eventSource.addEventListener('message', (e) => {
	            try {
	                if (e.data === '[DONE]') {
	                    loading.set(false);
	                    copyDisabled.set(false);
	                    eventSource.close(); // Important to close the connection
	                    return;
	                }
	
	                const completionResponse = JSON.parse(e.data);
	                const [{ text }] = completionResponse.choices;
	                answer.update(n => n + text); // Concatenate each new part to the existing answer.
	
	                // Check if you need to continue generating content
	                if (shouldContinueGenerating(answer)) {
	                    // Update the context with the new content
	                    const newContext = updateContextWithNewContent(currentContext, text);
	                    // Recursively call the function to generate more content
	                    generateContent(newContext);
	                } else {
	                    // Content generation is complete
	                    loading.set(false);
	                    copyDisabled.set(false);
	                    eventSource.close(); // Important to close the connection
	                }
	            } catch (err) {
	                error.set(true);
	                loading.set(false);
	                console.error(err);
	                alert('Something went wrong!');
	                eventSource.close(); // Important to close the connection
	            }
	        });

		eventSource.stream()
	}
	const copyToClipboard = () => {
		const elem = document.createElement('textarea')
		elem.value = answer
		document.body.appendChild(elem)
		elem.select()
		document.execCommand('copy')
		document.body.removeChild(elem)
		alert('Copied to clipboard!')
 	}
	    const handleSubmit = () => {
	        loading.set(true);
	        error.set(false);
	        answer.set('');
	
	        // Define your initial context here
	        const initialContext = `Article Topic: ${$requirement}\n\nWriting Style Reference:\n${$writingExample}\n\nRequirement: The article should be as long as possible without repeating any words from the writing style reference above.`;
	
	        // Start the content generation process
	        generateContent(initialContext);
	}
</script>

<style>
    /* Add this style to your component */
    header h1 {
        background: linear-gradient(to right, blue, purple);
        -webkit-background-clip: text;
        color: transparent;
    }
    header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: white; /* To ensure text/content beneath doesn't show through */
        z-index: 10; /* Keep the header above all other content */
    }
    nav {
        display: flex;
        align-items: center; 
        justify-content: space-between;
    }
    button + button {
	margin-left: 10px;
    }
    .main-content {
        margin-top: 60px; /* Adjust as per your header's height */
    }
</style>

<header>
	<a href="https://touchpointdigitalmarketing.com/web-design/">
        	<span class = "title">touch point</span>
		<span class="subtitle">Digital Marketing Agency</span>
    	</a>
	<nav>
		<button on:click={() => showLogin = !showLogin}>Login</button>
		{#if showLogin}
		    <Login />
		{/if}

	        <button on:click={() => showHistory = true}>History</button>
	        {#if showHistory}
	            <History visible={showHistory} onClose={() => showHistory = false} />
	        {/if}
	</nav>
</header>

<div class="main-content">
	<h1>Welcome to Touch Point Digital Marketing Agency</h1>
	<h2>Unlocking Your Business' Potential by Maximizing the Power of the Internet.</h2>
	<form on:submit|preventDefault={() => handleSubmit()}>
		<label for="requirement">What is the article about?</label>
		<textarea name="requirement" rows="2" bind:value={requirement}></textarea>
	
		<label for="writingExample">Provide sample articles below so your writing style and tone can be replicated.</label>
		<textarea id="email-textarea" name="writingExample" rows="5" bind:value={writingExample}></textarea>
		<button>Write Article</button>
	</form>

	<div class="pt-4">
		<h2>Generated Article:</h2>
		{#if answer}
		<div>{@html answer}</div>
		{/if}
		{#if answer}
		  <button on:click|preventDefault={() => copyToClipboard()} disabled={copyDisabled}>Copy</button>
		{/if}
	</div>

	{#if selectedContent}
	    <ContentView content={selectedContent} on:closecontent={() => { selectedContent = null; showHistory = true; }} />
	{/if}
</div>

<footer>
	<!-- You can add footer content here -->
</footer>
