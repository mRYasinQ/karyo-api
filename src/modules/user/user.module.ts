import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import UserEntity from './user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
})
class UserModule {}

export default UserModule;
