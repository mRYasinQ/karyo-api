import { EntityRepository } from '@mikro-orm/postgresql';

import RoleEntity from './role.entity';

class RoleRepository extends EntityRepository<RoleEntity> {}

export default RoleRepository;
