import { DividerBlock, HeaderBlock, SectionBlock, WebClient } from '@slack/web-api';

import { ActiveUser, SlackUser } from './types';
import { shuffle, parseDailyTime, victoryEmoji } from './utils';

const parseActiveUser = (member: SlackUser): ActiveUser => ({
  id: member.id as string,
  realName: member.real_name as string,
  displayName: member?.profile?.display_name as string,
  image: member?.profile?.image_192 as string,
  deleted: member.deleted as boolean,
  isBot: member.is_bot as boolean,
});

export const activeUsers = (users: SlackUser[]): ActiveUser[] => {
  if (!users) {
    return [];
  }

  return users
    .map((m: SlackUser) => parseActiveUser(m))
    .filter((member) => {
      if (!member.deleted && !member.isBot && member.id !== 'USLACKBOT') {
        return true;
      }
      return false;
    });
};

const renderBlock = (user: ActiveUser, position: number): SectionBlock => {
  const name = (() => {
    const { displayName, realName } = user;
    if (displayName) {
      return displayName;
    }
    return realName;
  })();

  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${victoryEmoji[position]} *<@${user.id}>*\n${place(position)}`,
    },
    accessory: {
      type: 'image',
      image_url: user.image,
      alt_text: name,
    },
  };
};

const divider: DividerBlock = { type: 'divider' };
const headerBlock: HeaderBlock = {
  type: 'header',
  text: {
    type: 'plain_text',
    text: "Today's daily order! :loudspeaker:",
  },
};

const place = (position: number) => {
  const star = ':star:';
  let p = star;

  for (let i = 5; i > position; i--) {
    p += star;
  }

  return p;
};

const buildBlocks = (users: ActiveUser[]): (SectionBlock | DividerBlock)[] => {
  const blocks: (SectionBlock | DividerBlock)[] = [];

  users.forEach((user, idx) => {
    const blockUser = renderBlock(user, idx);
    blocks.push(divider, blockUser);
  });

  return blocks;
};

const sendDailyOrder = async (web: WebClient, users: ActiveUser[]): Promise<void> => {
  const blocks = [headerBlock, ...buildBlocks(users)];
  try {
    await web.chat.postMessage({
      channel: process.env.DAILY_CHANNEL || '',
      text: ":loudspeaker: Today's daily order! :loudspeaker:",
      blocks,
      link_names: false,
    });
  } catch (error) {
    console.log('daily > sendDailyOrder()', error);
  }
};

export const getAllUsers = async (web: WebClient): Promise<SlackUser[] | undefined> => {
  try {
    const { members } = await web.users.list();

    return members as SlackUser[];
  } catch (error) {
    console.log('daily > getAllUsers()', error);
  }
};

const isDailyTime = (): boolean => {
  const date = new Date();
  const day = date.getDay();

  if (day === 0 || day == 6) {
    return false;
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const [dailyHours, dailyMinutes, dailySeconds] = parseDailyTime();

  if (hours === dailyHours && minutes === dailyMinutes && seconds === dailySeconds) {
    return true;
  }

  return false;
};

export const handleDaily = async (web: WebClient, users: ActiveUser[]): Promise<void> => {
  const shuffledUsers = shuffle(users);

  if (isDailyTime()) {
    await sendDailyOrder(web, shuffledUsers);
  }
};
