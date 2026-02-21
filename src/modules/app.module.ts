import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import AppConfig from '@/configs/app.config';
import DbConfig from '@/configs/db.config';

import StorageModule from './storage/storage.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }), MikroOrmModule.forRootAsync(DbConfig), StorageModule],
})
class AppModule {}

export default AppModule;
