import { Entity, Enum, ManyToOne, Property, Unique } from '@mikro-orm/postgresql';

import UserEntity from '@/modules/user/user.entity';

import { WorkspaceRole } from '../constants/workspace-role.constant';
import WorkspaceMemberRepository from '../repositories/member.repository';
import WorkspaceEntity from './workspace.entity';

@Entity({ repository: () => WorkspaceMemberRepository })
@Unique({ properties: ['user', 'workspace'] })
class WorkspaceMemberEntity {
  @ManyToOne({ entity: () => WorkspaceEntity, primary: true, deleteRule: 'cascade' })
  workspace: WorkspaceEntity;

  @ManyToOne({ entity: () => UserEntity, primary: true, deleteRule: 'cascade' })
  user: UserEntity;

  @Enum(() => WorkspaceRole)
  @Property({ default: WorkspaceRole.MEMBER })
  role: WorkspaceRole;

  @Property({ type: 'datetime' })
  joinedAt: Date = new Date();
}

export default WorkspaceMemberEntity;
