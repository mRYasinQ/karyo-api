import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';

import AppConfig from '@/configs/app.config';
import BullMQConfig from '@/configs/bullmq.config';
import DbConfig from '@/configs/db.config';
import LoggerConifg from '@/configs/logger.config';

import CommandModule from './command/command.module';
import CommonModule from './common/common.module';
import RoleModule from './role/role.module';
import UserModule from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }),
    LoggerModule.forRootAsync(LoggerConifg),
    MikroOrmModule.forRootAsync(DbConfig),
    BullModule.forRootAsync(BullMQConfig),
    CommonModule,
    UserModule,
    RoleModule,
    CommandModule,
  ],
})
class CliModule {}

export default CliModule;
