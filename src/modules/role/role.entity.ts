import { Entity, type Opt, Property } from '@mikro-orm/postgresql';

import type { Permission } from '@/shared/constants/permission';
import BaseEntity from '@/shared/entities/base.entity';

import RoleRepository from './role.repository';

@Entity({ tableName: 'roles', repository: () => RoleRepository })
class RoleEntity extends BaseEntity {
  @Property({ length: 150, unique: true })
  name: string;

  @Property({ type: 'array' })
  permissions: Permission[] & Opt = [];
}

export default RoleEntity;
