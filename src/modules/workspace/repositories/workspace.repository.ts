import { EntityRepository } from '@mikro-orm/postgresql';

import WorkspaceEntity from '../entities/workspace.entity';

class WorkspaceRepository extends EntityRepository<WorkspaceEntity> {}

export default WorkspaceRepository;
