import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import { AddressInfo } from 'net';

import { congrat } from './congrat';
import { handleDaily, getAllUsers, activeUsers } from './daily';
import { SlackUser } from './types';

import combos from '../data/combos.json';

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || '');
const web = new WebClient(process.env.SLACK_BOT_TOKEN);

const port = parseInt(process.env.PORT || '3071');

(async () => {
  // Start the built-in server
  const server = await slackEvents.start(port);
  const address = server.address() as AddressInfo;

  if (process.env.CONGRATS) {
    congrat(web, slackEvents);
  }

  if (process.env.REMIND_ME_DAILY) {
    const users = await getAllUsers(web);
    let currentCombos: string[][] | undefined;

    if (process.env.COMBOS) {
      currentCombos = combos.slice();
    }

    setInterval(async () => {
      const idx = await handleDaily(web, activeUsers(users as SlackUser[]), currentCombos);

      if (idx && currentCombos) {
        // remove used combinaison from combos list
        currentCombos.splice(idx, 1);

        // if all combinaison were used, reset
        if (currentCombos.length === 0) {
          currentCombos = combos.slice();
        }
      }
    }, 1000);
  }

  // Log a message when the server is ready
  console.log(`Listening for events on ${address.port}`);
})();
