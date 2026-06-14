import { EntityRepository } from '@mikro-orm/postgresql';

import TaskEntity from './task.entity';

class TaskRepository extends EntityRepository<TaskEntity> {}

export default TaskRepository;
