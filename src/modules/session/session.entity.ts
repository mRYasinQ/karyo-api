import { Entity, ManyToOne, Opt, Property } from '@mikro-orm/postgresql';

import BaseEntity from '@/shared/entities/base.entity';

import UserEntity from '../user/user.entity';
import SessionRepository from './session.repository';

@Entity({ tableName: 'sessions', repository: () => SessionRepository })
class SessionEntity extends BaseEntity {
  @Property({ length: 60 })
  browser: string;

  @Property({ length: 60 })
  os: string;

  @Property({ length: 80, unique: true, index: true })
  token: string;

  @ManyToOne({ entity: () => UserEntity, deleteRule: 'cascade', lazy: true })
  user: UserEntity;

  @Property({ persist: false })
  isCurrent: boolean & Opt = false;

  @Property()
  expireAt: Date;
}

export default SessionEntity;
