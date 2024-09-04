const { App } = require('@slack/bolt');

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});

/* Add functionality here */
app.event('app_home_opened', ({ event, say }) => {
    say(`Hello world, <@${event.user}>!`);
});
// Reverse all messages the app can hear
app.message(async ({ message, say }) => {
    // Filter out message events with subtypes (see https://api.slack.com/events/message)
    if (message.subtype === undefined || message.subtype === 'bot_message') {
        const reversedText = [...message.text].reverse().join("");
        await say(reversedText);
    }
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // Filter out message events with subtypes (see https://api.slack.com/events/message)
    if (message.subtype === undefined || message.subtype === 'bot_message') {
        // say() sends a message to the channel where the event was triggered
        await say({
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Hey there <@${message.user}>!`,
                    },
                    accessory: {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Click Me',
                        },
                        action_id: 'button_click',
                    },
                },
            ],
            text: `Hey there <@${message.user}>!`,
        });
    }
});

(async () => {
    // Start the app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();