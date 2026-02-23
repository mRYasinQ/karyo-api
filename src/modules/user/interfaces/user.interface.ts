import type { EntityData, RequiredEntityData } from '@mikro-orm/postgresql';

import UserEntity from '../user.entity';

interface CreateUser extends Omit<RequiredEntityData<UserEntity>, 'username'> {
  username?: string;
}

type UpdateUser = Partial<Omit<EntityData<UserEntity>, 'id' | 'createdAt' | 'updatedAt'>>;

export type { CreateUser, UpdateUser };
