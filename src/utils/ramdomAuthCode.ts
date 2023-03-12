import * as crypto from 'crypto';

export const ramdomAuthCode = (isNumber: number): string => {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ApCpChta';
  let result = '';
  const ramdom = crypto.randomBytes(isNumber);
  const n = 256 / characters.length;

  for (let i = 0; i < isNumber; i++) {
    result += characters.charAt(Math.floor(ramdom[i] / n));
  }
  return result;
};
