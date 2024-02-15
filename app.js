require('dotenv').config();

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

// Listen for messages in channels the bot is a member of
app.message(async({ message, say }) => {
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

            // Extract the answer from the API response
            const answer = response.data.answer;

            // Use the `say` method to send the answer back to the same channel
            await say(answer);
        } catch (error) {
            // Log the error and send a friendly error message to the channel
            console.error(error);
            await say("Sorry, I couldn't fetch the information.");
        }
    }
});

// Start your app
(async() => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
})();