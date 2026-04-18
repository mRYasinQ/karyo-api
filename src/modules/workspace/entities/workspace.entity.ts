import { Collection, Entity, OneToMany, Property } from '@mikro-orm/postgresql';

import BaseEntity from '@/shared/entities/base.entity';

import WorkspaceRepository from '../repositories/workspace.repository';
import WorkspaceMemberEntity from './member.entity';

@Entity({ repository: () => WorkspaceRepository })
class WorkspaceEntity extends BaseEntity {
  @Property({ length: 50 })
  name: string;

  @Property({ unique: true })
  slug: string;

  @Property({ nullable: true })
  logo: string | null = null;

  @Property({ length: 200, nullable: true })
  description: string | null = null;

  @OneToMany(() => WorkspaceMemberEntity, (member) => member.workspace)
  members = new Collection<WorkspaceMemberEntity>(this);
}

export default WorkspaceEntity;
