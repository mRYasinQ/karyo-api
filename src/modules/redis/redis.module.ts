import { Module } from '@nestjs/common';

import RedisService from './providers/redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
class RedisModule {}

export default RedisModule;
