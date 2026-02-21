import { createHash, randomBytes, randomInt } from 'node:crypto';

const md5 = (data: unknown) => createHash('md5').update(String(data)).digest('hex');

const generateOtp = (length: number = 5): number => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

  return randomInt(min, max);
};

const generateRandomBytes = (size: number = 32, encoding: BufferEncoding = 'base64url') => {
  const buffer = randomBytes(size);
  const text = buffer.toString(encoding);

  return text;
};

const generateRandomString = (stringLength: number = 7) => {
  let result = '';

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < stringLength; i++) result += characters[randomInt(0, characters.length)];

  return result;
};

export { md5, generateOtp, generateRandomBytes, generateRandomString };
