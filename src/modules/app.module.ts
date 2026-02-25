import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';
import { ZodValidationPipe } from 'nestjs-zod';

import AppConfig from '@/configs/app.config';
import DbConfig from '@/configs/db.config';
import LoggerConifg from '@/configs/logger.config';

import AppExceptionFilter from '@/shared/filters/app-exception.filter';
import TransformResponse from '@/shared/interceptors/transform-response.interceptor';

import AuthModule from './auth/auth.module';
import CommonModule from './common/common.module';
import RedisModule from './redis/redis.module';
import SessionModule from './session/session.module';
import StorageModule from './storage/storage.module';
import UserModule from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }),
    MikroOrmModule.forRootAsync(DbConfig),
    LoggerModule.forRootAsync(LoggerConifg),
    CommonModule,
    RedisModule,
    StorageModule,
    UserModule,
    SessionModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponse,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
class AppModule {}

export default AppModule;
