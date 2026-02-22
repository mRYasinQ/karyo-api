import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

import type { EnvConfig } from '@/shared/schemas/env.schema';

@Injectable()
class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.config.getOrThrow<EnvConfig['REDIS_URL']>('redis.url');
    this.client = new Redis(redisUrl);
  }

  get(key: string) {
    return this.client.get(key);
  }

  async getWithTtl(key: string) {
    const multi = this.client.multi();
    multi.get(key);
    multi.ttl(key);

    const [value, ttl] = await this.execAndExtract<[string | null, number]>(multi);

    return { value, ttl: ttl > 0 ? ttl : null };
  }

  set(key: string, data: string, ttl?: number) {
    if (ttl) return this.client.set(key, data, 'PX', ttl);

    return this.client.set(key, data);
  }

  delete(key: string) {
    return this.client.del(key);
  }

  private async execAndExtract<T>(multi: ReturnType<Redis['multi']>): Promise<T> {
    const results = await multi.exec();
    if (!results) throw new Error('Redis transaction failed');

    const extracted: unknown[] = [];

    for (const [error, result] of results) {
      if (error) throw error;
      extracted.push(result);
    }

    return extracted as T;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}

export default RedisService;
