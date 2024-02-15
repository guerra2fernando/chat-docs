const { App } = require('@slack/bolt');
const axios = require('axios');

// Initialize Slack App with environment variables
const slackApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    // Socket mode not needed for Vercel deployment
});

module.exports = async(req, res) => {
    try {
        // Your existing Slack event handling logic
        const { body } = req;
        const slackEvent = body.event;

        // Example: Call external API if a message event is received
        if (slackEvent && slackEvent.type === 'message') {
            const response = await axios.post('https://chat-with-your-docs-backend-3-spring-bush-7707.fly.dev/query', {
                query: slackEvent.text,
                collection_name: "superduperdb"
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const answer = response.data.answer;
            // Respond back to Slack (this would need to be adapted to use Slack's APIs or SDKs)
            res.status(200).send(answer);
        } else {
            res.status(200).send('Event type not supported');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};