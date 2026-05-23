import envSchema from '@/shared/schemas/env.schema';

const AppConfig = () => {
  const env = envSchema.parse(process.env);

  return {
    node_env: env.NODE_ENV,
    app: {
      url: env.APP_URL,
      port: env.APP_PORT,
      storage_url: env.STORAGE_URL,
      cors_origins: env.CORS_ORIGINS,
      enable_swagger: env.ENABLE_SWAGGER,
      default_role: env.DEFAULT_ROLE,
    },
    redis: {
      url: env.REDIS_URL,
      password: env.REDIS_PASSWORD,
    },
    database: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      name: env.DB_NAME,
    },
    mail: {
      secure: env.MAIL_SECURE,
      from: env.MAIL_FROM,
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      username: env.MAIL_USER,
      password: env.MAIL_PASSWORD,
    },
    minio: {
      url: env.MINIO_URL,
      bucket: env.MINIO_BUCKET,
      username: env.MINIO_USER,
      password: env.MINIO_PASSWORD,
    },
    time: {
      otp: {
        expire: env.OTP_EXPIRE,
        cache: env.OTP_CACHE,
      },
      session: {
        expire: env.SESSION_EXPIRE,
      },
    },
    throttle: {
      ttl: env.THROTTLE_TTL,
      limit: env.THROTTLE_LIMIT,
    },
  };
};

export default AppConfig;
