import { ConfigService } from '@nestjs/config';

import type { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import type { EnvConfig } from '@/shared/schemas/env.schema';

const DbConfig: MikroOrmModuleAsyncOptions = {
  inject: [ConfigService],
  driver: PostgreSqlDriver,
  useFactory: (config: ConfigService) => ({
    driver: PostgreSqlDriver,
    debug: config.get<EnvConfig['NODE_ENV']>('node_env') === 'development',

    discovery: {
      warnWhenNoEntities: false,
    },

    autoLoadEntities: true,

    host: config.get<EnvConfig['DB_HOST']>('database.host'),
    port: config.get<EnvConfig['DB_PORT']>('database.port'),
    dbName: config.get<EnvConfig['DB_NAME']>('database.name'),
    user: config.get<EnvConfig['DB_USER']>('database.username'),
    password: config.get<EnvConfig['DB_PASSWORD']>('database.password'),
  }),
};

export default DbConfig;
