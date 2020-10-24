import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import { AddressInfo } from 'net';

import bots from './data/bots.json';
import congratPhrases from './data/phrases.json';
import users from './data/users.json';

const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || '');

slackEvents.on('message', async (event) => {
  const { subtype, bot_id, ts, text, channel } = event;

  if (subtype !== 'bot_message') {
    return;
  }

  if (bots.indexOf(bot_id) >= 0) {
    const subArray = text.split(' ');
    const idx = subArray.indexOf('pushed');

    if (idx < 0) {
      return;
    }

    const username = subArray.slice(0, idx).join(' ');
    const user = (<Record<string, string>>users)[username];

    if (!user) {
      return;
    }

    const randomIdx = Math.floor(Math.random() * congratPhrases.length);

    try {
      await web.chat.postMessage({
        channel,
        text: `<@${user}> ${congratPhrases[randomIdx]}`,
        link_names: true,
        thread_ts: ts,
      });
    } catch (error) {
      console.log(error);
    }
  }
});

slackEvents.on('error', (error: Error) => {
  console.log(error.name);
});

const port = parseInt(process.env.PORT || '3000');

(async () => {
  // Start the built-in server
  const server = await slackEvents.start(port);
  const address = server.address() as AddressInfo;

  // Log a message when the server is ready
  console.log(`Listening for events on ${address.port}`);
})();
