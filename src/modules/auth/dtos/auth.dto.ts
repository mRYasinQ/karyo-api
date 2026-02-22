import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { emailSchema, passwordSchema } from '@/shared/schemas/user.schema';

const otpSchema = z
  .string('کد تایید باید یک رشته باشد.')
  .min(5, 'کد تایید باید حداقل ۵ کارکتر باشد.')
  .max(5, 'کد تایید می‌تواند حداکثر ۵ کارکتر باشد.');

const baseAuthSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  password: passwordSchema,
});

const registerSchema = baseAuthSchema;
class RegisterDto extends createZodDto(registerSchema) {}
type Register = z.infer<typeof registerSchema>;

const sendOtpSchema = baseAuthSchema.pick({ email: true });
class SendOtpDto extends createZodDto(sendOtpSchema) {}
type SendOtp = z.infer<typeof sendOtpSchema>;

const verifyOtpSchema = baseAuthSchema.omit({ password: true });
class VerifyOtpDto extends createZodDto(verifyOtpSchema) {}
type VerifyOtp = z.infer<typeof verifyOtpSchema>;

export type { Register, SendOtp, VerifyOtp };
export { RegisterDto, SendOtpDto, VerifyOtpDto };
