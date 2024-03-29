<script lang="ts">
	import type { CreateCompletionResponse } from 'openai'
    	import { onMount } from 'svelte';
	import { SSE } from 'sse.js'
	import Login from './login.svelte'; // Ensure the correct path
	import History from './history.svelte';
	import ContentView from './contentView.svelte';

	//let context = ''
	let requirement = ''
	let writingExample = ''

	let loading = false
	let error = false
	let answer = ''
	let copyDisabled = true;
	let tokenUsage = 0;
	let requestCount = 0;

	let selectedContent = null;
    	let showLogin = false; // Add this to track if the login modal should be shown
	let showHistory = false;
	    
	onMount(() => {
		// Initialize or fetch the values for requirement and writingExample here
	        requirement = '';
	        writingExample = '';
	});

	const updateContextWithNewContent = (currentContext, newText) => {
	    // Define the logic for updating the context with the new content
	    // For example, you might append the new text to the existing context
	    return `${currentContext}\n${newText}`;
	};

	const generateContent = async (currentContext, iteration = 0) => {
		loading = true;
		error = false;
		if (iteration === 0) {
	            answer = ''; // Reset answer only when starting the first iteration
	        }
		//const maxTokensPerRequest = 5000; // Adjust this value as needed
		//const maxContextLength = 10000;
		// if (currentContext.length > maxContextLength - maxTokensPerRequest) {
		//         const startIndex = currentContext.length - (maxContextLength - maxTokensPerRequest);
		//         currentContext = currentContext.substring(startIndex);
		//     }
		const prompt = `Write article with Topic: ${requirement}\n\nWriting Style Reference:\n${writingExample}\n\nNote: Do not repeat the previous generated content;\n\nGenerate new content:`;
		const eventSource = new SSE('/api/explain', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ 
				context: prompt,
			})
		});


		eventSource.addEventListener('error', (e) => {
			error = true
			loading = false
			console.error('EventSource error:', e);
    			alert('Something went wrong! Check the console for more details.');
			eventSource.close();
		});

	        eventSource.addEventListener('message', (e) => {
	            try {
	                if (e.data === '[DONE]') {
	                    iteration++;
	                    if (iteration < 12) {
	                        // Continue with next iteration
	                        const newContext = updateContextWithNewContent(currentContext, answer);
	                        generateContent(newContext, iteration);
	                    } else {
	                        // Final iteration completed
	                        loading = false;
	                        copyDisabled = false;
	                    }
	                    eventSource.close();
	                    return;
	                }
	
	                const completionResponse = JSON.parse(e.data);
	                const [{ text, usage }] = completionResponse.choices;
	                answer += text; // Append each new part to the existing answer.
	            } catch (err) {
	                error = true;
	                loading = false;
	                console.error('Error:', err.message);
	                alert('Something went wrong!' + err.message);
	                eventSource.close();
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
	        loading = true;
	        error = false;
	
	        // Define your initial context here
	        const initialContext = `Article Topic: ${requirement}\n\nWriting Style Reference:\n${writingExample}\n\nRequirement: The article should be as long as possible without repeating any words from the writing style reference above.`;
	
	        // Start the content generation process
	        generateContent(initialContext, 0);
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
    .generated-content {
        margin-top: 20px; /* Space from the form */
    }

    .generated-content textarea {
        width: 100%; /* Full-width textarea */
        height: 150px; /* Adjust the height as needed */
    }
    .generated-content {
        margin-top: 20px; /* Space from the form */
    }

    .generated-content textarea {
        width: 100%; /* Full-width textarea */
        height: 150px; /* Adjust the height as needed */
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
	    
	<div class="generated-content">
        <h2>Generated Article:</h2>
        <textarea readonly bind:value={answer}></textarea>
        {#if answer}
          <button on:click|preventDefault={() => copyToClipboard()}>Copy to Clipboard</button>
        {/if}
    	</div>

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
