import { EntityRepository } from '@mikro-orm/postgresql';

import ProjectEntity from './project.entity';

class ProjectRepository extends EntityRepository<ProjectEntity> {}

export default ProjectRepository;
