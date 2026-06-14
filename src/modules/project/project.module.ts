import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import WorkspaceModule from '../workspace/workspace.module';
import ProjectController from './project.controller';
import ProjectEntity from './project.entity';
import ProjectService from './project.service';

@Module({
  imports: [MikroOrmModule.forFeature([ProjectEntity]), WorkspaceModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
class ProjectModule {}

export default ProjectModule;
