import { SlackUser } from '../types';

import fetch from 'node-fetch';
import { WebClient } from '@slack/web-api';

import { shuffle, parseDailyTime } from './utils';

type ActiveUser = {
  id: string;
  realName: string;
  displayName: string;
  image: string;
  deleted: boolean;
  isBot: boolean;
};

const parseActiveUser = (member: SlackUser): ActiveUser => ({
  id: member.id as string,
  realName: member.real_name as string,
  displayName: member?.profile?.display_name as string,
  image: member?.profile?.image_48 as string,
  deleted: member.deleted as boolean,
  isBot: member.is_bot as boolean,
});

export const activeUsers = (users: SlackUser[]): ActiveUser[] =>
  users
    .map((m: SlackUser) => parseActiveUser(m))
    .filter((member) => {
      if (!member.deleted && !member.isBot && member.id !== 'USLACKBOT') {
        return true;
      }
      return false;
    });

const sendDailyOrder = async (web: WebClient, users: ActiveUser[]): Promise<void> => {
  const text = users
    .map((user) => {
      const { displayName, realName } = user;
      if (displayName) {
        return displayName;
      }
      return realName;
    })
    .join(', ');

  try {
    await web.chat.postMessage({
      channel: process.env.DAILY_CHANNEL || '',
      text,
      link_names: true,
    });
  } catch (error) {
    console.log('daily > sendDailyOrder()', error);
  }
};

export const getAllUsers = async (): Promise<SlackUser[] | undefined> => {
  try {
    const request = {
      method: 'GET',
      url: 'https://slack.com/api/users.list',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
    };

    const response = await fetch(request.url, { method: request.method, headers: request.headers });
    const body = await response.json();

    return body.members;
  } catch (error) {
    console.log('daily > getAllUsers()', error);
  }
};

const isDailyTime = (): boolean => {
  const date = new Date();
  const day = date.getDay();

  if (day < 2) {
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
