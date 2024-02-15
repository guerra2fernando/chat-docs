const axios = require('axios');
const { App } = require('@slack/bolt');

// Load environment variables
const signingSecret = process.env['SLACK_SIGNING_SECRET'];
const botToken = process.env['SLACK_BOT_TOKEN'];

// Initialize your Slack app with your bot token and signing secret
const app = new App({
    token: botToken,
    signingSecret: signingSecret,
});

// Listen for direct messages to the bot
app.message('message.im', async({ message, say }) => {
    await processMessage(message, say);
});

// Register a slash command (e.g., "/superduperdb") and handle it
app.command('/superduperdb', async({ command, ack, say }) => {
    // Acknowledge the command request
    await ack();

    if (command.text) {
        await processMessage({ text: command.text }, say);
    }
});

async function processMessage(message, say) {
    // Check if the message contains text
    if (message.text) {
        try {
            // Post the message text to the external API
            const response = await axios.post('https://chat-with-your-docs-backend-3-spring-bush-7707.fly.dev/query', {
                query: message.text,
                collection_name: "superduperdb"
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Extract the answer and source URLs from the API response
            const { answer, source_urls } = response.data;

            // Format the answer and optionally the source URLs to send back
            let replyText = answer;
            if (source_urls && source_urls.length > 0) {
                replyText += "\nSources:";
                source_urls.forEach(url => {
                    replyText += `\n- <${url}|Click here>`;
                });
            }

            // Use the `say` method to send the formatted answer back
            await say(replyText);
        } catch (error) {
            // Log the error and send a friendly error message
            console.error(error);
            await say("Sorry, I couldn't fetch the information.");
        }
    }
}

// Start your app
(async() => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
})();