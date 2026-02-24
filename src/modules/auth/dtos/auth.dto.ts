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

const loginSchema = baseAuthSchema.omit({ otp: true });
class LoginDto extends createZodDto(loginSchema) {}
type Login = z.infer<typeof loginSchema>;

const registerSchema = baseAuthSchema;
class RegisterDto extends createZodDto(registerSchema) {}
type Register = z.infer<typeof registerSchema>;

const recoverSchema = baseAuthSchema;
class RecoverDto extends createZodDto(recoverSchema) {}
type Recover = z.infer<typeof recoverSchema>;

const sendOtpSchema = baseAuthSchema.pick({ email: true });
class SendOtpDto extends createZodDto(sendOtpSchema) {}
type SendOtp = z.infer<typeof sendOtpSchema>;

const verifyOtpSchema = baseAuthSchema.omit({ password: true });
class VerifyOtpDto extends createZodDto(verifyOtpSchema) {}
type VerifyOtp = z.infer<typeof verifyOtpSchema>;

export type { Login, Register, Recover, SendOtp, VerifyOtp };
export { LoginDto, RegisterDto, RecoverDto, SendOtpDto, VerifyOtpDto };
