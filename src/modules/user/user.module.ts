import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import UserEntity from './user.entity';
import UserService from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  exports: [UserService],
})
class UserModule {}

export default UserModule;
