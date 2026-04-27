import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/postgresql';

import BaseEntity from '@/shared/entities/base.entity';

import WorkspaceEntity from '../workspace/entities/workspace.entity';
import ProjectRepository from './project.repository';

@Entity({ tableName: 'projects', repository: () => ProjectRepository })
@Unique({ properties: ['slug', 'workspace'] })
class ProjectEntity extends BaseEntity {
  @Property({ length: 50 })
  name: string;

  @Property({ length: 150 })
  slug: string;

  @Property({ length: 200, nullable: true })
  description: string | null = null;

  @Property({ default: false })
  isArchived: boolean = false;

  @Property({ type: 'datetime', nullable: true })
  startDate: Date | null = null;

  @Property({ type: 'datetime', nullable: true })
  endDate: Date | null = null;

  @ManyToOne({ entity: () => WorkspaceEntity, deleteRule: 'cascade' })
  workspace: WorkspaceEntity;
}

export default ProjectEntity;
