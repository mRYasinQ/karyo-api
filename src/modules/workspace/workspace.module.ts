import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import WorkspaceMemberEntity from './entities/member.entity';
import WorkspaceEntity from './entities/workspace.entity';
import WorkSpaceController from './workspace.controller';

@Module({
  imports: [MikroOrmModule.forFeature([WorkspaceEntity, WorkspaceMemberEntity])],
  controllers: [WorkSpaceController],
})
class WorkSpaceModule {}

export default WorkSpaceModule;
