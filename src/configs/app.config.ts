import envSchema from '@/shared/schemas/env.schema';

const AppConfig = () => {
  const env = envSchema.parse(process.env);

  return {
    node_env: env.NODE_ENV,
    app: {
      port: env.APP_PORT,
    },
  };
};

export default AppConfig;
