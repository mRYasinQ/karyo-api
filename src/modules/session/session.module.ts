import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import SessionController from './session.controller';
import SessionEntity from './session.entity';
import SessionService from './session.service';

@Module({
  imports: [MikroOrmModule.forFeature([SessionEntity])],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
class SessionModule {}

export default SessionModule;
