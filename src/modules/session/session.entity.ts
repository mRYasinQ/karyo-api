import { Entity, Index, ManyToOne, Property } from '@mikro-orm/postgresql';

import BaseEntity from '@/shared/entities/base.entity';

import UserEntity from '../user/user.entity';
import SessionRepository from './session.repository';

@Entity({ tableName: 'sessions', repository: () => SessionRepository })
class SessionEntity extends BaseEntity {
  @Property({ length: 60 })
  browser: string;

  @Property({ length: 60 })
  os: string;

  @Index()
  @Property({ length: 80, unique: true })
  token: string;

  @ManyToOne({ entity: () => UserEntity, deleteRule: 'cascade' })
  user: UserEntity;

  @Property()
  expireAt: Date;
}

export default SessionEntity;
