import { Entity, Opt, Property } from '@mikro-orm/postgresql';

import BaseEntity from '@/shared/entities/base.entity';

@Entity({ tableName: 'users' })
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

  @Property({ type: 'date', nullable: true })
  birthday: Date | null = null;
}

export default UserEntity;
