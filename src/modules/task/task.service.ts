import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import type { EntityData, FilterQuery, RequiredEntityData } from '@mikro-orm/postgresql';
import { EntityManager, wrap } from '@mikro-orm/postgresql';

import UserEntity from '@/modules/user/user.entity';

import { toCamelCase } from '@/shared/utils/case-transformer';
import { getPaginationOptions, paginate } from '@/shared/utils/pagination';

import type { FindOneMethod } from '@/shared/types/service';

import ProjectEntity from '../project/project.entity';
import WorkspaceService from '../workspace/workspace.service';
import type { CreateTask, GetTasksQuery, UpdateTask } from './dtos/task.dto';
import TaskEntity from './task.entity';
import TaskMessage from './task.message';
import TaskRepository from './task.repository';

@Injectable()
class TaskService {
  constructor(
    private readonly em: EntityManager,
    private readonly taskRepo: TaskRepository,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async findAllInProject(projectId: number, query: GetTasksQuery) {
    const { page, ...findOptions } = getPaginationOptions({ query });
    const where = this.buildWhereClause(projectId, query);

    const [data, total] = await this.taskRepo.findAndCount(where, {
      ...findOptions,
      populate: ['assignee'],
    });

    return paginate(data, total, page, findOptions.limit);
  }

  findOne: FindOneMethod<TaskEntity, FilterQuery<TaskEntity>> = (filter, options?) => {
    return this.taskRepo.findOne(filter, options);
  };

  async create(projectId: number, workspaceId: number, data: CreateTask) {
    const newTaskData = toCamelCase<RequiredEntityData<TaskEntity>>(data);
    const { assignee_id } = data;

    newTaskData.project = this.em.getReference(ProjectEntity, projectId);
    if (assignee_id) {
      await this.checkIsUserWorkspaceMember(workspaceId, assignee_id);
      newTaskData.assignee = this.em.getReference(UserEntity, assignee_id);
    }

    const task = this.taskRepo.create({ ...newTaskData });
    await this.em.flush();

    return task;
  }

  async update(id: number, projectId: number, workspaceId: number, data: UpdateTask) {
    const task = await this.findOne({ id, project: { id: projectId } }, { fields: ['id'] });
    if (!task) throw new NotFoundException(TaskMessage.TASK_NOT_FOUND);

    const newTaskData = toCamelCase<EntityData<TaskEntity>>(data);
    const { assignee_id } = data;

    if (assignee_id !== undefined) {
      if (assignee_id === null) {
        newTaskData.assignee = null;
      } else {
        await this.checkIsUserWorkspaceMember(workspaceId, assignee_id);
        newTaskData.assignee = this.em.getReference(UserEntity, assignee_id);
      }
    }

    wrap(task).assign(newTaskData);
    await this.em.flush();

    return;
  }

  async delete(id: number, projectId: number) {
    const deleteCount = await this.taskRepo.nativeDelete({ id, project: { id: projectId } });
    if (!deleteCount) throw new NotFoundException(TaskMessage.TASK_NOT_FOUND);

    return;
  }

  private async checkIsUserWorkspaceMember(workspaceId: number, userId: number) {
    const isMember = await this.workspaceService.checkIsUserWorkspaceMember(workspaceId, userId);
    if (!isMember) throw new BadRequestException(TaskMessage.INVALID_ASSIGNEE);

    return true;
  }

  private buildWhereClause(projectId: number, query: GetTasksQuery) {
    const { search, status, assignee_id } = query;

    const where: FilterQuery<TaskEntity> = {
      project: { id: projectId },
    };

    if (search) where.title = { $ilike: `%${search}%` };
    if (status) where.status = status;
    if (assignee_id) where.assignee = { id: assignee_id };

    return where;
  }
}

export default TaskService;
