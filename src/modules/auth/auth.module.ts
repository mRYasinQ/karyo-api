import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import MailModule from '../mail/mail.module';
import RedisModule from '../redis/redis.module';
import SessionModule from '../session/session.module';
import UserModule from '../user/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import AuthGuard from './guards/auth.guard';

@Module({
  imports: [RedisModule, UserModule, SessionModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
class AuthModule {}

export default AuthModule;
