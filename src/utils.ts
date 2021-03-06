export const parseDailyTime = (): number[] => {
  const dailyTime = process.env.DAILY_TIME || '09:43:00';

  const spiltedDailyTime = dailyTime.split(':');
  return spiltedDailyTime.map((time) => (~~time[0] === 0 ? ~~time[1] : ~~time));
};

export const shuffle = <T>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

export const getRandomIdx = (size: number): number => Math.floor(Math.random() * size);

export const victoryEmoji: Record<number, string> = {
  0: ':trophy:',
  1: ':second_place_medal:',
  2: ':third_place_medal:',
  3: ':bouquet:',
  4: ':raised_hand_with_fingers_splayed:',
  5: ':tada:',
};
