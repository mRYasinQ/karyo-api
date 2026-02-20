import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import AppConfig from '@/configs/app.config';
import DbConfig from '@/configs/db.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }), MikroOrmModule.forRootAsync(DbConfig)],
})
class AppModule {}

export default AppModule;
