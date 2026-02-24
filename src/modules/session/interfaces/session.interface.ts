import type { RequiredEntityData } from '@mikro-orm/postgresql';

import SessionEntity from '../session.entity';

type CreateSession = Omit<RequiredEntityData<SessionEntity>, 'id' | 'user' | 'createdAt' | 'updatedAt'> & {
  userId: number;
};

export type { CreateSession };
