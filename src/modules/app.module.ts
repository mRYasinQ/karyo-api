import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';
import { ZodValidationPipe } from 'nestjs-zod';

import AppConfig from '@/configs/app.config';
import BullMQConfig from '@/configs/bullmq.config';
import DbConfig from '@/configs/db.config';
import LoggerConifg from '@/configs/logger.config';
import MailConfig from '@/configs/mail.config';

import { MailerModule } from '@nestjs-modules/mailer';

import AppExceptionFilter from '@/shared/filters/app-exception.filter';
import TransformResponse from '@/shared/interceptors/transform-response.interceptor';

import AuthModule from './auth/auth.module';
import CommonModule from './common/common.module';
import ProfileModule from './profile/profile.module';
import ProjectModule from './project/project.module';
import RedisModule from './redis/redis.module';
import RoleModule from './role/role.module';
import SessionModule from './session/session.module';
import StorageModule from './storage/storage.module';
import UserModule from './user/user.module';
import WorkspaceModule from './workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }),
    LoggerModule.forRootAsync(LoggerConifg),
    MikroOrmModule.forRootAsync(DbConfig),
    BullModule.forRootAsync(BullMQConfig),
    MailerModule.forRootAsync(MailConfig),
    CommonModule,
    RedisModule,
    StorageModule,
    UserModule,
    AuthModule,
    ProfileModule,
    SessionModule,
    RoleModule,
    WorkspaceModule,
    ProjectModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponse,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
class AppModule {}

export default AppModule;
