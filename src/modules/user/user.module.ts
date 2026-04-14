import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import RoleModule from '../role/role.module';
import StorageModule from '../storage/storage.module';
import UserEntity from './user.entity';
import UserService from './user.service';
import UserAdminController from './user-admin.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), StorageModule, RoleModule],
  controllers: [UserAdminController],
  providers: [UserService],
  exports: [UserService],
})
class UserModule {}

export default UserModule;
