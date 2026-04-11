import ms, { type StringValue } from 'ms';
import { z } from 'zod';

const portSchema = z.coerce.number().int().min(1).max(65535);
const requiredStringSchema = z.string().trim().min(1);
const msFormatSchema = (defaultTime: StringValue) =>
  z
    .string()
    .default(defaultTime)
    .transform((val) => {
      const milliseconds = ms(val as StringValue);
      if (!milliseconds) throw new Error('Invalid time format');
      return milliseconds;
    });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  APP_URL: z.url().default('http://localhost:3000'),
  APP_PORT: portSchema.default(3000),
  STORAGE_URL: z.url(),

  REDIS_URL: z.url(),
  REDIS_PASSWORD: requiredStringSchema,

  DB_HOST: requiredStringSchema,
  DB_PORT: portSchema,
  DB_USER: requiredStringSchema,
  DB_PASSWORD: requiredStringSchema,
  DB_NAME: requiredStringSchema,

  MAIL_SECURE: z.enum(['0', '1']).transform((v) => v === '1'),
  MAIL_FROM: requiredStringSchema,
  MAIL_HOST: requiredStringSchema,
  MAIL_PORT: portSchema,
  MAIL_USER: requiredStringSchema,
  MAIL_PASSWORD: requiredStringSchema,

  MINIO_HOST: requiredStringSchema,
  MINIO_BUCKET: requiredStringSchema,
  MINIO_USER: requiredStringSchema,
  MINIO_PASSWORD: requiredStringSchema,

  OTP_EXPIRE: msFormatSchema('3m'),
  OTP_CACHE: msFormatSchema('1d'),
  SESSION_EXPIRE: msFormatSchema('15d'),
});

type EnvConfig = z.infer<typeof envSchema>;

export type { EnvConfig };
export default envSchema;
