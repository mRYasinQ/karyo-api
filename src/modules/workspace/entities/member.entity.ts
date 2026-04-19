import { Entity, Enum, ManyToOne, type Opt, Property, Unique } from '@mikro-orm/postgresql';

import UserEntity from '@/modules/user/user.entity';

import { WorkspaceRole } from '@/shared/constants/workspace-role';

import WorkspaceMemberRepository from '../repositories/member.repository';
import WorkspaceEntity from './workspace.entity';

@Entity({ tableName: 'workspace_members', repository: () => WorkspaceMemberRepository })
@Unique({ properties: ['user', 'workspace'] })
class WorkspaceMemberEntity {
  @ManyToOne({ entity: () => WorkspaceEntity, primary: true, deleteRule: 'cascade' })
  workspace: WorkspaceEntity;

  @ManyToOne({ entity: () => UserEntity, primary: true, deleteRule: 'cascade' })
  user: UserEntity;

  @Property({ default: false })
  isActive: boolean & Opt = false;

  @Enum(() => WorkspaceRole)
  @Property({ default: WorkspaceRole.MEMBER })
  role: WorkspaceRole & Opt = WorkspaceRole.MEMBER;

  @Property({ type: 'datetime' })
  joinedAt: Date & Opt = new Date();
}

export default WorkspaceMemberEntity;
