import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/postgresql';

@Entity({ abstract: true })
abstract class BaseEntity {
  @PrimaryKey()
  id: number;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();
}

export default BaseEntity;
