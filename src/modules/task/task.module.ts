import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import ProjectModule from '../project/project.module';
import WorkspaceModule from '../workspace/workspace.module';
import TaskController from './task.controller';
import TaskEntity from './task.entity';
import TaskService from './task.service';
import TaskMetaController from './task-meta.controller';

@Module({
  imports: [MikroOrmModule.forFeature([TaskEntity]), WorkspaceModule, ProjectModule],
  controllers: [TaskMetaController, TaskController],
  providers: [TaskService],
})
class TaskModule {}

export default TaskModule;
