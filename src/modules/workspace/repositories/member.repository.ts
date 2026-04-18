import { EntityRepository } from '@mikro-orm/postgresql';

import WorkspaceMemberEntity from '../entities/member.entity';

class WorkspaceMemberRepository extends EntityRepository<WorkspaceMemberEntity> {}

export default WorkspaceMemberRepository;
