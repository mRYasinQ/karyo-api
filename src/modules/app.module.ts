import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import AppConfig from '@/configs/app.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] })],
})
class AppModule {}

export default AppModule;
