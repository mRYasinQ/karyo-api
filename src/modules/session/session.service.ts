import { Injectable } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';

import UserEntity from '../user/user.entity';
import type { CreateSession } from './interfaces/session.interface';
import SessionRepository from './session.repository';

@Injectable()
class SessionService {
  constructor(
    private readonly em: EntityManager,
    private readonly sessionRep: SessionRepository,
  ) {}

  async create(data: CreateSession) {
    const user = this.em.getReference(UserEntity, data.userId);
    const session = this.sessionRep.create({ ...data, user });

    await this.em.persist(session).flush();

    return session;
  }
}

export default SessionService;
