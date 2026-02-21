import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';

dotenv.config();

const mikroOrmConfig = defineConfig({
  driver: PostgreSqlDriver,

  migrations: {
    tableName: 'migrations',
  },

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  entities: ['./dist/modules/**/**/*.entity.js'],
  entitiesTs: ['./src/modules/**/**/*.entity.ts'],
});

export default mikroOrmConfig;
