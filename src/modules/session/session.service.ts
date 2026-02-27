import { Injectable } from '@nestjs/common';

import { EntityManager, type FilterQuery } from '@mikro-orm/postgresql';

import type { FindOneMethod } from '@/shared/types/service';

import UserEntity from '../user/user.entity';
import type { CreateSession } from './interfaces/session.interface';
import SessionEntity from './session.entity';
import SessionRepository from './session.repository';

@Injectable()
class SessionService {
  constructor(
    private readonly em: EntityManager,
    private readonly sessionRep: SessionRepository,
  ) {}

  findOneById: FindOneMethod<SessionEntity, number> = (id, options?) => {
    return this.sessionRep.findOne({ id }, options);
  };

  findOneByToken: FindOneMethod<SessionEntity, FilterQuery<SessionEntity>> = (filter, options?) => {
    return this.sessionRep.findOne(filter, options);
  };

  async create(data: CreateSession) {
    const user = this.em.getReference(UserEntity, data.userId);
    const session = this.sessionRep.create({ ...data, user });

    await this.em.persist(session).flush();

    return session;
  }

  deleteById(id: number) {
    return this.sessionRep.nativeDelete({ id });
  }
}

export default SessionService;
