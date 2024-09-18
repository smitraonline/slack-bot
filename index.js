const { App } = require('@slack/bolt');
const axios = require('axios')

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});

//http://169.53.229.26:8000/docs

// curl - X 'POST' \
// 'http://169.53.229.26:8000/tasks/task/usecase-classification-plugin' \
// -H 'accept: application/json' \
// -H 'Content-Type: application/json' \
// -d '{
// "input": "I need access to Saviynt"
// }'

var generic = [];
generic.push({ text: 'Following are request details, ', response_type: 'text' })

const processMessage = async (message) => {
    //call skillet
    data = { "input": message }
    config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    response = await axios.post("http://169.53.229.26:8000/tasks/task/usecase-classification-plugin", data, config)
    console.log("--response--")
    console.log(response)
    return response
}


/* Add functionality here */
app.event('app_home_opened', ({ event, say }) => {
    say(`Hello world, <@${event.user}>!`);
});
// Reverse all messages the app can hear
app.message(async ({ message, say }) => {
    // Filter out message events with subtypes (see https://api.slack.com/events/message)
    if (message.subtype === undefined || message.subtype === 'bot_message') {
        //const reversedText = [...message.text].reverse().join("_");
        console.log(message)
        response = await processMessage(message.text)
        await say({ text: response.data.output });
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