import bots from '../data/bots.json';
import congratPhrases from '../data/phrases.json';
import users from '../data/users.json';
import { WebClient } from '@slack/web-api';
import SlackEventAdapter from '@slack/events-api/dist/adapter';
import { getRandomIdx } from './utils';

export const congrat = (web: WebClient, slackEvents: SlackEventAdapter): void => {
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

      const username: string = subArray.slice(0, idx).join(' ');
      const user = (<Record<string, string>>users)[username.trim()];

      if (!user) {
        return;
      }

      const randomIdx = getRandomIdx(congratPhrases.length);

      try {
        await web.chat.postMessage({
          channel,
          text: `<@${user}> ${congratPhrases[randomIdx]}`,
          link_names: true,
          thread_ts: ts,
        });
      } catch (error) {
        console.log('congrat > congrat() > message', error);
      }
    }
  });

  slackEvents.on('error', (error: Error) => {
    console.log('congrat > congrat() > error', error.name);
  });
};
