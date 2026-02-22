import { EntityRepository } from '@mikro-orm/postgresql';

import UserEntity from './user.entity';

class UserRepository extends EntityRepository<UserEntity> {}

export default UserRepository;
