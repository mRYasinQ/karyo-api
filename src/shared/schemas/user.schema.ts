import { z } from 'zod';

import booleanStringSchema from './boolean-string.schema';
import fileSchema from './file.schema';

const USERNAME_REGEX = /^[a-z][a-z0-9\_]{3,25}$/;

const usernameSchema = z.string('نام کاربری باید رشته باشد.').trim().toLowerCase().regex(USERNAME_REGEX, 'نام کاربری معتبر نمی‌باشد.');
const emailSchema = z.email('ایمیل معتبر نمی‌باشد.').toLowerCase();
const passwordSchema = z
  .string('گذرواژه باید رشته باشد.')
  .min(8, 'گذرواژه باید حداقل ۸ کارکتر باشد.')
  .max(32, 'گذرواژه می‌تواند حداکثر ۳۲ کاراکتر باشد.');

const baseUserSchema = z.object({
  first_name: z
    .string('نام باید رشته باشد.')
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد.')
    .max(30, 'نام می‌تواند حداکثر ۳۰ کاراکتر باشد.')
    .nullable()
    .optional(),
  last_name: z
    .string('نام خانوادگی باید رشته باشد.')
    .min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد.')
    .max(30, 'نام خانوادگی می‌تواند حداکثر ۳۰ کاراکتر باشد.')
    .nullable()
    .optional(),
  email: emailSchema,
  username: usernameSchema.optional(),
  password: passwordSchema,
  is_active: booleanStringSchema('مقدار وارد شده برای فعال بودن کاربر باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
  is_email_verified: booleanStringSchema('مقدار وارد شده برای تأیید ایمیل باید یک مقدار صحیح یا غلط ( بولین ) باشد.').optional(),
  role_id: z.coerce.number('مقدار وارد شده برای شناسه نقش باید یک مقدار عددی باشد.').nullable().optional(),
  birthday: z.iso.date('مقدار وارد شده برای تاریخ تولد باید یک تاریخ معتبر باشد.').nullable().optional(),
  avatar: fileSchema.nullable().optional(),
});

export { usernameSchema, emailSchema, passwordSchema };
export default baseUserSchema;
