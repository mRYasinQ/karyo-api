import { RequiredEntityData } from '@mikro-orm/postgresql';

import UserEntity from '../user.entity';

interface CreateUser extends Omit<RequiredEntityData<UserEntity>, 'username'> {
  username?: string;
}

export type { CreateUser };
