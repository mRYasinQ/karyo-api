import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

import { WorkspaceRole } from '@/shared/constants/workspace-role';
import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentWorkspace from '@/shared/decorators/current-workspace.decorator';
import SetWorkspacePolicy from '@/shared/decorators/workspace-policy.decorator';

import type { ActiveWorkspace } from '@/shared/types/global';

import { CreateProjectDto, GetProjectsQueryDto, UpdateProjectDto } from './dtos/project.dto';
import {
  CreateProjectResponseDto,
  DeleteProjectResponseDto,
  GetProjectResponseDto,
  GetProjectsResponseDto,
  UpdaterProjectResponseDto,
} from './dtos/project-response.dto';
import ProjectMessage from './project.message';
import ProjectService from './project.service';

@Controller('projects')
@ApiHeader({
  name: 'x-workspace-id',
  description: 'The ID of the workspace to which the project belongs.',
  required: true,
})
class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: ProjectMessage.PROJECT_GET,
    summary: 'Get all projects',
    type: GetProjectsResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true })
  getProjects(@Query() query: GetProjectsQueryDto, @CurrentWorkspace() currentWorkspace: ActiveWorkspace) {
    return this.projectService.findAllInWorkspace(currentWorkspace.id, query);
  }

  @Get('/:slug')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: ProjectMessage.PROJECT_GET,
    summary: 'Get project with slug',
    type: GetProjectResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true })
  async getProject(@Param('slug') slug: string, @CurrentWorkspace() currentWorkspace: ActiveWorkspace) {
    const project = await this.projectService.findOne({ slug, workspace: { id: currentWorkspace.id } }, { fields: ['workspace.*'] });
    if (!project) throw new BadRequestException(ProjectMessage.PROJECT_NOT_FOUND);

    return project;
  }

  @Post()
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: ProjectMessage.PROJECT_CREATED,
    summary: 'Create project',
    type: CreateProjectResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true, roles: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN] })
  createProject(@Body() body: CreateProjectDto, @CurrentWorkspace() currentWorkspace: ActiveWorkspace) {
    return this.projectService.create(currentWorkspace.id, body);
  }

  @Patch('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: ProjectMessage.PROJECT_UPDATED,
    summary: 'Update a project',
    type: UpdaterProjectResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true, roles: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN] })
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProjectDto,
    @CurrentWorkspace() currentWorkspace: ActiveWorkspace,
  ) {
    return this.projectService.update(id, currentWorkspace.id, body);
  }

  @Delete('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: ProjectMessage.PROJECT_DELETED,
    summary: 'Delete a project',
    type: DeleteProjectResponseDto,
    secure: 'required',
  })
  @SetWorkspacePolicy({ requireActive: true, roles: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN] })
  deleteProject(@Param('id', ParseIntPipe) id: number, @CurrentWorkspace() currentWorkspace: ActiveWorkspace) {
    return this.projectService.delete(id, currentWorkspace.id);
  }
}

export default ProjectController;
