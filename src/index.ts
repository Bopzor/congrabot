import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import { AddressInfo } from 'net';

import { congrat } from './congrat';
import { handleDaily, getAllUsers, activeUsers } from './daily';
import { SlackUser } from './types';

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET || '');
const web = new WebClient(process.env.SLACK_BOT_TOKEN);

const port = parseInt(process.env.PORT || '3000');

(async () => {
  // Start the built-in server
  const server = await slackEvents.start(port);
  const address = server.address() as AddressInfo;

  congrat(web, slackEvents);

  if (process.env.REMIND_ME_DAILY) {
    const users = await getAllUsers(web);

    setInterval(() => {
      handleDaily(web, activeUsers(users as SlackUser[]));
    }, 1000);
  }

  // Log a message when the server is ready
  console.log(`Listening for events on ${address.port}`);
})();
