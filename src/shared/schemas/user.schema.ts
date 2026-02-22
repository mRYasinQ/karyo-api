import { z } from 'zod';

const USERNAME_REGEX = /^[a-z][a-z0-9\_]{3,25}$/;

const usernameSchema = z.string('نام کاربری باید رشته باشد.').trim().toLowerCase().regex(USERNAME_REGEX, 'نام کاربری معتبر نمی‌باشد.');
const emailSchema = z.email('ایمیل معتبر نمی‌باشد.').toLowerCase();
const passwordSchema = z
  .string('گذرواژه باید رشته باشد.')
  .min(8, 'گذرواژه باید حداقل ۸ کارکتر باشد.')
  .max(32, 'گذرواژه می‌تواند حداکثر ۳۲ کاراکتر باشد.');

export { usernameSchema, emailSchema, passwordSchema };
