import { Entity, ManyToOne, type Opt, Property } from '@mikro-orm/postgresql';

import BaseEntity from '@/shared/entities/base.entity';

import RoleEntity from '../role/role.entity';
import UserRepository from './user.repository';

@Entity({ tableName: 'users', repository: () => UserRepository })
class UserEntity extends BaseEntity {
  @Property({ length: 30, nullable: true })
  firstName: string | null = null;

  @Property({ length: 30, nullable: true })
  lastName: string | null = null;

  @Property({ unique: true })
  email: string;

  @Property({ length: 30, unique: true })
  username: string;

  @Property({ type: 'text' })
  password: string;

  @Property()
  isActive: boolean & Opt = true;

  @Property()
  isEmailVerified: boolean & Opt = false;

  @ManyToOne({ entity: () => RoleEntity, deleteRule: 'set null', nullable: true, index: true })
  role: RoleEntity | null = null;

  @Property({ type: 'date', nullable: true })
  birthday: Date | null = null;
}

export default UserEntity;
