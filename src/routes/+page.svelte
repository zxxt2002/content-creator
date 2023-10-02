<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Creator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        h1 {
            text-align: center;
            margin-top: 20px;
        }

        form {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        label {
            font-weight: bold;
        }

        textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .pt-4 {
            margin-top: 20px;
        }

        h2 {
            font-size: 24px;
        }

        #generated-article {
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 4px;
            background-color: #fff;
        }
    </style>
</head>
<body>
    <h1>Content Creator</h1>
    <form on:submit|preventDefault={() => handleSubmit()}>

        <label for="requirement">What is the article about?</label>
        <textarea name="requirement" rows="2" bind:value={requirement}></textarea>

        <label for="writingExample">Provide sample articles below so your writing style and tone can be replicated.</label>
        <textarea id="email-textarea" name="writingExample" rows="5" bind:value={writingExample}></textarea>

        <button>Write Article</button>
        <div class="pt-4">
            <h2>Generated Article:</h2>
            {#if answer}
            <div id="generated-article">
                {@html answer}
            </div>
            {/if}

            {#if answer}
            <button on:click|preventDefault={() => copyToClipboard()} disabled={copyDisabled}>Copy</button>
            {/if}
        </div>
    </form>
</body>
</html>
