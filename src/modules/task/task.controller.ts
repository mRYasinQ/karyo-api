import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiHeader, ApiParam } from '@nestjs/swagger';

import { WorkspaceRole } from '@/shared/constants/workspace-role';
import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentWorkspace from '@/shared/decorators/current-workspace.decorator';

import type { ActiveWorkspace } from '@/shared/types/global';

import SetProjectPolicy from './decorators/project-policy.decorator';
import { CreateTaskDto, GetTasksQueryDto, UpdateTaskDto, UpdateTaskStatusDto } from './dtos/task.dto';
import {
  CreateTaskResponseDto,
  DeleteTaskResponseDto,
  GetTaskResponseDto,
  GetTasksResponseDto,
  UpdateTaskResponseDto,
} from './dtos/task-response.dto';
import TaskMessage from './task.message';
import TaskService from './task.service';

@Controller('projects/:projectId/tasks')
@ApiHeader({
  name: 'x-workspace-id',
  description: 'The ID of the workspace to which the project belongs.',
  required: true,
})
@ApiParam({
  name: 'projectId',
  description: 'The ID of the project to which the task belongs.',
  type: 'number',
  required: true,
})
class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TaskMessage.TASKS_GET,
    summary: 'Get all tasks in project',
    type: GetTasksResponseDto,
    secure: 'required',
  })
  @SetProjectPolicy({ requireActive: true })
  getTasks(@Param('projectId', ParseIntPipe) projectId: number, @Query() query: GetTasksQueryDto) {
    return this.taskService.findAllInProject(projectId, query);
  }

  @Get('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TaskMessage.TASK_GET,
    summary: 'Get a task',
    type: GetTaskResponseDto,
    secure: 'required',
  })
  @SetProjectPolicy({ requireActive: true })
  async getTask(@Param('projectId', ParseIntPipe) projectId: number, @Param('id', ParseIntPipe) id: number) {
    const task = await this.taskService.findOne({ id, project: { id: projectId } }, { populate: ['assignee'] });
    if (!task) throw new BadRequestException(TaskMessage.TASK_NOT_FOUND);

    return task;
  }

  @Post()
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: TaskMessage.TASK_CREATED,
    summary: 'Create task',
    type: CreateTaskResponseDto,
    secure: 'required',
  })
  @SetProjectPolicy({ requireActive: true, roles: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN] })
  createTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateTaskDto,
    @CurrentWorkspace() currentWorkspace: ActiveWorkspace,
  ) {
    return this.taskService.create(projectId, currentWorkspace.id, body);
  }

  @Patch('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TaskMessage.TASK_UPDATED,
    summary: 'Update a task',
    type: UpdateTaskResponseDto,
    secure: 'required',
  })
  @SetProjectPolicy({ requireActive: true, roles: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN] })
  updateTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
    @CurrentWorkspace() currentWorkspace: ActiveWorkspace,
  ) {
    return this.taskService.update(id, projectId, currentWorkspace.id, body);
  }

  @Patch('/:id/status')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TaskMessage.TASK_UPDATED,
    summary: 'Update task status',
    type: UpdateTaskResponseDto,
    secure: 'required',
  })
  @SetProjectPolicy({ requireActive: true, roles: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER] })
  updateTaskStatus(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskStatusDto,
    @CurrentWorkspace() currentWorkspace: ActiveWorkspace,
  ) {
    return this.taskService.update(id, projectId, currentWorkspace.id, body);
  }

  @Delete('/:id')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TaskMessage.TASK_DELETED,
    summary: 'Delete a task',
    type: DeleteTaskResponseDto,
    secure: 'required',
  })
  @SetProjectPolicy({ requireActive: true, roles: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN] })
  deleteTask(@Param('projectId', ParseIntPipe) projectId: number, @Param('id', ParseIntPipe) id: number) {
    return this.taskService.delete(id, projectId);
  }
}

export default TaskController;
