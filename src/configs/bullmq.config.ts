import type { SharedBullAsyncConfiguration } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

import type { QueueOptions } from 'bullmq';
import Redis from 'ioredis';

import type { EnvConfig } from '@/shared/schemas/env.schema';

const BullMQConfig: SharedBullAsyncConfiguration = {
  inject: [ConfigService],
  useFactory: (config: ConfigService): QueueOptions => ({
    connection: new Redis(config.getOrThrow<EnvConfig['REDIS_URL']>('redis.url'), { maxRetriesPerRequest: null }),

    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  }),
};

export default BullMQConfig;
