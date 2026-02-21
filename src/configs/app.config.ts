import envSchema from '@/shared/schemas/env.schema';

const AppConfig = () => {
  const env = envSchema.parse(process.env);

  return {
    node_env: env.NODE_ENV,
    app: {
      url: env.APP_URL,
      port: env.APP_PORT,
      storage_url: env.STORAGE_URL,
    },
    redis: {
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
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      username: env.MAIL_USER,
      password: env.MAIL_PASSWORD,
    },
    minio: {
      host: env.MINIO_HOST,
      bucket: env.MINIO_BUCKET,
      username: env.MINIO_USER,
      password: env.MINIO_PASSWORD,
    },
    time: {
      otp: {
        expire: env.OTP_EXPIRE,
        cache: env.OTP_CACHE,
      },
    },
  };
};

export default AppConfig;
