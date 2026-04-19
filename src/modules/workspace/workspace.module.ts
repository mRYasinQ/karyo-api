import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import StorageModule from '../storage/storage.module';
import WorkspaceMemberEntity from './entities/member.entity';
import WorkspaceEntity from './entities/workspace.entity';
import WorkspaceController from './workspace.controller';
import WorkspaceService from './workspace.service';

@Module({
  imports: [MikroOrmModule.forFeature([WorkspaceEntity, WorkspaceMemberEntity]), StorageModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
class WorkspaceModule {}

export default WorkspaceModule;
