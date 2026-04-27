import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import ProjectController from './project.controller';
import ProjectEntity from './project.entity';

@Module({
  imports: [MikroOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectController],
})
class ProjectModule {}

export default ProjectModule;
