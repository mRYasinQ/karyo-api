import { ConfigService } from '@nestjs/config';

import type { LoggerModuleAsyncParams } from 'nestjs-pino';
import type { TransportTargetOptions } from 'pino';

import type { EnvConfig } from '@/shared/schemas/env.schema';

const LoggerConifg: LoggerModuleAsyncParams = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const isProduction = config.getOrThrow<EnvConfig['NODE_ENV']>('node_env') === 'production';

    const targets: TransportTargetOptions[] = [];

    if (!isProduction) targets.push({ target: 'pino-pretty' });
    if (isProduction) {
      targets.push({
        target: 'pino/file',
        level: 'error',
        options: {
          destination: './logs/app.log',
          mkdir: true,
        },
      });
    }

    return {
      pinoHttp: {
        level: isProduction ? 'error' : 'trace',
        autoLogging: !isProduction,
        transport: { targets },
      },
    };
  },
};

export default LoggerConifg;
