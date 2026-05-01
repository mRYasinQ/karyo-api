import { z } from 'zod';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugSchema = z
  .string('شناسه کوتاه باید رشته باشد.')
  .trim()
  .toLowerCase()
  .min(2, 'شناسه کوتاه باید حداقل ۲ کاراکتر باشد.')
  .max(100, 'شناسه کوتاه می‌تواند حداکثر ۱۰۰ کاراکتر باشد.')
  .regex(SLUG_REGEX, 'شناسه کوتاه باید فقط شامل حروف کوچک، اعداد و خط تیره باشد.');

export default slugSchema;
