import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import RoleController from './role.controller';
import RoleEntity from './role.entity';
import RoleService from './role.service';

@Module({
  imports: [MikroOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
class RoleModule {}

export default RoleModule;
