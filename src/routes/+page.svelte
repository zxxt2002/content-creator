<script lang="ts">
    import type { CreateCompletionResponse } from 'openai';
    import { SSE } from 'sse.js';

    let requirement = '';
    let writingExample = '';
    let answer = '';
    let context = '';
    let loading = false;
    let error = false;
    let copyDisabled = true;

    const handleSubmit = async () => {
        loading = true;
        error = false;
        answer = '';
        context = "Write longest article about: " + requirement + 
        " Write it in my writing style and tone but do not reiterate words from the text below because it is completely unrelated, only use it as a reference: "  
        + writingExample + " requirement of length of this article: longer the better";

        const eventSource = new SSE('/api/explain', {
            headers: {
                'Content-Type': 'application/json'
            },
            payload: JSON.stringify({ context })
        });

        eventSource.addEventListener('error', (e) => {
            error = true;
            loading = false;
            alert('Something went wrong!');
        });

        eventSource.addEventListener('message', (e) => {
            try {
                loading = false;

                if (e.data === '[DONE]') {
                    copyDisabled = false;
                    return;
                }

                const completionResponse: CreateCompletionResponse = JSON.parse(e.data);
                const [{ text }] = completionResponse.choices;
                answer = (answer ?? '') + text;
            } catch (err) {
                error = true;
                loading = false;
                console.error(err);
                alert('Something went wrong!');
            }
        });

        eventSource.stream();
    }

    const copyToClipboard = () => {
        const elem = document.createElement('textarea');
        elem.value = answer;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand('copy');
        document.body.removeChild(elem);
        alert('Copied to clipboard!');
    }
</script>

<h1>Content Creator</h1>

<form on:submit|preventDefault={handleSubmit}>
    <label for="requirement">What is the article about?</label>
    <textarea id="requirement" rows="2" bind:value={requirement}></textarea>

    <label for="writingExample">Provide sample articles below so your writing style and tone can be replicated.</label>
    <textarea id="writingExample" rows="5" bind:value={writingExample}></textarea>

    <!-- Uncomment the below line if you want to add the "Load Erick's Style" feature -->
    <!-- <button id="load-button" type="button">Load Erick's Style</button> -->

    <button type="submit">Write Article</button>

    <div class="pt-4">
        <h2>Generated Article:</h2>
        {#if answer}
        <div>{@html answer}</div>
        {/if}

        {#if answer}
        <button on:click|preventDefault={copyToClipboard} disabled={copyDisabled}>Copy</button>
        {/if}
    </div>
</form>
