import { Entity, Enum, ManyToOne, type Opt, Property } from '@mikro-orm/core';

import UserEntity from '@/modules/user/user.entity';

import { TaskStatus } from '@/shared/constants/task-status';
import BaseEntity from '@/shared/entities/base.entity';

import ProjectEntity from '../project/project.entity';
import TaskRepository from './task.repository';

@Entity({ tableName: 'tasks', repository: () => TaskRepository })
class TaskEntity extends BaseEntity {
  @Property({ length: 150, index: true })
  title: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'datetime', nullable: true })
  dueDate: Date | null = null;

  @Enum(() => TaskStatus)
  @Property({ default: TaskStatus.TODO })
  status: TaskStatus & Opt = TaskStatus.TODO;

  @ManyToOne({ entity: () => ProjectEntity, deleteRule: 'cascade' })
  project: ProjectEntity;

  @ManyToOne({ entity: () => UserEntity, deleteRule: 'set null', nullable: true })
  assignee: UserEntity | null = null;
}

export default TaskEntity;
