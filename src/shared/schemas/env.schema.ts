import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  APP_PORT: z.coerce.number().default(3000),
});

type EnvConfig = z.infer<typeof envSchema>;

export type { EnvConfig };
export default envSchema;
