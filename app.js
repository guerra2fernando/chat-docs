const { App } = require('@slack/bolt');
const express = require('express');
const axios = require('axios');

const app = express();

const slackApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true, // Enable this for receiving events via WebSocket (useful for Vercel deployment)
});

slackApp.message(async({ message, say }) => {
    if (message.text) {
        try {
            const response = await axios.post('https://chat-with-your-docs-backend-3-spring-bush-7707.fly.dev/query', {
                query: message.text,
                collection_name: "superduperdb"
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const answer = response.data.answer;
            await say(answer);
        } catch (error) {
            console.error(error);
            await say("Sorry, I couldn't fetch the information.");
        }
    }
});

(async() => {
    await slackApp.start(process.env.PORT || 3000);
    console.log('Slack bot is running!');
})();

app.use('/slack/events', slackApp.requestListener());

module.exports = app;