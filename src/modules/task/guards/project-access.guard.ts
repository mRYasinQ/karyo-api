import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';

import type { Request } from 'express';

import ProjectService from '@/modules/project/project.service';

import TaskMessage from '../task.message';

@Injectable()
class ProjectAccessGuard implements CanActivate {
  constructor(private readonly projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const projectId = Number(request.params.projectId);
    const workspaceId = request.activeWorkspace?.id;

    if (!projectId || !workspaceId) throw new BadRequestException(TaskMessage.PROJECT_NOT_FOUND);

    const isProjectValid = await this.projectService.checkExistProjectInWorkspaceWithId(workspaceId, projectId);
    if (!isProjectValid) throw new BadRequestException(TaskMessage.PROJECT_NOT_FOUND);

    return true;
  }
}

export default ProjectAccessGuard;
