import { ConfigService } from '@nestjs/config';
import type { ThrottlerAsyncOptions } from '@nestjs/throttler';

import CommonMessage from '@/shared/constants/common-message';
import type { EnvConfig } from '@/shared/schemas/env.schema';
import formatMessage from '@/shared/utils/format-message';

const ThrottleConfig: ThrottlerAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    throttlers: [
      {
        ttl: config.getOrThrow<EnvConfig['THROTTLE_TTL']>('throttle.ttl'),
        limit: config.getOrThrow<EnvConfig['THROTTLE_LIMIT']>('throttle.limit'),
      },
    ],
    errorMessage: (_ctx, throttlerLimitDetail) => {
      return formatMessage(CommonMessage.TOO_MANY_REQUESTS, { time: throttlerLimitDetail.timeToExpire });
    },
  }),
};

export default ThrottleConfig;
