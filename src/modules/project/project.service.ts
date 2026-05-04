import { BadRequestException, Injectable } from '@nestjs/common';

import type { EntityData, FilterQuery, RequiredEntityData } from '@mikro-orm/postgresql';
import { EntityManager, wrap } from '@mikro-orm/postgresql';

import { toCamelCase } from '@/shared/utils/case-transformer';
import { getPaginationOptions, paginate } from '@/shared/utils/pagination';

import type { FindOneMethod } from '@/shared/types/service';

import WorkspaceEntity from '../workspace/entities/workspace.entity';
import type { CreateProject, GetProjectsQuery, UpdateProject } from './dtos/project.dto';
import ProjectEntity from './project.entity';
import ProjectMessage from './project.message';
import ProjectRepository from './project.repository';

@Injectable()
class ProjectService {
  constructor(
    private readonly em: EntityManager,
    private readonly projectRepo: ProjectRepository,
  ) {}

  async findAllInWorkspace(workspaceId: number, query: GetProjectsQuery) {
    const { page, ...findOptions } = getPaginationOptions({ query });
    const where = this.buildWhereClause(workspaceId, query);

    const [data, total] = await this.projectRepo.findAndCount(where, { ...findOptions, populate: ['workspace.*'] });

    return paginate(data, total, page, findOptions.limit);
  }

  findOne: FindOneMethod<ProjectEntity, FilterQuery<ProjectEntity>> = (filter, options?) => {
    return this.projectRepo.findOne(filter, options);
  };

  async create(workspaceId: number, data: CreateProject) {
    const isExistProject = await this.checkExistProjectInWorkspace(workspaceId, data.slug);
    if (isExistProject) throw new BadRequestException(ProjectMessage.SLUG_EXIST);

    const newProjectData = toCamelCase<RequiredEntityData<ProjectEntity>>(data);
    const workspace = this.em.getReference(WorkspaceEntity, workspaceId);
    newProjectData.workspace = workspace;

    const project = this.projectRepo.create({ ...newProjectData });
    await this.em.flush();

    return project;
  }

  async update(id: number, workspaceId: number, data: UpdateProject) {
    const project = await this.findOne({ id, workspace: { id: workspaceId } }, { fields: ['id', 'slug'] });
    if (!project) throw new BadRequestException(ProjectMessage.PROJECT_NOT_FOUND);

    const { slug } = data;
    if (slug && slug !== project.slug) {
      const isExist = await this.checkExistProjectInWorkspace(workspaceId, slug);
      if (isExist) throw new BadRequestException(ProjectMessage.SLUG_EXIST);
    }

    const newProjectData = toCamelCase<EntityData<ProjectEntity>>(data);
    wrap(project).assign(newProjectData);
    await this.em.flush();

    return;
  }

  async delete(id: number, workspaceId: number) {
    const deleteCount = await this.projectRepo.nativeDelete({ id, workspace: { id: workspaceId } });
    if (!deleteCount) throw new BadRequestException(ProjectMessage.PROJECT_NOT_FOUND);

    return;
  }

  async checkExistProjectInWorkspace(workspaceId: number, slug: string) {
    const project = await this.projectRepo.findOne({ workspace: { id: workspaceId }, slug }, { fields: ['id'] });
    return Boolean(project);
  }

  private buildWhereClause(workspaceId: number, query: GetProjectsQuery) {
    const { search, is_archived, start_date, end_date } = query;

    const where: FilterQuery<ProjectEntity> = {
      workspace: { id: workspaceId },
    };

    if (search) where.name = { $ilike: `%${search}%` };
    if (is_archived !== undefined) where.isArchived = is_archived;
    if (start_date) where.startDate = { $gte: new Date(start_date) };
    if (end_date) where.endDate = { $lte: new Date(end_date) };

    return where;
  }
}

export default ProjectService;
