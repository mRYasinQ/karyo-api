import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import RoleEntity from './role.entity';

@Module({
  imports: [MikroOrmModule.forFeature([RoleEntity])],
})
class RoleModule {}

export default RoleModule;
