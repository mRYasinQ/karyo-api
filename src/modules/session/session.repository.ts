import { EntityRepository } from '@mikro-orm/postgresql';

import SessionEntity from './session.entity';

class SessionRepository extends EntityRepository<SessionEntity> {}

export default SessionRepository;
